import Head from "next/head";
import { useUser } from "@clerk/nextjs";
import { api } from "~/utils/api";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function MyBooksPage() {
  const { user } = useUser();
  // Fetch checked-out books and refetch on return
  const {
    data: books = [],
    isLoading,
    refetch,
  } = api.borrow.getAll.useQuery(
    { userId: user?.id ?? "" },
    { enabled: !!user },
  );
  // Setup return book mutation and state
  const returnMutation = api.borrow.returnBook.useMutation({
    onSettled: () => {
      setReturningId(null);
      void refetch();
    },
  });
  const [returningId, setReturningId] = useState<number | null>(null);

  // Setup renew book mutation and state
  const renewMutation = api.borrow.renewBook.useMutation({
    onSuccess: () => {
      void refetch();
      setRenewingId(null);
    },
  });
  const [renewingId, setRenewingId] = useState<number | null>(null);

  if (!user)
    return (
      <p className="p-4">Please sign in to view your checked out books.</p>
    );
  if (isLoading) return <p className="p-4">Loading checked out books...</p>;

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
          {books.length === 0 ? (
            <div className="text-center text-gray-500">
              You have no checked out books.
            </div>
          ) : (
            books.map((book) => (
              <div
                key={book.id}
                className="flex items-center gap-6 rounded-xl bg-white p-5 shadow-md transition hover:shadow-lg"
              >
                {/* Book Cover */}
                <div className="flex h-36 w-28 items-center justify-center overflow-hidden rounded-lg border border-gray-300 bg-gray-100">
                  <Image
                    src={`/${book.id}.jpg`}
                    alt={`Cover of ${book.title}`}
                    width={112}
                    height={144}
                    className="object-cover"
                  />
                </div>

                {/* Book Details */}
                <div className="flex-1">
                  <div className="text-xl font-semibold text-gray-800">
                    {book.title}
                  </div>
                  <div className="mt-2 text-sm text-gray-500">
                    Due:{" "}
                    {book.dueDate
                      ? new Date(book.dueDate).toLocaleDateString()
                      : "N/A"}
                  </div>
                </div>

                {/* Renew & Return Buttons */}
                <div className="flex items-center gap-4">
                  {/* Read Book Button */}
                  <Link href={`/read/${book.id}`}>
                    <button className="h-20 w-40 rounded-full bg-green-500 text-white text-sm font-medium transition hover:bg-green-600 flex items-center justify-center shadow-md">
                      Read Book
                    </button>
                  </Link>

                  {/* Renew & Return Buttons */}
                  <div className="flex flex-col items-center gap-2">
                    {book.renewable ? (
                      <button
                        className="rounded-full bg-blue-500 px-5 py-2 text-sm font-medium text-white transition hover:bg-blue-600 disabled:opacity-50"
                        onClick={() => {
                          setRenewingId(book.id);
                          renewMutation.mutate({ userId: user.id, bookId: book.id });
                        }}
                        disabled={renewingId === book.id}
                      >
                        {renewingId === book.id ? 'Renewing...' : 'Renew'}
                      </button>
                    ) : ( 
                      <button
                        className="cursor-not-allowed rounded-full bg-gray-300 px-5 py-2 text-sm font-medium text-gray-600"
                        disabled
                      >
                        Not Renewable
                      </button>
                    )}
                    <button
                      className="rounded-full bg-red-500 px-5 py-2 text-sm font-medium text-white transition hover:bg-red-600 disabled:opacity-50"
                      onClick={() => {
                        setReturningId(book.id);
                        returnMutation.mutate({
                          userId: user.id,
                          bookId: book.id,
                        });
                      }}
                      disabled={returningId === book.id}
                    >
                      {returningId === book.id ? "Returning..." : "Return"}
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </>
  );
}
