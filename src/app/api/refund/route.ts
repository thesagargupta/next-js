import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { orderId, amount } = await req.json();

  // In a real application, you would interact with the payment gateway's refund API here.
  console.log(`Simulating refund for Order ID: ${orderId}, Amount: ${amount}`);

  if (orderId && amount) {
    return NextResponse.json({ success: true, message: `Refund of ${amount} processed for order ${orderId}` });
  } else {
    return NextResponse.json({ success: false, message: 'Missing orderId or amount' }, { status: 400 });
  }
}