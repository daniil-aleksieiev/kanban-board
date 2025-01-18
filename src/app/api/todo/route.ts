import { NextResponse } from 'next/server';

const BASE_URL = process.env.PAGES_URL;
const PAGE_ID = process.env.PAGE_ID;

export async function GET() {
  try {
    const response = await fetch(`${BASE_URL}?slug=to-do-list`);

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch data from external API', status: response.status },
        { status: response.status },
      );
    }

    const data = await response.json();

    if (Array.isArray(data) && data.length > 0 && data[0].acf.tasks) {
      return NextResponse.json(data[0].acf.tasks);
    }

    return NextResponse.json([]);
  } catch (error) {
    return NextResponse.json({ error: 'An unexpected error occurred', details: String(error) }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const newList = await request.json();

    const auth_header = request.headers.get('Authorization') ?? '';

    const response = await fetch(`${BASE_URL}/${PAGE_ID}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: auth_header,
      },
      body: JSON.stringify({
        fields: { tasks: newList },
      }),
    });

    return NextResponse.json({ message: 'Data updated successfully', status: response.status });
  } catch (error) {
    console.error('Error processing PATCH request:', error);
    return NextResponse.json({ error: 'Failed to process the PATCH request', details: String(error) }, { status: 500 });
  }
}
