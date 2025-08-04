import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { orderId, customerName, totalAmount, items } = await req.json();

  // In a real application, you would generate a proper GST invoice document (PDF, etc.)
  // and potentially store it or send it to the customer.
  console.log(`Generating mock GST Invoice for Order ID: ${orderId}`);

  const invoiceDetails = {
    invoiceId: `INV-${Date.now()}`,
    orderId,
    customerName,
    totalAmount,
    gstAmount: (totalAmount * 0.18).toFixed(2), // Assuming 18% GST
    netAmount: (totalAmount / 1.18).toFixed(2),
    items,
    date: new Date().toISOString().split('T')[0],
  };

  return NextResponse.json({ success: true, message: 'Mock GST Invoice generated', invoice: invoiceDetails });
}