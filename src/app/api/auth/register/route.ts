import { NextResponse } from 'next/server';
import { addUser, findUserByEmail } from '@/lib/users';

export async function POST(req: Request) {
  const { name, email, password } = await req.json();

  if (!name || !email || !password) {
    return NextResponse.json({ message: 'Missing name, email, or password' }, { status: 400 });
  }

  if (findUserByEmail(email)) {
    return NextResponse.json({ message: 'User with this email already exists' }, { status: 409 });
  }

  const newUser = addUser(name, email, password);

  return NextResponse.json({ message: 'User registered successfully!', user: { id: newUser.id, name: newUser.name, email: newUser.email } }, { status: 201 });
}