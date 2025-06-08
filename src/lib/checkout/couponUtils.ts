import Stripe from 'stripe';
import { stripe } from './stripeConfig';

export async function applyCouponToCheckout(
  couponCode: string,
  checkoutConfig: Stripe.Checkout.SessionCreateParams
): Promise<void> {
  if (!couponCode || couponCode.trim() === '') return;

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