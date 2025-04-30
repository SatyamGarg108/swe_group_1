import { GeistSans } from "geist/font/sans";
import { type AppType } from "next/app";
import React from "react";
import Link from "next/link";
import {
  ClerkProvider,
  SignedIn,
  SignedOut,
  UserButton,
  useClerk,
} from "@clerk/nextjs";
import { useRouter } from "next/router";
import { useState } from "react";
import "~/styles/globals.css"; // Correct import
import {
  faCartShopping,
  faHouse,
  faBell,
  faMagnifyingGlass,
  faFilter,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { api } from "~/utils/api";
import ChatBot from "./chatbot";

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
  const [searchTerm, setSearchTerm] = useState("");
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      void router.push(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
    }
  };
  return (
    <div
      className={`${GeistSans.className} flex min-h-screen flex-col bg-gradient-to-br from-white to-gray-100`}
    >
      {/* Top Bar */}
      <ChatBot />
      <header className="sticky top-0 z-50 border-b bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between gap-4">
          {/* Left Side Buttons */}
          <div className="flex items-center gap-3">
            <Link href="/">
              <button className="flex items-center gap-2 rounded-full border px-4 py-2 font-medium text-gray-700 transition hover:bg-gray-100">
                <FontAwesomeIcon icon={faHouse} size="lg" />
              </button>
            </Link>
            <Link href="/notifications">
              <button className="flex items-center gap-2 rounded-full border px-4 py-2 font-medium text-gray-700 transition hover:bg-gray-100">
                <FontAwesomeIcon icon={faBell} size="lg" />
              </button>
            </Link>
          </div>

          {/* Search Center */}
          <div className="flex flex-1 items-center justify-center">
            <form
              onSubmit={handleSearch}
              className="flex w-full max-w-md items-center gap-2"
            >
              {/* Advanced Filters Button */}
              <button
                type="button"
                className="flex items-center justify-center rounded-full border border-gray-300 p-3 transition hover:bg-gray-100"
                aria-label="Advanced Filters"
              >
                <FontAwesomeIcon
                  icon={faFilter}
                  size="lg"
                  className="text-gray-500"
                />
              </button>

              {/* Search Input */}
              <input
                type="text"
                placeholder="Search books, authors..."
                className="flex-1 rounded-full border border-gray-300 p-3 outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />

              {/* Search Button */}
              <button
                type="submit"
                className="flex items-center justify-center rounded-full bg-[#722420] p-3 text-white transition hover:bg-[#722420]"
                aria-label="Search"
              >
                <FontAwesomeIcon icon={faMagnifyingGlass} size="lg" />
              </button>
            </form>
          </div>

          {/* Right Side Buttons */}
          <div className="flex items-center gap-3">
            <Link href="/cart">
              <button className="flex items-center gap-2 rounded-full border px-4 py-2 font-medium text-gray-700 transition hover:bg-gray-100">
                <FontAwesomeIcon icon={faCartShopping} size="lg" />
              </button>
            </Link>
            <Link href="/my-books">
              <button className="rounded-full border px-4 py-2 font-medium text-gray-700 transition hover:bg-gray-100">
                My Books
              </button>
            </Link>

            {/* Auth Buttons */}
            <SignedOut>
              <button
                onClick={() => openSignIn()}
                className="rounded-full bg-blue-500 px-4 py-2 font-semibold text-white transition hover:bg-blue-600"
              >
                Sign In
              </button>
              <button
                onClick={() => openSignUp()}
                className="rounded-full border border-blue-500 bg-white px-4 py-2 font-semibold text-blue-500 transition hover:bg-blue-50"
              >
                Sign Up
              </button>
            </SignedOut>
            <SignedIn>
              <div className="h-10 w-10 overflow-hidden rounded-full">
                <UserButton appearance={{
                  elements: {
                    avatarBox: "h-10 w-10 p-0 m-0",
                  }
                }}/>
              </div>
            </SignedIn>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow p-6 ">{children}</main>

      {/* Footer */}
      <footer className="flex items-center justify-between border-t bg-white p-4 text-sm text-gray-500 shadow-inner">
        <button className="rounded-full border border-gray-300 px-4 py-1 transition hover:bg-gray-100">
          Language
        </button>
        <span>© 2025 All rights reserved</span>
        <p></p>
      </footer>
    </div>
  );
}

export default api.withTRPC(MyApp);
