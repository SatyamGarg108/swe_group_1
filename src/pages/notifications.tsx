// src/pages/notifications.tsx
import Head from "next/head";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { api, type RouterOutputs } from "~/utils/api";

type Notification = RouterOutputs["borrow"]["getNotifications"][number];

export default function NotificationsPage() {
  const { user, isLoaded: authLoaded } = useUser();
  const { data: items = [], isLoading, error } =
    api.borrow.getNotifications.useQuery(undefined, {
      enabled: authLoaded && !!user,
    });

  if (!authLoaded) return null; // Clerk is still initializing
  if (!user) {
    return <p className="p-4">Please sign in to view your notifications.</p>;
  }
  if (isLoading) {
    return <p className="p-4">Loading notifications…</p>;
  }
  if (error) {
    return (
      <p className="p-4 text-red-600">
        Error: {error.message}
      </p>
    );
  }

  const now = new Date();

  return (
    <>
      <Head>
        <title>Notifications | LibraryCatalog</title>
      </Head>
      <main className="min-h-screen bg-gray-100 p-6">
        <h2 className="mb-6 text-2xl font-bold text-gray-800">
          🔔 Notifications
        </h2>
        {items.length === 0 ? (
          <p className="text-gray-600">You have no notifications.</p>
        ) : (
          <ul className="space-y-4">
            {items.map((n: Notification) => {
              const due = new Date(n.dueDate);
              const isOverdue = due < now;

              return (
                <li
                  key={`${n.copyId}-${n.dueDate}`}
                  className="rounded-lg bg-white p-4 shadow"
                >
                  <Link
                    href={`/book/${n.bookId}`}
                    className="text-lg font-semibold text-blue-600 hover:underline"
                  >
                    {n.title}
                  </Link>
                  <p className="mt-1 text-sm text-gray-700">
                    {isOverdue
                      ? `Overdue since ${due.toLocaleDateString()}.`
                      : `Due tomorrow (${due.toLocaleDateString()}).`}
                  </p>
                </li>
              );
            })}
          </ul>
        )}
      </main>
    </>
  );
}
