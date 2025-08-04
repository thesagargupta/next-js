import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const orderId = searchParams.get('orderId');

  // Simulate tracking data
  const trackingData = {
    orderId: orderId,
    trackingNumber: `SR${Math.floor(Math.random() * 1000000000)}`,
    status: 'In Transit',
    estimatedDelivery: '2025-08-10',
    history: [
      { timestamp: '2025-08-04T10:00:00Z', location: 'Warehouse', description: 'Order picked up' },
      { timestamp: '2025-08-04T14:30:00Z', location: 'Sorting Hub', description: 'Departed sorting hub' },
    ],
  };

  if (orderId) {
    return NextResponse.json(trackingData);
  } else {
    return new Response('Order ID is required', { status: 400 });
  }
}