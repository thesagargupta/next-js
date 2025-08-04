import { NextResponse } from 'next/server';

// Mock orders data (same as in api/orders/route.ts)
const orders = [
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
  const headers = [
    'Order ID',
    'Customer Name',
    'Total',
    'Status',
    'Items (Name x Quantity @ Price)',
  ];

  const csvRows = orders.map(order => {
    const itemDetails = order.items.map(item => 
      `${item.name} x ${item.quantity} @ ${item.price}`
    ).join('; ');
    return `"${order.id}","${order.customerName}","${order.total}","${order.status}","${itemDetails}"`;
  });

  const csv = [headers.join(','), ...csvRows].join('\n');

  return new Response(csv, {
    status: 200,
    headers: {
      'Content-Type': 'text/csv',
      'Content-Disposition': 'attachment; filename="orders.csv"',
    },
  });
}