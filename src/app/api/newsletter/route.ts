import { NextResponse } from 'next/server';

let subscribers: { id: number; email: string }[] = [];

export async function GET() {
  return NextResponse.json(subscribers);
}

export async function POST(req: Request) {
  const { email } = await req.json();
  if (!email) {
    return NextResponse.json({ message: 'Email is required' }, { status: 400 });
  }
  const newSubscriber = { id: subscribers.length + 1, email };
  subscribers.push(newSubscriber);
  return NextResponse.json({ message: 'Subscribed successfully!' }, { status: 201 });
}

export async function DELETE(request: Request) {
  const { id } = await request.json();
  const initialLength = subscribers.length;
  subscribers = subscribers.filter(s => s.id !== id);

  if (subscribers.length < initialLength) {
    return new Response(null, { status: 204 }); // No Content
  } else {
    return new Response('Subscriber not found', { status: 404 });
  }
}