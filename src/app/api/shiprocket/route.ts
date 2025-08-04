import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { orderId, status } = await req.json();

  // In a real application, you would interact with the ShipRocket API here
  console.log(`Simulating ShipRocket update for Order ID: ${orderId}, new status: ${status}`);

  if (orderId && status) {
    return NextResponse.json({ success: true, message: `ShipRocket status updated for order ${orderId} to ${status}` });
  } else {
    return NextResponse.json({ success: false, message: 'Missing orderId or status' }, { status: 400 });
  }
}