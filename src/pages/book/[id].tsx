import Head from "next/head";
import { useRouter } from "next/router";
import { useState } from "react";
import { useUser, useClerk } from "@clerk/nextjs";
import { api } from "~/utils/api";
import Link from "next/link";
import Image from "next/image";

export default function BookView() {
  const router = useRouter();
  const rawId = router.query.id;
  const bookId = typeof rawId === "string" ? parseInt(rawId, 10) : NaN;
  const { data: book, isLoading } = api.book.getById.useQuery({ id: bookId });
  const { user } = useUser();
  const { openSignIn } = useClerk();
  const addMutation = api.cart.add.useMutation({
    onSuccess: () => {
      void router.push("/cart");
    },
  });
  const [adding, setAdding] = useState(false);
  const handleBorrow = () => {
    if (!user) {
      openSignIn();
      return;
    }
    if (!book) {
      return;
    }
    setAdding(true);
    addMutation.mutate({ userId: user.id, bookId: book.id });
  };

  if (isLoading) return <p className="p-4">Loading book...</p>;
  if (!book) return <p className="p-4">Book not found.</p>;

  // `book` is now non-null

  return (
    <>
      <Head>
        <title>{book.title} | LibraryCatalog</title>
      </Head>
      <main className="min-h-screen bg-gradient-to-br from-white to-gray-100 p-6">
        {/* Book view layout */}
        <div className="mx-auto flex max-w-6xl flex-col gap-8 rounded-xl bg-white p-6 shadow-md transition hover:shadow-lg md:flex-row">
          {/* Book cover */}
          <div className="flex h-80 w-56 flex-shrink-0 items-center justify-center overflow-hidden rounded-lg border border-gray-300 bg-gray-100">
            <Image
              src={`/${book.id}.jpg`}
              alt={`Cover of ${book.title}`}
              width={224}
              height={320}
              className="object-cover"
            />
          </div>

          {/* Book details */}
          <div className="flex flex-1 flex-col gap-6">
            {/* Title and Details */}
            <div>
              <h1 className="text-3xl font-bold text-gray-800">{book.title}</h1>
              <p className="mt-1 text-gray-500">
                Series: {book.series ?? "N/A"}
              </p>
              <p className="mt-1 text-gray-500">ISBN: {book.isbn ?? "N/A"}</p>
              <p className="mt-1 text-gray-500">
                Published: {book.publicationYear ?? "N/A"}
              </p>
            </div>

            {/* Stats: rating, reviews count, availability */}
            <div className="flex gap-4">
              <div className="flex-1 rounded-lg bg-yellow-50 p-3 text-center font-semibold text-yellow-700">
                ⭐ Rating: {book.avgRating ? book.avgRating.toFixed(1) : "N/A"}{" "}
                / 5
              </div>
              <div className="flex-1 rounded-lg bg-gray-50 p-3 text-center font-semibold text-gray-700">
                {book.reviews.length} Reviews
              </div>
              <div
                className={`flex-1 rounded-lg p-3 text-center font-semibold ${book.available ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}
              >
                {book.available ? "Available" : "Not Available"}
              </div>
            </div>

            {/* Description */}
            <div className="rounded-lg bg-gray-50 p-4">
              <h2 className="mb-2 text-lg font-bold">📖 Description</h2>
              <p className="text-gray-600">
                {book.description ?? "No description available."}
              </p>
            </div>

            {/* User Reviews */}
            <div className="rounded-lg bg-gray-50 p-4">
              <h2 className="mb-2 text-lg font-bold">📝 User Reviews</h2>
              {book.reviews.length ? (
                <ul className="list-disc space-y-2 pl-5 text-gray-600">
                  {book.reviews.map((r, idx) => (
                    <li key={idx}>
                      <span className="font-semibold">{r.userId}:</span>{" "}
                      {r.reviewText}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-400">No reviews yet.</p>
              )}
            </div>

            {/* Suggestions */}
            <div className="rounded-lg bg-gray-50 p-4">
              <h2 className="mb-2 text-lg font-bold">📚 You Might Also Like</h2>
              <div className="flex gap-4">
                {book.suggestions.map((s) => (
                  <Link
                    key={s.id}
                    href={`/book/${s.id}`}
                    className="rounded bg-white p-2 shadow hover:bg-gray-100"
                  >
                    {s.title}
                  </Link>
                ))}
              </div>
            </div>

            {/* Buttons */}
            <div className="mt-4 flex gap-4">
              <button
                className="flex-1 rounded-full bg-blue-500 py-3 font-semibold text-white transition hover:bg-blue-600"
                onClick={handleBorrow}
                disabled={adding}
              >
                {adding ? "Adding..." : " Borrow Book"}
              </button>
              <button className="flex-1 rounded-full border border-gray-300 py-3 font-semibold transition hover:bg-gray-100">
                ️ Leave a Review
              </button>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
