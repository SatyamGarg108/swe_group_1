import { GeistSans } from "geist/font/sans";
import { type AppType } from "next/app";
import {
  ClerkProvider,
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton
} from '@clerk/nextjs'
import "~/styles/globals.css" // Correct import

import { api } from "~/utils/api";

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <ClerkProvider>
      <div className={GeistSans.className}>
        <SignedOut>
          <SignInButton />
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
        <Component {...pageProps} />
      </div>
    </ClerkProvider>
  );
};

export default api.withTRPC(MyApp);