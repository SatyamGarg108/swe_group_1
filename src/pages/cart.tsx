import Head from "next/head";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { api } from "~/utils/api";
import { useState } from "react";

function BorrowButton({
  bookId,
  userId,
  onBorrowed,
}: {
  bookId: number;
  userId: string;
  onBorrowed: () => void;
}) {
  const borrowMutation = api.borrow.borrowBook.useMutation({
    onSuccess: () => {
      onBorrowed();
    },
  });
  const [loading, setLoading] = useState(false);
  const handleBorrow = () => {
    setLoading(true);
    borrowMutation.mutate(
      { userId, bookId },
      { onSettled: () => setLoading(false) },
    );
  };
  return (
    <button
      className="rounded bg-green-500 px-4 py-2 text-white hover:bg-green-600 disabled:opacity-50"
      onClick={handleBorrow}
      disabled={loading}
    >
      {loading ? "Borrowing..." : "Borrow"}
    </button>
  );
}

export default function CartPage() {
  const { user } = useUser();
  // Fetch cart items for signed-in user
  const {
    data: cart = [],
    isLoading,
    refetch,
  } = api.cart.getAll.useQuery({ userId: user?.id ?? "" }, { enabled: !!user });
  const removeMutation = api.cart.remove.useMutation({
    onSuccess: () => void refetch(),
  });
  const handleRemove = (bookId: number) => {
    if (user) removeMutation.mutate({ userId: user.id, bookId });
  };

  // Filter out any null entries (shouldn't occur but ensures type safety)
  const items = cart.filter((b): b is NonNullable<typeof b> => b !== null);

  if (!user) return <p className="p-4">Please sign in to view your cart.</p>;
  if (isLoading) return <p className="p-4">Loading cart...</p>;

  return (
    <>
      <Head>
        <title>User Cart | LibraryCatalog</title>
      </Head>
      <main className="min-h-screen bg-white p-4">
        <h2 className="mb-6 text-center text-2xl font-bold">USER CART</h2>
        <div className="flex max-h-[60vh] flex-col gap-6 overflow-y-auto pr-2">
          {items.length === 0 ? (
            <div className="text-center text-gray-500">Your cart is empty.</div>
          ) : (
            items.map((book) => (
              <div
                key={book.id}
                className="flex items-center gap-6 rounded border border-gray-200 bg-white p-4 shadow-sm"
              >
                {/* Book Details */}
                <div className="flex-1">
                  <Link
                    href={`/book/${book.id}`}
                    className="font-semibold text-blue-600 hover:underline"
                  >
                    {book.title}
                  </Link>
                  <div className="text-sm text-gray-500">
                    Series: {book.series ?? "N/A"}
                  </div>
                  <div className="text-sm text-gray-500">
                    ISBN: {book.isbn ?? "N/A"}
                  </div>
                  <div className="text-sm text-gray-500">
                    Published: {book.publicationYear ?? "N/A"}
                  </div>
                  <div className="mt-2 text-xs text-gray-400">
                    {book.description?.slice(0, 100) ?? ""}
                  </div>
                </div>
                <button
                  className="rounded border border-gray-300 px-4 py-2 hover:bg-red-100"
                  onClick={() => handleRemove(book.id)}
                >
                  Remove
                </button>
                <BorrowButton
                  bookId={book.id}
                  userId={user.id}
                  onBorrowed={refetch}
                />
              </div>
            ))
          )}
        </div>
      </main>
    </>
  );
}
