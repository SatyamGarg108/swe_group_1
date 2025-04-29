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
    <div className={`${GeistSans.className} min-h-screen flex flex-col bg-white`}>
      {/* Top Bar */}
      <header className="p-4 border-b flex flex-col gap-2 bg-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link href="/">
              <button className="rounded border border-gray-300 px-4 py-1">HOME</button>
            </Link>
            <button className="rounded border border-gray-300 px-4 py-1">Notifications</button>
          </div>
          <div className="flex-1 flex flex-col items-center">
            <form onSubmit={handleSearch} className="w-full max-w-md flex flex-col items-center">
              <input
                type="text"
                placeholder="Search bar"
                className="w-full rounded border border-gray-300 p-2 text-center"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </form>
            <button className="mt-1 rounded border border-gray-400 px-4 py-1 text-sm">Advanced filters</button>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/cart">
              <button className="rounded border border-gray-300 px-4 py-1">Cart</button>
            </Link>
            <Link href="/my-books">
              <button className="rounded border border-gray-300 px-4 py-1">My Books</button>
            </Link>
            <SignedOut>
              <button onClick={() => openSignIn()} className="px-4 py-1 bg-white text-[#2e026d] rounded border border-gray-300 hover:opacity-80 transition">
                Sign In
              </button>
              <button onClick={() => openSignUp()} className="px-4 py-1 bg-white text-[#2e026d] rounded border border-gray-300 hover:opacity-80 transition">
                Sign Up
              </button>
            </SignedOut>
            <SignedIn>
              <div className="border-2 border-white rounded-full overflow-hidden w-8 h-8">
                <UserButton />
              </div>
            </SignedIn>
          </div>
        </div>
      </header>
      <main className="flex-grow">
        {children}
      </main>
      {/* Footer */}
      <footer className="flex justify-between items-center p-4 border-t bg-white">
        <button className="rounded border border-gray-300 px-4 py-1">Language</button>
        <span className="text-gray-400">© 2025 All rights reserved</span>
        <button className="rounded-full border border-gray-300 px-6 py-1">Help</button>
      </footer>
    </div>
  );
}

export default api.withTRPC(MyApp);