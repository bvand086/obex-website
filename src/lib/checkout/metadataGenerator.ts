import { getFlavorDetails } from './flavorUtils';

interface CartItem {
  priceId: string;
  quantity: number;
  flavorName?: string;
  flavor_breakdown?: string;
  flavor_counts?: Record<string, number>;
  free_shipping?: boolean;
  pricePerUnit: number;
}

export function generateMetadata(validCartItems: CartItem[]) {
  return {
    cart_details: JSON.stringify(validCartItems.map(item => {
      const flavorInfo = getFlavorDetails(item);
      
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
      const flavorInfo = getFlavorDetails(item);
      return `${item.quantity} bottles: ${flavorInfo}`;
    }).join(' | '),
    
    shipping_flavors: validCartItems.map(item => {
      return getFlavorDetails(item);
    }).join(' | '),
    
    total_bottles: validCartItems.reduce((sum, item) => sum + item.quantity, 0).toString(),
    
    // Add a clear shipping guide at the top level
    SHIPPING_GUIDE: validCartItems.map(item => {
      const flavorInfo = getFlavorDetails(item);
      return `SHIP: ${item.quantity} bottles - ${flavorInfo}`;
    }).join(' | ')
  };
}