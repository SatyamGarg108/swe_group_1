import Head from "next/head";
import { useRouter } from "next/router";
import Link from "next/link";
import { useState } from "react";
import { api } from "~/utils/api";
import Image from "next/image";

export default function SearchResults() {
  const router = useRouter();
  const raw = router.query.q;
  const qStr = Array.isArray(raw) ? (raw[0] ?? "") : (raw ?? "");

  // Advanced filter state
  const [filters, setFilters] = useState({
    availableOnly: false,
    ebooks: false,
    newArrivals: false,
    fiction: false,
    nonFiction: false,
  });

  // tRPC search query
  const {
    data: results = [],
    isLoading,
    refetch,
  } = api.book.search.useQuery({
    q: qStr,
    ...filters,
  });

  // Handle filter change
  function handleFilterChange(e: React.ChangeEvent<HTMLInputElement>) {
    setFilters((prev) => ({ ...prev, [e.target.name]: e.target.checked }));
  }

  return (
    <>
      <Head>
        <title>Search Results | LibraryCatalog</title>
      </Head>
      <main className="min-h-screen bg-white p-4">
        <h2 className="mb-4 text-center text-xl font-bold">
          {`Search Results for "${qStr}"`}
        </h2>
        <div className="flex">
          <aside className="mr-4 w-56 rounded border border-gray-300 bg-gray-50 p-4">
            <h3 className="mb-2 font-bold">Advanced search filters</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <label>
                  <input
                    type="checkbox"
                    name="availableOnly"
                    checked={filters.availableOnly}
                    onChange={handleFilterChange}
                  />{" "}
                  Available only
                </label>
              </li>
              <li>
                <label>
                  <input
                    type="checkbox"
                    name="ebooks"
                    checked={filters.ebooks}
                    onChange={handleFilterChange}
                  />{" "}
                  E-books
                </label>
              </li>
              <li>
                <label>
                  <input
                    type="checkbox"
                    name="newArrivals"
                    checked={filters.newArrivals}
                    onChange={handleFilterChange}
                  />{" "}
                  New arrivals
                </label>
              </li>
              <li>
                <label>
                  <input
                    type="checkbox"
                    name="fiction"
                    checked={filters.fiction}
                    onChange={handleFilterChange}
                  />{" "}
                  Fiction
                </label>
              </li>
              <li>
                <label>
                  <input
                    type="checkbox"
                    name="nonFiction"
                    checked={filters.nonFiction}
                    onChange={handleFilterChange}
                  />{" "}
                  Non-fiction
                </label>
              </li>
            </ul>
          </aside>
          <section className="flex-1 space-y-6 overflow-x-auto">
            {isLoading ? (
              <div className="text-center">Loading…</div>
            ) : results.length > 0 ? (
              results.map((book) => (
                <Link key={book.id} href={`/book/${book.id}`}>
                  <div className="flex cursor-pointer items-center space-x-6 rounded border border-gray-300 bg-white p-4 shadow-sm hover:bg-gray-100">
                    <Image
                      src={`/${book.id}.jpg`}
                      alt={`Cover of ${book.title}`}
                      width={100}
                      height={150}
                      className="rounded"
                    />
                    <div className="flex-1">
                      <h4 className="mb-1 text-lg font-semibold">
                        {book.title}
                      </h4>
                      <p className="text-sm text-gray-500">
                        {book.series ?? "(No Series)"}{" "}
                        {/* Display series name */}
                      </p>
                      <p className="mt-2 text-gray-700">{book.description}</p>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <div className="text-center text-gray-500">No results found.</div>
            )}
          </section>
        </div>
      </main>
    </>
  );
}
