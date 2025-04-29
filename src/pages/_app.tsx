import { GeistSans } from "geist/font/sans";
import { type AppType } from "next/app";
import React from 'react';
import Link from 'next/link';
import { ClerkProvider,
  SignedIn,
  SignedOut,
  UserButton,
  useClerk
} from '@clerk/nextjs'
import { useRouter } from 'next/router';
import { useState } from 'react';
import "~/styles/globals.css" // Correct import
import {faCartShopping, faHouse, faBell, faMagnifyingGlass, faFilter} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { api } from "~/utils/api";

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <ClerkProvider {...pageProps}>
      <AppLayout>
        <Component {...pageProps} />
      </AppLayout>
    </ClerkProvider>
  );
};

// Layout component that uses Clerk hooks inside the provider
function AppLayout({ children }: { children: React.ReactNode }) {
  const { openSignIn, openSignUp } = useClerk();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      void router.push(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
    }
  };
  return (
    <div className={`${GeistSans.className} min-h-screen flex flex-col bg-gradient-to-br from-white to-gray-100`}>
      
    {/* Top Bar */}
    <header className="p-4 border-b shadow-sm bg-white sticky top-0 z-50">
      <div className="flex flex-wrap items-center justify-between gap-4">
        
        {/* Left Side Buttons */}
        <div className="flex items-center gap-3">
          <Link href="/">
            <button className="rounded-full border px-4 py-2 text-gray-700 font-medium hover:bg-gray-100 transition flex items-center gap-2">
            <FontAwesomeIcon icon={faHouse} size="lg" />
            </button>
          </Link>
          <button className="rounded-full border px-4 py-2 text-gray-700 font-medium hover:bg-gray-100 transition flex items-center gap-2">
            <FontAwesomeIcon icon={faBell} size="lg"/>
          </button>
        </div>

        {/* Search Center */}
        <div className="flex-1 flex flex-col items-center">
          <form onSubmit={handleSearch} className="w-full max-w-md flex items-center gap-2">
            {/* Advanced Filters Button */}
            <button
              type="button"
              className="flex items-center justify-center rounded-full border border-gray-300 p-3 hover:bg-gray-100 transition"
              aria-label="Advanced Filters"
            >
              <FontAwesomeIcon icon={faFilter} size="lg" className="text-gray-500" />
            </button>

            {/* Search Input */}
            <input
              type="text"
              placeholder="Search books, authors..."
              className="flex-1 rounded-full border border-gray-300 p-3 focus:ring-2 focus:ring-blue-500 outline-none"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />

            {/* Search Button */}
            <button
              type="submit"
              className="rounded-full bg-blue-500 hover:bg-blue-600 text-white p-3 transition flex items-center justify-center"
              aria-label="Search"
            >
              <FontAwesomeIcon icon={faMagnifyingGlass} size="lg" />
            </button>
          </form>
        </div>

        {/* Right Side Buttons */}
        <div className="flex items-center gap-3">
          <Link href="/cart">
            <button className="rounded-full border px-4 py-2 text-gray-700 font-medium hover:bg-gray-100 transition flex items-center gap-2">
            <FontAwesomeIcon icon={faCartShopping} size="lg"/>
            </button>
          </Link>
          <Link href="/my-books">
              <button className="rounded-full border px-4 py-2 text-gray-700 font-medium hover:bg-gray-100 transition">
                My Books
              </button>
            </Link>

          {/* Auth Buttons */}
          <SignedOut>
            <button
              onClick={() => openSignIn()}
              className="px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition font-semibold"
            >
              Sign In
            </button>
            <button
              onClick={() => openSignUp()}
              className="px-4 py-2 bg-white text-blue-500 border border-blue-500 rounded-full hover:bg-blue-50 transition font-semibold"
            >
              Sign Up
            </button>
          </SignedOut>
          <SignedIn>
            <div className="border-2 border-blue-500 rounded-full overflow-hidden w-10 h-10">
              <UserButton />
            </div>
          </SignedIn>
        </div>

      </div>
    </header>

    {/* Main Content */}
    <main className="flex-grow p-6">{children}</main>

    {/* Footer */}
    <footer className="flex justify-between items-center p-4 border-t text-sm text-gray-500 bg-white shadow-inner">
        <button className="rounded-full border border-gray-300 px-4 py-1 hover:bg-gray-100 transition">
          Language
        </button>
        <span>© 2025 All rights reserved</span>
        <button className="rounded-full border border-gray-300 px-4 py-1 hover:bg-gray-100 transition">
          Help
        </button>
      </footer>

  </div>
  );
}

export default api.withTRPC(MyApp);