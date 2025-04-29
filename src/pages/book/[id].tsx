import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import { useState } from "react";
import { useUser, useClerk } from "@clerk/nextjs";
import { api } from "~/utils/api";

export default function BookView() {
  const router = useRouter();
  const rawId = router.query.id;
  const bookId = typeof rawId === 'string' ? parseInt(rawId, 10) : NaN;
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

  return (
    <>
      <Head>
        <title>{book.title} | LibraryCatalog</title>
      </Head>
      <main className="min-h-screen bg-gradient-to-br from-white to-gray-100 p-6">
        {/* Book view layout */}
        <div className="mx-auto flex max-w-6xl flex-col gap-8 rounded-xl bg-white p-6 shadow-md transition hover:shadow-lg md:flex-row">
          {/* Book cover */}
          <div className="flex h-80 w-56 flex-shrink-0 items-center justify-center rounded-lg border border-gray-300 bg-gray-100">
            {book.coverImagePath ? (
              <Image
                src={book.coverImagePath}
                alt={book.title}
                width={224}
                height={320}
                className="object-contain"
              />
            ) : (
              <span className="text-gray-500">No cover available</span>
            )}
          </div>

          {/* Book details */}
          <div className="flex flex-1 flex-col gap-6">
            {/* Title and Details */}
            <div>
              <h1 className="text-3xl font-bold text-gray-800">{book.title}</h1>
              <p className="mt-1 text-gray-500">Series: {book.series ?? 'N/A'}</p>
              <p className="mt-1 text-gray-500">ISBN: {book.isbn ?? 'N/A'}</p>
              <p className="mt-1 text-gray-500">Published: {book.publicationYear ?? 'N/A'}</p>
            </div>

            {/* Description */}
            <div className="rounded-lg bg-gray-50 p-4">
              <h2 className="mb-2 text-lg font-bold">📖 Description</h2>
              <p className="text-gray-600">{book.description ?? 'No description available.'}</p>
            </div>

            {/* Reviews and similar books not yet implemented */}
            <p className="text-gray-500">Reviews and similar books not implemented.</p>

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
