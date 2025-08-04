import { NextResponse } from 'next/server';

let contentSections = [
  { id: 1, title: 'About Us Section', slug: 'about-us', content: 'This is the dynamic content for the About Us page.' },
  { id: 2, title: 'Terms & Conditions', slug: 'terms-conditions', content: 'These are the terms and conditions.' },
];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get('slug');

  if (slug) {
    const section = contentSections.find(s => s.slug === slug);
    if (section) {
      return NextResponse.json(section);
    } else {
      return new Response('Content not found', { status: 404 });
    }
  }
  return NextResponse.json(contentSections);
}

export async function POST(req: Request) {
  const { title, slug, content } = await req.json();
  const newSection = { id: contentSections.length + 1, title, slug, content };
  contentSections.push(newSection);
  return NextResponse.json(newSection, { status: 201 });
}

export async function PUT(req: Request) {
  const { id, title, slug, content } = await req.json();
  const sectionIndex = contentSections.findIndex(s => s.id === id);

  if (sectionIndex !== -1) {
    contentSections[sectionIndex] = { ...contentSections[sectionIndex], title, slug, content };
    return NextResponse.json(contentSections[sectionIndex]);
  } else {
    return new Response('Content not found', { status: 404 });
  }
}

export async function DELETE(request: Request) {
  const { id } = await request.json();
  const initialLength = contentSections.length;
  contentSections = contentSections.filter(s => s.id !== id);

  if (contentSections.length < initialLength) {
    return new Response(null, { status: 204 }); // No Content
  } else {
    return new Response('Content not found', { status: 404 });
  }
}