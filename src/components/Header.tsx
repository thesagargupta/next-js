'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';

const Header = () => {
  const { data: session, status } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="text-2xl font-bold text-gray-800">
          <Link href="/">Elegance</Link>
        </div>
        <nav className="hidden md:flex space-x-6">
          <Link href="/products" className="text-gray-600 hover:text-gray-800">Photo Books</Link>
          <Link href="/frames" className="text-gray-600 hover:text-gray-800">Frames</Link>
          <Link href="/about" className="text-gray-600 hover:text-gray-800">About</Link>
          <Link href="/contact" className="text-gray-600 hover:text-gray-800">Contact</Link>
        </nav>
        <div className="hidden md:flex items-center space-x-4">
          <Link href="/cart" className="text-gray-600 hover:text-gray-800">Cart</Link>
          {status === 'authenticated' ? (
            <>
              <span>{session.user?.name}</span>
              <button onClick={() => signOut()} className="text-gray-600 hover:text-gray-800">Logout</button>
            </>
          ) : (
            <>
              <button onClick={() => signIn()} className="text-gray-600 hover:text-gray-800">Login</button>
              <Link href="/register" className="text-gray-600 hover:text-gray-800">Register</Link>
            </>
          )}
        </div>
        <div className="md:hidden">
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-gray-600 hover:text-gray-800 focus:outline-none">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path></svg>
          </button>
        </div>
      </div>
      {isMenuOpen && (
        <div className="md:hidden">
          <nav className="px-4 pt-2 pb-4 space-y-2">
            <Link href="/products" className="block text-gray-600 hover:text-gray-800">Photo Books</Link>
            <Link href="/frames" className="block text-gray-600 hover:text-gray-800">Frames</Link>
            <Link href="/about" className="block text-gray-600 hover:text-gray-800">About</Link>
            <Link href="/contact" className="block text-gray-600 hover:text-gray-800">Contact</Link>
            <Link href="/cart" className="block text-gray-600 hover:text-gray-800">Cart</Link>
            {status === 'authenticated' ? (
                <button onClick={() => signOut()} className="block w-full text-left text-gray-600 hover:text-gray-800">Logout</button>
            ) : (
                <>
                    <button onClick={() => signIn()} className="block w-full text-left text-gray-600 hover:text-gray-800">Login</button>
                    <Link href="/register" className="block text-gray-600 hover:text-gray-800">Register</Link>
                </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;