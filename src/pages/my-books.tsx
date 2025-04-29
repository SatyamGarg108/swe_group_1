import Head from "next/head";
import { useEffect, useState } from "react";

// Mock checked out books
const mockCheckedOut = [
  { id: "1", title: "The Great Gatsby", cover: "cover1.png", info: "Due: 2025-05-10", renewable: true },
  { id: "2", title: "1984", cover: "cover2.png", info: "Due: 2025-05-15", renewable: false },
  { id: "3", title: "To Kill a Mockingbird", cover: "cover3.png", info: "Due: 2025-05-20", renewable: true },
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
      <main className="min-h-screen bg-white p-4">
        <h2 className="mb-6 text-center text-2xl font-bold">My books:</h2>
        <div className="flex flex-col gap-6 max-h-[60vh] overflow-y-auto pr-2">
          {books.map((book) => (
            <div key={book.id} className="flex items-center gap-6 border rounded p-4">
              <div className="flex h-32 w-24 items-center justify-center rounded border border-gray-300 bg-gray-100">
                <span className="text-gray-500">{book.cover}</span>
              </div>
              <div className="flex-1 rounded border border-gray-300 p-4">
                <div className="font-bold">{book.title}</div>
                <div>{book.info}</div>
              </div>
              <div className="flex flex-col items-center gap-2">
                <button className="rounded border border-gray-300 px-4 py-2">
                  {book.renewable ? "Renew" : "Not renewable"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </>
  );
}
