'use client';

import { useEffect, useState } from 'react';

interface ContentSection {
  id: number;
  title: string;
  slug: string;
  content: string;
}

const PoliciesPage = () => {
  const [content, setContent] = useState<ContentSection | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const res = await fetch('/api/content?slug=policies');
        if (!res.ok) {
          throw new Error('Failed to fetch content');
        }
        const data = await res.json();
        setContent(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, []);

  if (loading) {
    return <div className="container mx-auto px-4 py-16 text-center">Loading...</div>;
  }

  if (error) {
    return <div className="container mx-auto px-4 py-16 text-center text-red-500">{error}</div>;
  }

  if (!content) {
    return <div className="container mx-auto px-4 py-16 text-center">Content not found</div>;
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold text-center text-gray-800 mb-12">{content.title}</h1>
      <div className="max-w-3xl mx-auto text-lg text-gray-600 leading-relaxed">
        <p className="mb-8">
          {content.content}
        </p>
      </div>
    </div>
  );
};

export default PoliciesPage;