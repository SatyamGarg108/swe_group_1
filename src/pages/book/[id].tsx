import Head from "next/head";
import { useRouter } from "next/router";
import Link from "next/link";
import { useState } from "react";

type BookDetail = {
  id: string;
  title: string;
  cover: string;
  author: string;
  rating: number;
  available: boolean;
  description: string;
  reviews: { user: string; text: string }[];
  similar: string[];
};

const mockBooks: BookDetail[] = [
  { id: "1", title: "The Great Gatsby", cover: "cover1.png", author: "F. Scott Fitzgerald", rating: 4.2, available: true, description: "A portrait of the Jazz Age...", reviews: [{ user: "Alice", text: "Loved it!" }], similar: ["This Side of Paradise"] },
  { id: "2", title: "1984", cover: "cover2.png", author: "George Orwell", rating: 4.7, available: false, description: "Dystopian novel...", reviews: [{ user: "Bob", text: "Very thought-provoking." }], similar: ["Animal Farm"] },
  { id: "3", title: "To Kill a Mockingbird", cover: "cover3.png", author: "Harper Lee", rating: 4.5, available: true, description: "A novel about racial injustice...", reviews: [{ user: "Carol", text: "A masterpiece." }], similar: ["Go Set a Watchman"] },
  { id: "4", title: "Pride and Prejudice", cover: "cover4.png", author: "Jane Austen", rating: 4.3, available: true, description: "A romantic novel...", reviews: [{ user: "Dave", text: "Charming and witty." }], similar: ["Sense and Sensibility"] },
  { id: "5", title: "Moby Dick", cover: "cover5.png", author: "Herman Melville", rating: 3.9, available: true, description: "Epic sea story...", reviews: [{ user: "Eve", text: "Long but rewarding." }], similar: ["Billy Budd"] }
];

function getMockBook(id: string | string[] | undefined): BookDetail {
  const bookId = String(Array.isArray(id) ? id[0] : id ?? "1");
  const found = mockBooks.find((b) => b.id === bookId);
  if (found) return found;
  return {
    id: bookId,
    title: `Unknown Book ${bookId}`,
    cover: "cover-default.png",
    author: "Unknown",
    rating: 0,
    available: false,
    description: "No description available.",
    reviews: [],
    similar: [],
  };
}

export default function BookView() {
  const router = useRouter();
  const { id } = router.query;
  const book = getMockBook(id);
  const [adding, setAdding] = useState(false);

  const handleBorrow = () => {
    setAdding(true);
    if (typeof window !== "undefined") {
      const raw = localStorage.getItem("cart") ?? "[]";
      let cart: { id: string; title: string; cover: string }[] = [];
      try {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          cart = parsed.filter((e): e is { id: string; title: string; cover: string } =>
            typeof e?.id === "string" && typeof e?.title === "string" && typeof e?.cover === "string"
          );
        }
      } catch {}
      if (!cart.some((b) => b.id === book.id)) {
        cart.push({ id: book.id, title: book.title, cover: book.cover });
        localStorage.setItem("cart", JSON.stringify(cart));
      }
      void router.push("/cart");
    }
    setAdding(false);
  };

  return (
    <>
      <Head>
        <title>{book.title} | LibraryCatalog</title>
      </Head>
      <main className="min-h-screen bg-gradient-to-br from-white to-gray-100 p-6">
        {/* Book view layout */}
        <div className="flex flex-col md:flex-row gap-8 max-w-6xl mx-auto bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition">
          
          {/* Book cover */}
          <div className="flex-shrink-0 flex h-80 w-56 items-center justify-center rounded-lg border border-gray-300 bg-gray-100 text-gray-500">
            {book.cover}
          </div>

          {/* Book details */}
          <div className="flex-1 flex flex-col gap-6">
            {/* Title and Author */}
            <div>
              <h1 className="text-3xl font-bold text-gray-800">{book.title}</h1>
              <p className="text-gray-500 mt-1">by {book.author}</p>
            </div>

            {/* Stats */}
            <div className="flex gap-4">
              <div className="flex-1 text-center rounded-lg bg-blue-50 p-3 font-semibold text-blue-700">
                ⭐ Rating: {book.rating} / 5
              </div>
              <div className={`flex-1 text-center rounded-lg p-3 font-semibold ${book.available ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
                {book.available ? "Available" : "Not Available"}
              </div>
            </div>

            {/* Description and Reviews */}
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 rounded-lg bg-gray-50 p-4">
                <h2 className="text-lg font-bold mb-2">📖 Book Description</h2>
                <p className="text-gray-600">{book.description}</p>
              </div>
              <div className="flex-1 rounded-lg bg-gray-50 p-4">
                <h2 className="text-lg font-bold mb-2">📝 User Reviews</h2>
                {book.reviews.length ? (
                  <ul className="list-disc pl-5 space-y-1 text-gray-600">
                    {book.reviews.map((r, i) => (
                      <li key={i}>
                        <span className="font-semibold">{r.user}:</span> {r.text}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-400">No reviews yet.</p>
                )}
              </div>
            </div>

            {/* Similar Books */}
            {book.similar.length > 0 && (
              <div className="rounded-lg bg-gray-50 p-4">
                <h2 className="text-lg font-bold mb-2">📚 Similar Books</h2>
                <p className="text-gray-600">{book.similar.join(", ")}</p>
              </div>
            )}

            {/* Buttons */}
            <div className="flex gap-4 mt-4">
              <button
                className="flex-1 rounded-full bg-blue-500 hover:bg-blue-600 text-white py-3 font-semibold transition"
                onClick={handleBorrow}
                disabled={adding}
              >
                {adding ? "Adding..." : " Borrow Book"}
              </button>
              <button className="flex-1 rounded-full border border-gray-300 py-3 hover:bg-gray-100 font-semibold transition">
                ️ Leave a Review
              </button>
            </div>

          </div>
        </div>
      </main>
    </>
  );
}
