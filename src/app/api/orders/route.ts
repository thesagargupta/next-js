import { NextResponse } from 'next/server';

let orders = [
  {
    id: 1,
    customerName: 'John Doe',
    total: '₹5,197',
    status: 'New',
    items: [
      { productId: 1, name: 'A4 Portrait Photo Book', quantity: 1, price: '₹2,499' },
      { productId: 3, name: 'Classic Wooden Frame', quantity: 2, price: '₹1,299' },
    ],
  },
  {
    id: 2,
    customerName: 'Jane Smith',
    total: '₹2,499',
    status: 'Processing',
    items: [
      { productId: 2, name: 'A4 Landscape Photo Book', quantity: 1, price: '₹2,499' },
    ],
  },
];

export async function GET() {
  return NextResponse.json(orders);
}
