import Head from "next/head";
import Link from "next/link";

import React from "react";
import { api } from "~/utils/api";

export default function Home() {
  // Remove mock data, use tRPC to fetch books
  const { data: books = [], isLoading } = api.book.getAll.useQuery();

  return (
    <>
      <Head>
        <title>LibraryCatalog</title>
        <meta name="description" content="Library Management System" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="min-h-screen bg-gradient-to-br from-white to-gray-100 p-6">
        {/* Title */}
        <div className="mb-10 text-center">
          <h1 className="mb-4 text-4xl font-extrabold text-gray-800">
            Library Catalog
          </h1>
          <p className="text-lg text-gray-500">Discover your next great read</p>
        </div>

        {/* Books of the week section */}
        <h2 className="mb-6 text-center text-2xl font-bold text-gray-700">
          📚 Books of the Week
        </h2>

        {isLoading ? (
          <div className="text-center">Loading...</div>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3">
            {books.map((book) => (
              <Link key={book.id} href={`/book/${book.id}`}>
                <div className="group flex cursor-pointer flex-col items-center justify-center rounded-2xl bg-white p-6 shadow-md transition-all hover:shadow-xl">
                  <div className="text-center">
                    <h3 className="text-lg font-semibold text-gray-800 transition group-hover:text-blue-500">
                      {book.title}
                    </h3>
                    <p className="mt-2 text-sm text-gray-500">
                      {book.series ?? "(No Series)"}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </>
  );
}
