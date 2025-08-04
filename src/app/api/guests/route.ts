import { NextResponse } from 'next/server';

let guestUsers = [
  { id: 1, name: 'Guest User 1', email: 'guest1@example.com' },
  { id: 2, name: 'Guest User 2', email: 'guest2@example.com' },
];

export async function GET() {
  return NextResponse.json(guestUsers);
}

export async function POST(req: Request) {
  const { name, email } = await req.json();
  if (!name || !email) {
    return NextResponse.json({ message: 'Name and email are required' }, { status: 400 });
  }
  const newGuest = { id: guestUsers.length + 1, name, email };
  guestUsers.push(newGuest);
  return NextResponse.json(newGuest, { status: 201 });
}

export async function DELETE(request: Request) {
  const { id } = await request.json();
  const initialLength = guestUsers.length;
  guestUsers = guestUsers.filter(guest => guest.id !== id);

  if (guestUsers.length < initialLength) {
    return new Response(null, { status: 204 }); // No Content
  } else {
    return new Response('Guest user not found', { status: 404 });
  }
}