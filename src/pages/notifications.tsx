import Head from 'next/head';
import Link from 'next/link';
import { useUser } from '@clerk/nextjs';
import { api } from '~/utils/api';
import { useMemo } from 'react';
import Image from 'next/image';

export default function NotificationsPage() {
  const { user } = useUser();
  const { data: borrows = [], isLoading } = api.borrow.getAll.useQuery(
    { userId: user?.id ?? '' },
    { enabled: !!user }
  );

  // Current time memoized once per render
  const now = useMemo(() => new Date(), []);
  // Filter borrows for due/overdue notifications
  const notifications = useMemo(
    () =>
      borrows.filter((b) => {
        const due = new Date(b.dueDate);
        const diff = due.getTime() - now.getTime();
        return diff <= 24 * 60 * 60 * 1000;
      }),
    [borrows, now]
  );

  if (!user) {
    return <p className="p-4">Please sign in to view notifications.</p>;
  }
  if (isLoading) {
    return <p className="p-4">Loading notifications...</p>;
  }

  return (
    <>
      <Head>
        <title>Notifications | LibraryCatalog</title>
      </Head>
      <main className="min-h-screen bg-gradient-to-br from-white to-gray-100 p-6">
        <h1 className="mb-6 text-center text-3xl font-bold text-gray-800">
          🔔 Notifications
        </h1>
        {notifications.length === 0 ? (
          <p className="text-center text-gray-500">
            You have no upcoming or overdue books.
          </p>
        ) : (
          <div className="space-y-4">
            {notifications.map((b) => {
              const due = new Date(b.dueDate);
              const diffDays = Math.ceil(
                (due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
              );
              return (
                <Link key={b.id} href={`/book/${b.id}`}>
                  <div
                    className={`cursor-pointer rounded-lg bg-white p-4 shadow hover:shadow-md transition flex items-center border-l-4 ${
                      diffDays < 0 ? 'border-red-500' : 'border-yellow-500'
                    }`}
                  >
                    <Image
                      src={`/${b.id}.jpg`}
                      alt={b.title}
                      width={80}
                      height={100}
                      className="flex-shrink-0 rounded"
                    />
                    <div className="ml-4 flex-1">
                      <div className="flex justify-between items-center">
                        <h2 className="text-lg font-semibold text-gray-800">
                          {b.title}
                        </h2>
                        <div className="flex flex-col justify-center items-end gap-2">
                          {diffDays < 0 && (
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-red-600">
                                Past due
                              </span>
                              <span className="text-sm text-gray-500">
                                (Due on {due.toLocaleDateString()})
                              </span>
                            </div>
                          )}
                          <Link href="/my-books">
                            <button className="text-sm font-medium rounded-full bg-blue-500 px-5 py-2 text-white transition hover:bg-blue-600">
                              My Books
                            </button>
                          </Link>
                        </div>
                      </div>
                      <p
                        className={`mt-1 text-sm font-medium ${
                          diffDays < 0 ? 'text-red-600' : 'text-yellow-700'
                        }`}
                      >
                        {diffDays < 0
                          ? `Overdue by ${Math.abs(diffDays)} day${
                              Math.abs(diffDays) !== 1 ? 's' : ''
                            }`
                          : `Due on ${due.toLocaleDateString()} (${diffDays} day${
                              diffDays !== 1 ? 's' : ''
                            } left)`}
                      </p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </main>
    </>
  );
}
