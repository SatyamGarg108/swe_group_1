import Head from "next/head";
import { useEffect, useState } from "react";

// Mock checked out books
const mockCheckedOut = [
  {
    id: "1",
    title: "The Great Gatsby",
    cover: "cover1.png",
    info: "Due: 2025-05-10",
    renewable: true,
  },
  {
    id: "2",
    title: "1984",
    cover: "cover2.png",
    info: "Due: 2025-05-15",
    renewable: false,
  },
  {
    id: "3",
    title: "To Kill a Mockingbird",
    cover: "cover3.png",
    info: "Due: 2025-05-20",
    renewable: true,
  },
];

export default function MyBooksPage() {
  const [books, setBooks] = useState<typeof mockCheckedOut>([]);
  useEffect(() => {
    // In real app, fetch from API
    setBooks(mockCheckedOut);
  }, []);

  return (
    <>
      <Head>
        <title>My Checked Out Books | LibraryCatalog</title>
      </Head>
      <main className="min-h-screen bg-gradient-to-br from-white to-gray-100 p-6">
        <h2 className="mb-8 text-center text-3xl font-extrabold text-gray-800">
          📚 My Books
        </h2>

        <div className="flex max-h-[70vh] flex-col gap-6 overflow-y-auto pr-2">
          {books.map((book) => (
            <div
              key={book.id}
              className="flex items-center gap-6 rounded-xl bg-white p-5 shadow-md transition hover:shadow-lg"
            >
              {/* Book Cover */}
              <div className="flex h-36 w-28 items-center justify-center rounded-lg border border-gray-300 bg-gray-100 text-sm text-gray-400">
                {book.cover}
              </div>

              {/* Book Details */}
              <div className="flex-1">
                <div className="text-xl font-semibold text-gray-800">
                  {book.title}
                </div>
                <div className="mt-2 text-sm text-gray-500">{book.info}</div>
              </div>

              {/* Renew Button */}
              <div className="flex flex-col items-center gap-2">
                {book.renewable ? (
                  <button className="rounded-full bg-blue-500 px-5 py-2 text-sm font-medium text-white transition hover:bg-blue-600">
                    Renew
                  </button>
                ) : (
                  <button
                    className="cursor-not-allowed rounded-full bg-gray-300 px-5 py-2 text-sm font-medium text-gray-600"
                    disabled
                  >
                    Not Renewable
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </main>
    </>
  );
}
