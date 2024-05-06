import Stripe from "stripe";
import { NextResponse, NextRequest } from "next/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2024-04-10',
});

export async function handler(req: NextRequest, res: NextResponse) {
    
    const payload = await req.text();
    const response = JSON.parse(payload);

    const sig = req.headers.get('stripe-signature');

    const dateTime = new Date(response?.created * 1000).toLocaleDateString();
    const timeString = new Date(response?.created * 1000).toLocaleTimeString();

    try {
        let event = stripe.webhooks.constructEvent(
            payload, 
            sig!, 
            process.env.STRIPE_WEBHOOK_SECRET!
        );

        console.log("event", event.type);

        return NextResponse.json({status: "success", eventType: event.type}, {status: 200});
    } catch (err: any) {
        return NextResponse.json({error: err.message}, {status: 400});
    }
}
