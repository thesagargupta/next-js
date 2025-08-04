'use client';

import { useState } from 'react';

const Newsletter = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [isError, setIsError] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage('');
        setIsError(false);

        try {
            const res = await fetch('/api/newsletter', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });

            const data = await res.json();

            if (!res.ok) {
                setIsError(true);
                setMessage(data.message || 'Failed to subscribe');
                return;
            }

            setMessage(data.message);
            setEmail('');
        } catch (err: any) {
            setIsError(true);
            setMessage(err.message || 'An unexpected error occurred');
        }
    };

    return (
      <section className="bg-gray-100 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Join Our Newsletter</h2>
          <p className="text-gray-600 mb-8">Sign up to receive updates on new products and special offers.</p>
          <form onSubmit={handleSubmit} className="max-w-md mx-auto">
            <div className="flex items-center">
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none" placeholder="Enter your email" required />
              <button type="submit" className="bg-gray-800 text-white px-6 py-2 rounded-r-md hover:bg-gray-700">Subscribe</button>
            </div>
            {message && (
                <p className={`mt-4 ${isError ? 'text-red-500' : 'text-green-500'}`}>{message}</p>
            )}
          </form>
        </div>
      </section>
    );
  };
  
  export default Newsletter;