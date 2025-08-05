import { NextResponse } from 'next/server';

let products = [
  {
    id: 1,
    name: 'A4 Portrait Photo Book',
    description: 'A classic choice to showcase your memories.',
    price: '₹2,499',
    image: '/swiateczny_czas_00.png',
    category: 'Photo Books',
    subcategory: 'A4 Portrait'
  },
  {
    id: 2,
    name: 'A4 Landscape Photo Book',
    description: 'Perfect for panoramic shots and wide landscapes.',
    price: '₹2,499',
    image: '/miodowy_miesiac_00_0.png',
    category: 'Photo Books',
    subcategory: 'A4 Landscape'
  },
  {
    id: 3,
    name: 'Classic Wooden Frame',
    description: 'A timeless frame to complement any photo.',
    price: '₹1,299',
    image: '/1-Classical-Ornate-Brown-Gold-Frame-0.jpg',
    category: 'Frames',
    subcategory: 'Wooden'
  },
  {
    id: 4,
    name: 'Modern Metal Frame',
    description: 'Sleek and stylish for a contemporary look.',
    price: '₹1,499',
    image: '/placeholder.svg',
    category: 'Frames',
    subcategory: 'Metal'
  },
];

export async function GET(request: Request) {
  const id = request.url.split('/').pop();
  const product = products.find(p => p.id === parseInt(id!));
  if (product) {
    return NextResponse.json(product);
  } else {
    return new Response('Product not found', { status: 404 });
  }
}

export async function DELETE(request: Request) {
  const id = request.url.split('/').pop();
  const initialLength = products.length;
  products = products.filter(p => p.id !== parseInt(id!));

  if (products.length < initialLength) {
    return new Response(null, { status: 204 }); // No Content
  } else {
    return new Response('Product not found', { status: 404 });
  }
}

export async function PUT(request: Request) {
  const id = request.url.split('/').pop();
  const { name, description, price, image, category, subcategory } = await request.json();
  const productIndex = products.findIndex(p => p.id === parseInt(id!));

  if (productIndex !== -1) {
    products[productIndex] = { ...products[productIndex], name, description, price, image, category, subcategory };
    return NextResponse.json(products[productIndex]);
  } else {
    return new Response('Product not found', { status: 404 });
  }
}