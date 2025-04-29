import Head from "next/head";
import { useState, useEffect } from "react";
import Link from "next/link";


type CartItem = { id: string; title: string; cover: string };
export default function CartPage() {
  const [cart, setCart] = useState<CartItem[]>([]);

  // Load cart from localStorage on client
  useEffect(() => {
    try {
      const raw = localStorage.getItem('cart') ?? '[]';
      const parsed: unknown = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        const dataArray = parsed as unknown[];
        const validItems: CartItem[] = dataArray.filter((entry): entry is CartItem => {
          if (typeof entry !== 'object' || entry === null) return false;
          const rec = entry as Record<string, unknown>;
          return (
            typeof rec.id === 'string' &&
            typeof rec.title === 'string' &&
            typeof rec.cover === 'string'
          );
        });
        setCart(validItems);
      }
    } catch {
      setCart([]);
    }
  }, []);

  const removeBook = (id: string) => {
    const newCart = cart.filter((b) => b.id !== id);
    setCart(newCart);
    localStorage.setItem("cart", JSON.stringify(newCart));
  };

  return (
    <>
      <Head>
        <title>User Cart | LibraryCatalog</title>
      </Head>
      <main className="min-h-screen bg-white p-4">
        <h2 className="mb-6 text-center text-2xl font-bold">USER CART</h2>
        <div className="flex flex-col gap-6 max-h-[60vh] overflow-y-auto pr-2">
          {cart.length === 0 ? (
            <div className="text-center text-gray-500">Your cart is empty.</div>
          ) : (
            cart.map((book) => (
              <div key={book.id} className="flex items-center gap-6">
                <div className="flex h-32 w-24 items-center justify-center rounded border border-gray-300 bg-gray-100">
                  <span className="text-gray-500">{book.cover ?? "book cover"}</span>
                </div>
                <div className="flex-1 rounded border border-gray-300 p-4">About the book: {book.title}</div>
                <button
                  className="rounded border border-gray-300 px-4 py-2 hover:bg-red-100"
                  onClick={() => removeBook(book.id)}
                >
                  remove book
                </button>
              </div>
            ))
          )}
        </div>
      </main>
    </>
  );
}
