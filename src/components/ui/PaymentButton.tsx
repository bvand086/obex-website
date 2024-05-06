import { loadStripe } from '@stripe/stripe-js';
import { useState } from 'react';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY!);

interface PaymentButtonProps {
  children?: React.ReactNode;
}

export default function PaymentButton({ children }: PaymentButtonProps) {
    const [loading, setLoading] = useState(false);

    // const handleClick = async () => {
    //     setLoading(true);
    //     const stripe = await stripePromise;
    //     const response = await fetch('/api/checkout_session', {
    //         method: 'POST',
    //         headers: {
    //             'Content-Type': 'application/json',
    //         },
    //         body: JSON.stringify({
    //             items: [
    //                 {
    //                     price: "price_1PDFsSCzamtkVis606a8dfSD",
    //                     quantity: 1,
    //                 },
    //             ],
    //         }),
    //     });

    //     if (response.ok) {
    //         const session = await response.json();
    //         await stripe?.redirectToCheckout({ sessionId: session.id });
    //     } else {
    //         console.error('Failed to create checkout session');
    //         alert('Failed to create checkout session');
    //     }
    //     setLoading(false);
    // };

    // return (
    //     <button onClick={handleClick} disabled={loading}>
    //         {loading ? 'Processing...' : children || 'Buy Now'}
    //     </button>
    // );
}
