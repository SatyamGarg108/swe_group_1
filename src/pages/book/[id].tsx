import Head from "next/head";
import { useRouter } from "next/router";
import Link from "next/link";
import { useState } from "react";

// Full book detail type extending cart item
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
  // Find matching mock book or fallback to first
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
      // Load cart from localStorage or initialize empty
      const raw = localStorage.getItem("cart") ?? "[]";
      let cart: { id: string; title: string; cover: string }[];
      try {
        const parsed: unknown = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          const validItems = (parsed as unknown[]).filter((e): e is { id: string; title: string; cover: string } => {
            if (typeof e !== "object" || e === null) return false;
            const rec = e as Record<string, unknown>;
            return (
              typeof rec.id === "string" &&
              typeof rec.title === "string" &&
              typeof rec.cover === "string"
            );
          });
          cart = validItems;
        } else {
          cart = [];
        }
      } catch {
        cart = [];
      }
      const bookId = String(book.id ?? "");
      const bookTitle = String(book.title ?? "");
      const bookCover = String(book.cover ?? "");
      if (!cart.some((b) => b.id === bookId)) {
        cart.push({ id: bookId, title: bookTitle, cover: bookCover });
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
      <main className="min-h-screen bg-white p-4">
        {/* Book view layout */}
        <div className="flex gap-6">
          {/* Book cover */}
          <div className="flex h-80 w-56 items-center justify-center rounded border border-gray-300 bg-gray-100">
            <span className="text-gray-500">{book.cover}</span>
          </div>

          {/* Book details */}
          <div className="flex-1 space-y-4">
            <div className="flex gap-4">
              <div className="flex-1 rounded border border-gray-300 p-2 text-center">Rating: {book.rating} / 5 stars</div>
              <div className="flex-1 rounded border border-gray-300 p-2 text-center">Available: {book.available ? "Yes" : "No"}</div>
            </div>
            <div className="flex gap-4">
              <div className="flex-1 rounded border border-gray-300 p-4">Book Description: {book.description}</div>
              <div className="flex-1 rounded border border-gray-300 p-4">
                <div className="font-bold mb-2">Other user reviews</div>
                <ul className="list-disc pl-4">
                  {book.reviews.map((r, i) => (
                    <li key={i}><span className="font-semibold">{r.user}:</span> {r.text}</li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="rounded border border-gray-300 p-2">Similar books by author/genre: {book.similar.join(", ")}</div>
            <div className="flex gap-4">
              <button className="flex-1 rounded border border-gray-300 p-2" onClick={handleBorrow} disabled={adding}>
                {adding ? "Adding..." : "Borrow Book"}
              </button>
              <button className="flex-1 rounded border border-gray-300 p-2">Leave a review</button>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
