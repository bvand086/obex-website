import { client } from '@/trigger';

export const runtime = 'edge';

export async function POST(req: Request) {
  // Handle the webhook
  return client.handleRequest(req);
} 