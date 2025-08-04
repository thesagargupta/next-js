import { NextResponse } from 'next/server';

let categories = [
  { id: 1, name: 'Photo Books', subcategories: [{ id: 101, name: 'A4 Portrait' }, { id: 102, name: 'A4 Landscape' }] },
  { id: 2, name: 'Frames', subcategories: [{ id: 201, name: 'Wooden' }, { id: 202, name: 'Metal' }] },
];

export async function GET() {
  return NextResponse.json(categories);
}

export async function POST(req: Request) {
  const { name, parentId } = await req.json();
  if (parentId) {
    // Add subcategory
    const parentCategory = categories.find(cat => cat.id === parentId);
    if (parentCategory) {
      const newSubcategoryId = Math.max(...parentCategory.subcategories.map(sub => sub.id), 0) + 1;
      const newSubcategory = { id: newSubcategoryId, name };
      parentCategory.subcategories.push(newSubcategory);
      return NextResponse.json(newSubcategory, { status: 201 });
    } else {
      return new Response('Parent category not found', { status: 404 });
    }
  } else {
    // Add main category
    const newCategoryId = Math.max(...categories.map(cat => cat.id), 0) + 1;
    const newCategory = { id: newCategoryId, name, subcategories: [] };
    categories.push(newCategory);
    return NextResponse.json(newCategory, { status: 201 });
  }
}

export async function PUT(req: Request) {
  const { id, name, parentId } = await req.json();

  if (parentId) {
    // Update subcategory
    const parentCategory = categories.find(cat => cat.id === parentId);
    if (parentCategory) {
      const subcategoryIndex = parentCategory.subcategories.findIndex(sub => sub.id === id);
      if (subcategoryIndex !== -1) {
        parentCategory.subcategories[subcategoryIndex] = { ...parentCategory.subcategories[subcategoryIndex], name };
        return NextResponse.json(parentCategory.subcategories[subcategoryIndex]);
      } else {
        return new Response('Subcategory not found', { status: 404 });
      }
    } else {
      return new Response('Parent category not found', { status: 404 });
    }
  } else {
    // Update main category
    const categoryIndex = categories.findIndex(cat => cat.id === id);
    if (categoryIndex !== -1) {
      categories[categoryIndex] = { ...categories[categoryIndex], name };
      return NextResponse.json(categories[categoryIndex]);
    } else {
      return new Response('Category not found', { status: 404 });
    }
  }
}

export async function DELETE(request: Request) {
  const { id, parentId } = await request.json();

  if (parentId) {
    // Delete subcategory
    const parentCategory = categories.find(cat => cat.id === parentId);
    if (parentCategory) {
      const initialLength = parentCategory.subcategories.length;
      parentCategory.subcategories = parentCategory.subcategories.filter(sub => sub.id !== id);
      if (parentCategory.subcategories.length < initialLength) {
        return new Response(null, { status: 204 });
      } else {
        return new Response('Subcategory not found', { status: 404 });
      }
    } else {
      return new Response('Parent category not found', { status: 404 });
    }
  } else {
    // Delete main category
    const initialLength = categories.length;
    categories = categories.filter(cat => cat.id !== id);
    if (categories.length < initialLength) {
      return new Response(null, { status: 204 });
    } else {
      return new Response('Category not found', { status: 404 });
    }
  }
}