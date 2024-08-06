import { NextResponse } from 'next/server';

const AUDIENCE_ID = '7cec04a785';
const API_KEY = process.env.MAILCHIMP_API_KEY;
const SERVER_PREFIX = process.env.MAILCHIMP_SERVER_PREFIX;

export async function POST(request: Request) {
  console.log('API_KEY:', API_KEY ? 'Set' : 'Not set');
  console.log('SERVER_PREFIX:', SERVER_PREFIX ? 'Set' : 'Not set');

  if (!API_KEY || !SERVER_PREFIX) {
    console.error('Mailchimp configuration is missing');
    return NextResponse.json({ error: 'Server configuration error', details: { API_KEY: !!API_KEY, SERVER_PREFIX: !!SERVER_PREFIX } }, { status: 500 });
  }

  const { email } = await request.json();

  if (!email) {
    return NextResponse.json({ error: 'Email is required' }, { status: 400 });
  }

  const data = {
    email_address: email,
    status: 'subscribed',
  };

  try {
    const response = await fetch(
      `https://${SERVER_PREFIX}.api.mailchimp.com/3.0/lists/${AUDIENCE_ID}/members`,
      {
        method: 'POST',
        headers: {
          Authorization: `apikey ${API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      }
    );

    const responseData = await response.json();

    if (response.ok) {
      console.log('New subscriber added:', responseData);
      return NextResponse.json({ message: 'Successfully subscribed', id: responseData.id }, { status: 200 });
    } else {
      if (responseData.title === 'Member Exists') {
        return NextResponse.json({ error: 'You are already subscribed to this list' }, { status: 400 });
      }
      throw new Error(responseData.detail || 'Unknown error occurred');
    }
  } catch (error: any) {
    console.error('Mailchimp error:', error);
    return NextResponse.json({ error: 'An error occurred while subscribing', details: error.message }, { status: 500 });
  }
}