import { NextResponse } from 'next/server';

let products = [
  {
    id: 1,
    name: 'A4 Portrait Photo Book',
    description: 'A classic choice to showcase your memories.',
    price: '₹2,499',
    image: '/Photobook_A4_portrait_PDP_Copy_5.webp',
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
    image: '/stowe-modern-metal-frames-z.jpg',
    category: 'Frames',
    subcategory: 'Metal'
  },
];

export async function GET() {
  return NextResponse.json(products);
}

export async function POST(req: Request) {
  const { name, description, price, image, category, subcategory } = await req.json();
  const newProduct = { id: products.length + 1, name, description, price, image, category, subcategory };
  products.push(newProduct);
  return NextResponse.json(newProduct, { status: 201 });
}