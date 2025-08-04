'use client';

import { useEffect, useState } from 'react';

interface FAQ {
  id: number;
  question: string;
  answer: string;
}

const FaqsPage = () => {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
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

    fetchFaqs();
  }, []);

  if (loading) {
    return <div className="container mx-auto px-4 py-16 text-center">Loading...</div>;
  }

  if (error) {
    return <div className="container mx-auto px-4 py-16 text-center text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold text-center text-gray-800 mb-12">Frequently Asked Questions</h1>
      <div className="max-w-3xl mx-auto">
        {faqs.map((faq) => (
          <div key={faq.id} className="bg-white shadow-md rounded-lg p-6 mb-4">
            <h2 className="text-xl font-bold text-gray-800 mb-2">{faq.question}</h2>
            <p className="text-gray-600">{faq.answer}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FaqsPage;