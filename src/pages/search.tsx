import Head from "next/head";
import { useRouter } from "next/router";
import Link from "next/link";

// Mock books data for search

type BookDetail = {
  id: string;
  title: string;
  cover: string;
  author: string;
  rating: number;
  available: boolean;
  description: string;
};

const mockBooks: BookDetail[] = [
  { id: "1", title: "The Great Gatsby", cover: "cover1.png", author: "F. Scott Fitzgerald", rating: 4.2, available: true, description: "A portrait of the Jazz Age..." },
  { id: "2", title: "1984", cover: "cover2.png", author: "George Orwell", rating: 4.7, available: false, description: "Dystopian novel..." },
  { id: "3", title: "To Kill a Mockingbird", cover: "cover3.png", author: "Harper Lee", rating: 4.5, available: true, description: "A novel about racial injustice..." },
  { id: "4", title: "Pride and Prejudice", cover: "cover4.png", author: "Jane Austen", rating: 4.3, available: true, description: "A romantic novel..." },
  { id: "5", title: "Moby Dick", cover: "cover5.png", author: "Herman Melville", rating: 3.9, available: true, description: "Epic sea story..." }
];

export default function SearchResults() {
  const router = useRouter();
  const raw = router.query.q;
  // Ensure qStr is always a string
  const qStr = Array.isArray(raw) ? raw[0] ?? "" : raw ?? "";
  const query = qStr.toLowerCase();

  const results = mockBooks.filter((book) => {
    return (
      book.title.toLowerCase().includes(query) ||
      book.author.toLowerCase().includes(query)
    );
  });

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
              <li><label><input type="checkbox" /> Available only</label></li>
              <li><label><input type="checkbox" /> E-books</label></li>
              <li><label><input type="checkbox" /> New arrivals</label></li>
              <li><label><input type="checkbox" /> Fiction</label></li>
              <li><label><input type="checkbox" /> Non-fiction</label></li>
            </ul>
          </aside>
          <section className="flex-1 space-y-6 overflow-x-auto">
            {results.length > 0 ? (
              results.map((book) => (
                <Link key={book.id} href={`/book/${book.id}`}>
                  <div className="flex cursor-pointer items-center space-x-6 rounded border border-gray-300 bg-white p-4 shadow-sm hover:bg-gray-100">
                    <div className="h-32 w-24 flex-shrink-0 rounded bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-500">{book.cover}</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="mb-2 text-lg font-semibold">{book.title}</h4>
                      <p className="text-gray-700">{book.description}</p>
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
