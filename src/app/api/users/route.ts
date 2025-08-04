import { NextResponse } from 'next/server';

const users = [
  { id: 1, name: 'Test User', email: 'user@example.com' },
  { id: 2, name: 'Jane Doe', email: 'jane@example.com' },
];

export async function GET() {
  return NextResponse.json(users);
}