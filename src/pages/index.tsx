import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { api } from "~/utils/api";

export default function Home() {
  const hello = api.post.hello.useQuery({ text: "from tRPC" });
  const router = useRouter();
  const [search, setSearch] = React.useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      void router.push(`/search?q=${encodeURIComponent(search)}`);
    }
  };

  return (
    <>
      <Head>
        <title>LibraryCatalog</title>
        <meta name="description" content="Library Management System" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="min-h-screen bg-white p-4">
        {/* Search bar */}
        <form onSubmit={handleSearch} className="mx-auto mb-8 max-w-2xl">
          <input
            type="text"
            placeholder="search bar"
            className="w-full rounded border border-gray-300 p-3 text-center"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </form>

        {/* Books of the week section */}
        <h2 className="mb-4 text-center text-xl font-bold">Books of the week</h2>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Link key={i} href={`/book/${i}`}>
              <div className="flex aspect-square flex-col items-center justify-center rounded border border-gray-300 p-4 cursor-pointer hover:bg-gray-100">
                <div className="text-center">
                  <p>Showname Book {i}</p>
                  <p className="text-gray-500">(Book Highlight)</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </>
  );
}
