'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

interface Subcategory {
  id: number;
  name: string;
}

interface Category {
  id: number;
  name: string;
  subcategories: Subcategory[];
}

const AdminCategoriesPage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newSubcategoryName, setNewSubcategoryName] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | ''>('');
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [editingSubcategory, setEditingSubcategory] = useState<Subcategory | null>(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    } else if (status === 'authenticated') {
      fetchCategories();
    }
  }, [status, router]);

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/categories');
      if (!res.ok) {
        throw new Error('Failed to fetch categories');
      }
      const data = await res.json();
      setCategories(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newCategoryName }),
      });
      if (!res.ok) throw new Error('Failed to add category');
      setNewCategoryName('');
      fetchCategories();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleAddSubcategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCategoryId) {
      alert('Please select a parent category.');
      return;
    }
    try {
      const res = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newSubcategoryName, parentId: selectedCategoryId }),
      });
      if (!res.ok) throw new Error('Failed to add subcategory');
      setNewSubcategoryName('');
      fetchCategories();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleEditCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory) return;
    try {
      const res = await fetch('/api/categories', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: editingCategory.id, name: newCategoryName }),
      });
      if (!res.ok) throw new Error('Failed to update category');
      setEditingCategory(null);
      setNewCategoryName('');
      fetchCategories();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleEditSubcategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSubcategory || !selectedCategoryId) return;
    try {
      const res = await fetch('/api/categories', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: editingSubcategory.id, name: newSubcategoryName, parentId: selectedCategoryId }),
      });
      if (!res.ok) throw new Error('Failed to update subcategory');
      setEditingSubcategory(null);
      setNewSubcategoryName('');
      fetchCategories();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleDeleteCategory = async (id: number) => {
    if (!confirm('Are you sure you want to delete this category and all its subcategories?')) return;
    try {
      const res = await fetch('/api/categories', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) throw new Error('Failed to delete category');
      fetchCategories();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleDeleteSubcategory = async (id: number, parentId: number) => {
    if (!confirm('Are you sure you want to delete this subcategory?')) return;
    try {
      const res = await fetch('/api/categories', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, parentId }),
      });
      if (!res.ok) throw new Error('Failed to delete subcategory');
      fetchCategories();
    } catch (err: any) {
      setError(err.message);
    }
  };

  if (status === 'loading' || loading) {
    return <div className="container mx-auto px-4 py-16 text-center">Loading...</div>;
  }

  if (error) {
    return <div className="container mx-auto px-4 py-16 text-center text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold text-center text-gray-800 mb-12">Manage Categories & Subcategories</h1>

      <div className="bg-white shadow-md rounded-lg p-8 mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">{editingCategory ? 'Edit Category' : 'Add New Category'}</h2>
        <form onSubmit={editingCategory ? handleEditCategory : handleAddCategory} className="mb-4">
          <input
            type="text"
            placeholder="Category Name"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-2"
            required
          />
          <button type="submit" className="bg-gray-800 text-white px-4 py-2 rounded-full hover:bg-gray-700">
            {editingCategory ? 'Update Category' : 'Add Category'}
          </button>
          {editingCategory && (
            <button type="button" onClick={() => { setEditingCategory(null); setNewCategoryName(''); }} className="ml-2 bg-gray-500 text-white px-4 py-2 rounded-full hover:bg-gray-600">
              Cancel
            </button>
          )}
        </form>

        <h2 className="text-2xl font-bold text-gray-800 mb-4">{editingSubcategory ? 'Edit Subcategory' : 'Add New Subcategory'}</h2>
        <form onSubmit={editingSubcategory ? handleEditSubcategory : handleAddSubcategory}>
          <select
            value={selectedCategoryId}
            onChange={(e) => setSelectedCategoryId(parseInt(e.target.value))}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-2"
          >
            <option value="">Select Parent Category</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Subcategory Name"
            value={newSubcategoryName}
            onChange={(e) => setNewSubcategoryName(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-2"
            required
          />
          <button type="submit" className="bg-gray-800 text-white px-4 py-2 rounded-full hover:bg-gray-700">
            {editingSubcategory ? 'Update Subcategory' : 'Add Subcategory'}
          </button>
          {editingSubcategory && (
            <button type="button" onClick={() => { setEditingSubcategory(null); setNewSubcategoryName(''); setSelectedCategoryId(''); }} className="ml-2 bg-gray-500 text-white px-4 py-2 rounded-full hover:bg-gray-600">
              Cancel
            </button>
          )}
        </form>
      </div>

      <div className="bg-white shadow-md rounded-lg p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Existing Categories</h2>
        {categories.map(category => (
          <div key={category.id} className="mb-6 border-b pb-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-xl font-bold text-gray-800">{category.name}</h3>
              <div>
                <button onClick={() => { setEditingCategory(category); setNewCategoryName(category.name); }} className="text-indigo-600 hover:text-indigo-900 mr-4">Edit</button>
                <button onClick={() => handleDeleteCategory(category.id)} className="text-red-600 hover:text-red-900">Delete</button>
              </div>
            </div>
            {category.subcategories.length > 0 && (
              <ul className="list-disc pl-5">
                {category.subcategories.map(sub => (
                  <li key={sub.id} className="flex justify-between items-center py-1">
                    <span>{sub.name}</span>
                    <div>
                      <button onClick={() => { setEditingSubcategory(sub); setNewSubcategoryName(sub.name); setSelectedCategoryId(category.id); }} className="text-indigo-600 hover:text-indigo-900 mr-4">Edit</button>
                      <button onClick={() => handleDeleteSubcategory(sub.id, category.id)} className="text-red-600 hover:text-red-900">Delete</button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminCategoriesPage;