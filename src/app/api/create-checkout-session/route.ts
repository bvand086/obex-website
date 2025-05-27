import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Missing STRIPE_SECRET_KEY environment variable');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-04-10',
});

// Define server-side version of the FLAVORS array
const SERVER_FLAVORS = [
  { id: 'mint', name: 'Smooth Mint' },
  { id: 'lemon', name: 'Lemon Meringue' },
  { id: 'orange', name: 'Orange Cream' }
];

  // Helper function to check if a string contains any flavour names
function containsFlavorName(str: string): boolean {
  if (!str) return false;
  const lowercaseStr = str.toLowerCase();
  return SERVER_FLAVORS.some(flavor => lowercaseStr.includes(flavor.name.toLowerCase()));
}

interface CartItem {
  priceId: string;
  quantity: number;
  flavorName?: string;
  flavor_breakdown?: string; // Readable breakdown of flavours (e.g. "Mint: 2, Cherry: 3")
  flavor_counts?: Record<string, number>; // Structured format of flavor IDs to quantities
  free_shipping?: boolean;
  pricePerUnit: number; // Added to receive discounted price from frontend
}

interface CheckoutRequest {
  cartItems: CartItem[];
  couponCode?: string;
}

export async function POST(request: NextRequest) {
  try {
    const requestData = await request.json() as (CartItem[] | CheckoutRequest);
    
    // Handle both formats for backward compatibility
    let cartItems: CartItem[] = [];
    let couponCode: string | undefined;
    
    if (Array.isArray(requestData)) {
      // Old format: direct array of cart items
      cartItems = requestData;
    } else {
      // New format: object with cartItems and optional couponCode
      cartItems = requestData.cartItems;
      couponCode = requestData.couponCode;
    }

    if (!Array.isArray(cartItems) || cartItems.length === 0) {
      return NextResponse.json({ error: 'Invalid cart data' }, { status: 400 });
    }

    // Filter out any items with empty or invalid priceIds
    const validCartItems = cartItems.filter(item => 
      item.priceId && typeof item.priceId === 'string' && item.priceId.trim() !== ''
    );

    if (validCartItems.length === 0) {
      return NextResponse.json({ 
        error: 'No valid items in cart. Please check product price IDs.' 
      }, { status: 400 });
    }

    // Check if any item has free shipping
    const hasFreeShipping = validCartItems.some(item => item.free_shipping === true);

    // ALTERNATIVE APPROACH: Don't use priceId but create a line item with adjustable pricing
    // This works in both test and live modes regardless of price ID existence
    const line_items = validCartItems.map((item) => {
      // Format flavour breakdown for the product name and description
      let flavorDetails = item.flavor_breakdown;
      
              // If flavor_breakdown is empty or appears to be a package name (not containing any flavour names)
      if (!flavorDetails || 
          !containsFlavorName(flavorDetails) || 
          flavorDetails.toLowerCase().includes('package')) {
        
                  // Use flavorName if it contains actual flavour information
        if (item.flavorName && containsFlavorName(item.flavorName)) {
          flavorDetails = item.flavorName;
        } else {
          // Generate default even distribution if all else fails
          const baseCount = Math.floor(item.quantity / SERVER_FLAVORS.length);
          const remainder = item.quantity % SERVER_FLAVORS.length;
          
          flavorDetails = SERVER_FLAVORS.map((flavor, index: number) => {
            const count = baseCount + (index < remainder ? 1 : 0);
            return `${flavor.name}: ${count}`;
          }).join(', ');
        }
      }

      return {
        quantity: item.quantity,
        price_data: {
          currency: 'cad',
          product_data: {
            name: `ØBEX Reflux Relief - SHIP: ${flavorDetails}`,
            description: `IMPORTANT - FLAVOURS TO SHIP: ${flavorDetails}`,
            metadata: {
              flavors_to_ship: flavorDetails || 'Not specified',
              flavor_counts: JSON.stringify(item.flavor_counts || {}),
              flavor_summary: `Total: ${item.quantity} bottles - ${flavorDetails}`
            },
          },
          unit_amount: Math.round(item.pricePerUnit * 100), // Use discounted price from frontend
        }
      };
    });

    const origin = request.headers.get('origin') || 'http://localhost:3000';
    const success_url = `${origin}/success?session_id={CHECKOUT_SESSION_ID}`;
    const cancel_url = `${origin}/cancel`;

    // Prepare shipping options
    let shipping_options: Stripe.Checkout.SessionCreateParams.ShippingOption[];

    if (hasFreeShipping) {
      // Premium Tier: Standard is free, Express is an upgrade cost
      shipping_options = [
        {
          shipping_rate_data: {
            type: 'fixed_amount',
            fixed_amount: {
              amount: 0, // $0.00 for standard
              currency: 'cad',
            },
            display_name: 'Standard Shipping (Included)',
            delivery_estimate: {
              minimum: { unit: 'business_day', value: 5 },
              maximum: { unit: 'business_day', value: 10 },
            },
          },
        },
        {
          shipping_rate_data: {
            type: 'fixed_amount',
            fixed_amount: {
              amount: 669, // $6.69 for express upgrade
              currency: 'cad',
            },
            display_name: 'Express Shipping (Upgrade)',
            delivery_estimate: {
              minimum: { unit: 'business_day', value: 1 },
              maximum: { unit: 'business_day', value: 3 },
            },
          },
        },
      ];
    } else {
      // Starter/Value Tiers: Regular shipping prices
      shipping_options = [
        {
          shipping_rate_data: {
            type: 'fixed_amount',
            fixed_amount: {
              amount: 629, // $6.29 standard shipping fee
              currency: 'cad',
            },
            display_name: 'Standard Shipping',
            delivery_estimate: {
              minimum: { unit: 'business_day', value: 5 },
              maximum: { unit: 'business_day', value: 10 },
            },
          },
        },
        {
          shipping_rate_data: {
            type: 'fixed_amount',
            fixed_amount: {
              amount: 1299, // $12.99 express shipping fee
              currency: 'cad',
            },
            display_name: 'Express Shipping',
            delivery_estimate: {
              minimum: { unit: 'business_day', value: 1 },
              maximum: { unit: 'business_day', value: 3 },
            },
          },
        },
      ];
    }

    // Prepare checkout session configuration
    const checkoutConfig: Stripe.Checkout.SessionCreateParams = {
      payment_method_types: ['card'],
      line_items: line_items,
      mode: 'payment',
      success_url: success_url,
      cancel_url: cancel_url,
      shipping_address_collection: {
        allowed_countries: ['CA'],
      },
      shipping_options,
              metadata: {
          cart_details: JSON.stringify(validCartItems.map(item => {
            // Ensure flavour information is never a package name
            let flavorInfo = item.flavor_breakdown || item.flavorName || 'Not specified';
            
            // Check if flavour info appears to be a package name
          if (!containsFlavorName(flavorInfo) || 
              flavorInfo.toLowerCase().includes('package')) {
            // Generate default even distribution
            const baseCount = Math.floor(item.quantity / SERVER_FLAVORS.length);
            const remainder = item.quantity % SERVER_FLAVORS.length;
            
            flavorInfo = SERVER_FLAVORS.map((flavor, index: number) => {
              const count = baseCount + (index < remainder ? 1 : 0);
              return `${flavor.name}: ${count}`;
            }).join(', ');
          }
          
          return {
            order_summary: `${item.quantity} bottles - ${flavorInfo}`,
            ship_flavors: flavorInfo,
            quantity: item.quantity,
            flavor: item.flavorName,
            flavor_breakdown: item.flavor_breakdown || '',
            flavor_details: item.flavor_counts || {},
            free_shipping: item.free_shipping || false
          };
        })),
        // Add summarized flavour information at the top level
        flavors_summary: validCartItems.map(item => {
          let flavorInfo = item.flavor_breakdown || item.flavorName || 'Not specified';
          
          // Check if flavour info appears to be a package name
          if (!containsFlavorName(flavorInfo) || 
              flavorInfo.toLowerCase().includes('package')) {
            // Generate default even distribution
            const baseCount = Math.floor(item.quantity / SERVER_FLAVORS.length);
            const remainder = item.quantity % SERVER_FLAVORS.length;
            
            flavorInfo = SERVER_FLAVORS.map((flavor, index: number) => {
              const count = baseCount + (index < remainder ? 1 : 0);
              return `${flavor.name}: ${count}`;
            }).join(', ');
          }
          
          return `${item.quantity} bottles: ${flavorInfo}`;
        }).join(' | '),
        shipping_flavors: validCartItems.map(item => {
          let flavorInfo = item.flavor_breakdown || item.flavorName || 'Not specified';
          
          // Check if flavour info appears to be a package name
          if (!containsFlavorName(flavorInfo) || 
              flavorInfo.toLowerCase().includes('package')) {
            // Generate default even distribution
            const baseCount = Math.floor(item.quantity / SERVER_FLAVORS.length);
            const remainder = item.quantity % SERVER_FLAVORS.length;
            
            flavorInfo = SERVER_FLAVORS.map((flavor, index: number) => {
              const count = baseCount + (index < remainder ? 1 : 0);
              return `${flavor.name}: ${count}`;
            }).join(', ');
          }
          
          return flavorInfo;
        }).join(' | '),
        total_bottles: validCartItems.reduce((sum, item) => sum + item.quantity, 0).toString(),
        // Add a clear shipping guide at the top level
        SHIPPING_GUIDE: validCartItems.map(item => {
          let flavorInfo = item.flavor_breakdown || item.flavorName || 'Not specified';
          
          // Check if flavour info appears to be a package name
          if (!containsFlavorName(flavorInfo) || 
              flavorInfo.toLowerCase().includes('package')) {
            // Generate default even distribution
            const baseCount = Math.floor(item.quantity / SERVER_FLAVORS.length);
            const remainder = item.quantity % SERVER_FLAVORS.length;
            
            flavorInfo = SERVER_FLAVORS.map((flavor, index: number) => {
              const count = baseCount + (index < remainder ? 1 : 0);
              return `${flavor.name}: ${count}`;
            }).join(', ');
          }
          
          return `SHIP: ${item.quantity} bottles - ${flavorInfo}`;
        }).join(' | ')
      },
    };

    // Apply coupon code if provided
    if (couponCode && couponCode.trim() !== '') {
      try {
        // First try to find it as a promotion code (customer-facing code)
        const promotionCodes = await stripe.promotionCodes.list({
          code: couponCode.trim(),
          active: true,
          limit: 1,
        });
        
        if (promotionCodes.data.length > 0) {
          // Found a valid promotion code
          checkoutConfig.discounts = [{ promotion_code: promotionCodes.data[0].id }];
          console.log(`Applied promotion code: ${couponCode} (${promotionCodes.data[0].id})`);
        } else {
          // If not found as promotion code, try as coupon (for backward compatibility)
          try {
            const coupon = await stripe.coupons.retrieve(couponCode.trim());
            checkoutConfig.discounts = [{ coupon: coupon.id }];
            console.log(`Applied direct coupon: ${couponCode}`);
          } catch (couponError) {
            console.error(`Coupon not found: ${couponCode}`, couponError);
          }
        }
      } catch (discountError) {
        // Log the error but continue with checkout without the coupon
        console.error(`Error processing discount code: ${couponCode}`, discountError);
      }
    }

    const session = await stripe.checkout.sessions.create(checkoutConfig);

    if (session.url) {
      return NextResponse.json({ checkoutUrl: session.url }, { status: 200 });
    } else {
      throw new Error('Failed to create Stripe session URL.');
    }

  } catch (error) {
    console.error('Error creating Stripe checkout session:', error);
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ error: `Failed to create checkout session: ${errorMessage}` }, { status: 500 });
  }
} 