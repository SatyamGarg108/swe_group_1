import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";

export default function Home() {
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
      <main className="min-h-screen bg-gradient-to-br from-white to-gray-100 p-6">
        
        {/* Title */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-gray-800 mb-4">Library Catalog</h1>
          <p className="text-lg text-gray-500">Discover your next great read</p>
        </div>


        {/* Books of the week section */}
        <h2 className="mb-6 text-center text-2xl font-bold text-gray-700">📚 Books of the Week</h2>

        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Link key={i} href={`/book/${i}`}>
              <div className="group flex flex-col items-center justify-center rounded-2xl bg-white p-6 shadow-md cursor-pointer hover:shadow-xl transition-all">
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-gray-800 group-hover:text-blue-500 transition">{`Showname Book ${i}`}</h3>
                  <p className="mt-2 text-sm text-gray-500">(Book Highlight)</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </>
  );
}
