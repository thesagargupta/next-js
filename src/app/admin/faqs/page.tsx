'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

interface FAQ {
  id: number;
  question: string;
  answer: string;
}

const AdminFaqsPage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newQuestion, setNewQuestion] = useState('');
  const [newAnswer, setNewAnswer] = useState('');
  const [editingFaq, setEditingFaq] = useState<FAQ | null>(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    } else if (status === 'authenticated') {
      fetchFaqs();
    }
  }, [status, router]);

  const fetchFaqs = async () => {
    try {
      const res = await fetch('/api/faqs');
      if (!res.ok) {
        throw new Error('Failed to fetch FAQs');
      }
      const data = await res.json();
      setFaqs(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddFaq = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/faqs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question: newQuestion, answer: newAnswer }),
      });
      if (!res.ok) {
        throw new Error('Failed to add FAQ');
      }
      setNewQuestion('');
      setNewAnswer('');
      fetchFaqs();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleEditFaq = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingFaq) return;
    try {
      const res = await fetch('/api/faqs', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: editingFaq.id, question: newQuestion, answer: newAnswer }),
      });
      if (!res.ok) {
        throw new Error('Failed to update FAQ');
      }
      setNewQuestion('');
      setNewAnswer('');
      setEditingFaq(null);
      fetchFaqs();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleDeleteFaq = async (id: number) => {
    try {
      const res = await fetch('/api/faqs', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) {
        throw new Error('Failed to delete FAQ');
      }
      fetchFaqs();
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
      <h1 className="text-4xl font-bold text-center text-gray-800 mb-12">Manage FAQs</h1>
      <div className="bg-white shadow-md rounded-lg p-8 mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">{editingFaq ? 'Edit FAQ' : 'Add New FAQ'}</h2>
        <form onSubmit={editingFaq ? handleEditFaq : handleAddFaq}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="question">Question</label>
            <input type="text" id="question" value={newQuestion} onChange={(e) => setNewQuestion(e.target.value)} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" required />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="answer">Answer</label>
            <textarea id="answer" value={newAnswer} onChange={(e) => setNewAnswer(e.target.value)} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" required></textarea>
          </div>
          <div className="flex items-center justify-between">
            <button type="submit" className="bg-gray-800 text-white font-bold py-2 px-4 rounded-full hover:bg-gray-700 focus:outline-none focus:shadow-outline">
              {editingFaq ? 'Update FAQ' : 'Add FAQ'}
            </button>
            {editingFaq && (
              <button type="button" onClick={() => { setEditingFaq(null); setNewQuestion(''); setNewAnswer(''); }} className="bg-gray-500 text-white font-bold py-2 px-4 rounded-full hover:bg-gray-600 focus:outline-none focus:shadow-outline">
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="bg-white shadow-md rounded-lg p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Existing FAQs</h2>
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Question</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {faqs.map((faq) => (
              <tr key={faq.id}>
                <td className="px-6 py-4 whitespace-nowrap">{faq.question}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button onClick={() => { setEditingFaq(faq); setNewQuestion(faq.question); setNewAnswer(faq.answer); }} className="text-indigo-600 hover:text-indigo-900 mr-4">Edit</button>
                  <button onClick={() => handleDeleteFaq(faq.id)} className="text-red-600 hover:text-red-900">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminFaqsPage;