import { NextResponse } from 'next/server';

const ADMIN_URL = process.env.ADMIN_URL ?? '';
const USERNAME = process.env.USERNAME;
const PASSWORD = process.env.PASSWORD;

export async function POST() {
  try {
    const response = await fetch(ADMIN_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: USERNAME,
        password: PASSWORD,
      }),
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch data from external API', status: response.status },
        { status: response.status },
      );
    }

    const data = await response.json();

    return NextResponse.json(data.token);
  } catch (error) {
    return NextResponse.json({ error: 'An unexpected error occurred', details: String(error) }, { status: 500 });
  }
}
