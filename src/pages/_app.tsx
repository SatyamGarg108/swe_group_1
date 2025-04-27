import { GeistSans } from "geist/font/sans";
import { type AppType } from "next/app";
import React from 'react';
import { ClerkProvider,
  SignedIn,
  SignedOut,
  UserButton,
  useClerk
} from '@clerk/nextjs'
import "~/styles/globals.css" // Correct import

import { api } from "~/utils/api";

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <ClerkProvider {...pageProps}>
      <AppLayout>
        <Component {...pageProps} />
      </AppLayout>
    </ClerkProvider>
  );
};

// Layout component that uses Clerk hooks inside the provider
function AppLayout({ children }: { children: React.ReactNode }) {
  const { openSignIn, openSignUp } = useClerk();
  return (
    <div className={`${GeistSans.className} min-h-screen flex flex-col bg-gradient-to-b from-[#2e026d] to-[#15162c]`}>
      <header className="p-4 flex justify-end space-x-4">
        <SignedOut>
          <button onClick={() => openSignIn()} className="px-4 py-2 bg-white text-[#2e026d] rounded hover:opacity-80 transition">
            Sign In
          </button>
          <button onClick={() => openSignUp()} className="px-4 py-2 bg-white text-[#2e026d] rounded hover:opacity-80 transition">
            Sign Up
          </button>
        </SignedOut>
        <SignedIn>
          <div className="border-2 border-white rounded-full overflow-hidden w-8 h-8">
            <UserButton />
          </div>
        </SignedIn>
      </header>
      <main className="flex-grow">
        {children}
      </main>
    </div>
  );
}

export default api.withTRPC(MyApp);