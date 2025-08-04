'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

interface ContentSection {
  id: number;
  title: string;
  slug: string;
  content: string;
}

const AdminContentPage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [contentSections, setContentSections] = useState<ContentSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newTitle, setNewTitle] = useState('');
  const [newSlug, setNewSlug] = useState('');
  const [newContent, setNewContent] = useState('');
  const [editingSection, setEditingSection] = useState<ContentSection | null>(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    } else if (status === 'authenticated') {
      fetchContentSections();
    }
  }, [status, router]);

  const fetchContentSections = async () => {
    try {
      const res = await fetch('/api/content');
      if (!res.ok) {
        throw new Error('Failed to fetch content sections');
      }
      const data = await res.json();
      setContentSections(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddSection = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title: newTitle, slug: newSlug, content: newContent }),
      });
      if (!res.ok) {
        throw new Error('Failed to add content section');
      }
      setNewTitle('');
      setNewSlug('');
      setNewContent('');
      fetchContentSections();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleEditSection = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSection) return;
    try {
      const res = await fetch('/api/content', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: editingSection.id, title: newTitle, slug: newSlug, content: newContent }),
      });
      if (!res.ok) {
        throw new Error('Failed to update content section');
      }
      setNewTitle('');
      setNewSlug('');
      setNewContent('');
      setEditingSection(null);
      fetchContentSections();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleDeleteSection = async (id: number) => {
    try {
      const res = await fetch('/api/content', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) {
        throw new Error('Failed to delete content section');
      }
      fetchContentSections();
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
      <h1 className="text-4xl font-bold text-center text-gray-800 mb-12">Manage Dynamic Content</h1>
      <div className="bg-white shadow-md rounded-lg p-8 mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">{editingSection ? 'Edit Content Section' : 'Add New Content Section'}</h2>
        <form onSubmit={editingSection ? handleEditSection : handleAddSection}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="title">Title</label>
            <input type="text" id="title" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" required />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="slug">Slug</label>
            <input type="text" id="slug" value={newSlug} onChange={(e) => setNewSlug(e.target.value)} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" required />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="content">Content</label>
            <textarea id="content" value={newContent} onChange={(e) => setNewContent(e.target.value)} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" required></textarea>
          </div>
          <div className="flex items-center justify-between">
            <button type="submit" className="bg-gray-800 text-white font-bold py-2 px-4 rounded-full hover:bg-gray-700 focus:outline-none focus:shadow-outline">
              {editingSection ? 'Update Section' : 'Add Section'}
            </button>
            {editingSection && (
              <button type="button" onClick={() => { setEditingSection(null); setNewTitle(''); setNewSlug(''); setNewContent(''); }} className="bg-gray-500 text-white font-bold py-2 px-4 rounded-full hover:bg-gray-600 focus:outline-none focus:shadow-outline">
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="bg-white shadow-md rounded-lg p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Existing Content Sections</h2>
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Slug</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {contentSections.map((section) => (
              <tr key={section.id}>
                <td className="px-6 py-4 whitespace-nowrap">{section.title}</td>
                <td className="px-6 py-4 whitespace-nowrap">{section.slug}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button onClick={() => { setEditingSection(section); setNewTitle(section.title); setNewSlug(section.slug); setNewContent(section.content); }} className="text-indigo-600 hover:text-indigo-900 mr-4">Edit</button>
                  <button onClick={() => handleDeleteSection(section.id)} className="text-red-600 hover:text-red-900">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminContentPage;