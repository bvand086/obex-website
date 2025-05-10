import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Missing STRIPE_SECRET_KEY environment variable');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-04-10',
});

export async function POST(request: NextRequest) {
  try {
    const { code } = await request.json();
    
    if (!code || typeof code !== 'string' || code.trim() === '') {
      return NextResponse.json(
        { valid: false, message: 'No discount code provided' },
        { status: 400 }
      );
    }

    // First try to find it as a promotion code (customer-facing code)
    const promotionCodes = await stripe.promotionCodes.list({
      code: code.trim(),
      active: true,
      limit: 1,
    });

    if (promotionCodes.data.length > 0) {
      const promoCode = promotionCodes.data[0];
      
      // Check if the promotion code is valid
      if (!promoCode.active) {
        return NextResponse.json(
          { valid: false, message: 'This discount code is inactive' },
          { status: 200 }
        );
      }

      // Get the associated coupon details
      const couponId = promoCode.coupon.id;
      const coupon = await stripe.coupons.retrieve(couponId);
      
      if (!coupon.valid) {
        return NextResponse.json(
          { valid: false, message: 'This discount code has expired' },
          { status: 200 }
        );
      }

      // Return discount information
      return NextResponse.json({
        valid: true,
        promoId: promoCode.id,
        couponId: coupon.id,
        percentOff: coupon.percent_off,
        amountOff: coupon.amount_off,
        currency: coupon.currency,
        message: `${code} applied successfully`,
      });
    }

    // Not found as a promotion code
    return NextResponse.json(
      { valid: false, message: 'Invalid discount code' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error validating discount code:', error);
    return NextResponse.json(
      { valid: false, message: 'Error validating discount code' },
      { status: 500 }
    );
  }
} 