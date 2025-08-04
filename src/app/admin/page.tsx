'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const AdminDashboard = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  if (status === 'loading') {
    return <div className="container mx-auto px-4 py-16 text-center">Loading...</div>;
  }

  if (status === 'authenticated') {
    return (
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-12">Admin Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-white shadow-md rounded-lg p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Product Management</h2>
            <p className="text-gray-600 mb-4">Add, edit, or delete products.</p>
            <a href="/admin/products" className="bg-gray-800 text-white px-6 py-2 rounded-full font-bold hover:bg-gray-700">Manage Products</a>
          </div>
          <div className="bg-white shadow-md rounded-lg p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Order Management</h2>
            <p className="text-gray-600 mb-4">View and manage customer orders.</p>
            <a href="/admin/orders" className="bg-gray-800 text-white px-6 py-2 rounded-full font-bold hover:bg-gray-700">Manage Orders</a>
          </div>
          <div className="bg-white shadow-md rounded-lg p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">User Management</h2>
            <p className="text-gray-600 mb-4">View and manage registered users.</p>
            <a href="/admin/users" className="bg-gray-800 text-white px-6 py-2 rounded-full font-bold hover:bg-gray-700">Manage Users</a>
          </div>
          <div className="bg-white shadow-md rounded-lg p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Category Management</h2>
            <p className="text-gray-600 mb-4">Add, edit, or delete categories and subcategories.</p>
            <a href="/admin/categories" className="bg-gray-800 text-white px-6 py-2 rounded-full font-bold hover:bg-gray-700">Manage Categories</a>
          </div>
          <div className="bg-white shadow-md rounded-lg p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Newsletter Management</h2>
            <p className="text-gray-600 mb-4">View and manage newsletter subscribers.</p>
            <a href="/admin/newsletter" className="bg-gray-800 text-white px-6 py-2 rounded-full font-bold hover:bg-gray-700">Manage Newsletter</a>
          </div>
          <div className="bg-white shadow-md rounded-lg p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Content Management</h2>
            <p className="text-gray-600 mb-4">Manage dynamic content sections.</p>
            <a href="/admin/content" className="bg-gray-800 text-white px-6 py-2 rounded-full font-bold hover:bg-gray-700">Manage Content</a>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default AdminDashboard;