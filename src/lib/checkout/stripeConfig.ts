import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Missing STRIPE_SECRET_KEY environment variable');
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-04-10',
});

export const SERVER_FLAVORS = [
  { id: 'mint', name: 'Smooth Mint' },
  { id: 'lemon', name: 'Lemon Meringue' },
  { id: 'orange', name: 'Orange Cream' }
];