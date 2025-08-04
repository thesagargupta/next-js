import { NextResponse } from 'next/server';

let faqs = [
  { id: 1, question: 'What is a photo book?', answer: 'A photo book is a personalized album of your photos printed and bound into a book.' },
  { id: 2, question: 'How do I upload my photos?', answer: 'You can upload your photos on the product customization page.' },
];

export async function GET() {
  return NextResponse.json(faqs);
}

export async function POST(req: Request) {
  const { question, answer } = await req.json();
  const newFaq = { id: faqs.length + 1, question, answer };
  faqs.push(newFaq);
  return NextResponse.json(newFaq, { status: 201 });
}

export async function PUT(req: Request) {
  const { id, question, answer } = await req.json();
  const faqIndex = faqs.findIndex(f => f.id === id);

  if (faqIndex !== -1) {
    faqs[faqIndex] = { ...faqs[faqIndex], question, answer };
    return NextResponse.json(faqs[faqIndex]);
  } else {
    return new Response('FAQ not found', { status: 404 });
  }
}

export async function DELETE(request: Request) {
  const { id } = await request.json();
  const initialLength = faqs.length;
  faqs = faqs.filter(f => f.id !== id);

  if (faqs.length < initialLength) {
    return new Response(null, { status: 204 }); // No Content
  } else {
    return new Response('FAQ not found', { status: 404 });
  }
}