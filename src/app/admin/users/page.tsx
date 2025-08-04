'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

interface User {
  id: number;
  name: string;
  email: string;
}

interface GuestUser {
  id: number;
  name: string;
  email: string;
}

const AdminUsersPage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [registeredUsers, setRegisteredUsers] = useState<User[]>([]);
  const [filteredRegisteredUsers, setFilteredRegisteredUsers] = useState<User[]>([]);
  const [guestUsers, setGuestUsers] = useState<GuestUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    } else if (status === 'authenticated') {
      fetchUsers();
      fetchGuestUsers();
    }
  }, [status, router]);

  useEffect(() => {
    const lowercasedFilter = searchTerm.toLowerCase();
    const filtered = registeredUsers.filter(user =>
      user.name.toLowerCase().includes(lowercasedFilter) ||
      user.email.toLowerCase().includes(lowercasedFilter)
    );
    setFilteredRegisteredUsers(filtered);
  }, [searchTerm, registeredUsers]);

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/users');
      if (!res.ok) {
        throw new Error('Failed to fetch registered users');
      }
      const data = await res.json();
      setRegisteredUsers(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchGuestUsers = async () => {
    try {
      const res = await fetch('/api/guests');
      if (!res.ok) {
        throw new Error('Failed to fetch guest users');
      }
      const data = await res.json();
      setGuestUsers(data);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleDeleteGuest = async (id: number) => {
    if (!confirm('Are you sure you want to delete this guest user?')) return;
    try {
      const res = await fetch('/api/guests', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) {
        throw new Error('Failed to delete guest user');
      }
      fetchGuestUsers();
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
      <h1 className="text-4xl font-bold text-center text-gray-800 mb-12">Manage Users</h1>
      
      <div className="bg-white shadow-md rounded-lg p-8 mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Registered Users</h2>
        <input
          type="text"
          placeholder="Search registered users by name or email..."
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-4"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredRegisteredUsers.map((user) => (
              <tr key={user.id}>
                <td className="px-6 py-4 whitespace-nowrap">{user.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="bg-white shadow-md rounded-lg p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Guest Users</h2>
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {guestUsers.map((guest) => (
              <tr key={guest.id}>
                <td className="px-6 py-4 whitespace-nowrap">{guest.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">{guest.email}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button onClick={() => handleDeleteGuest(guest.id)} className="text-red-600 hover:text-red-900">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminUsersPage;