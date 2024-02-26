import { prisma } from "@/prisma";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { ethers } from "ethers";
import NextAuth, { AuthOptions, RequestInternal } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

// Authorization function for crypto login
async function authorizeCrypto(
  credentials: Record<"walletAddress" | "signedNonce", string> | undefined
) {
  if (!credentials) return null;

  const { walletAddress, signedNonce } = credentials;

  // Get user from database with their generated nonce
  const user = await prisma.user.findUnique({
    where: { walletAddress },
    include: { cryptoLoginNonce: true },
  });

  if (!user?.cryptoLoginNonce) return null;

  // Compute the signer address from the saved nonce and the received signature
  const signerAddress = ethers.verifyMessage(
    user.cryptoLoginNonce.nonce,
    signedNonce
  );

  // Check that the signer address matches the wallet address
  //  that is trying to sign in
  if (signerAddress !== walletAddress) return null;

  // Check that the nonce is not expired
  if (user.cryptoLoginNonce.expires < new Date()) return null;

  // Everything is fine, clear the nonce and return the user
  await prisma.cryptoLoginNonce.delete({ where: { userId: user.id } });

  // return {
  //   id: user.id,
  //   walletAddress: user.walletAddress,
  // };
  return {
    id: Number(user?.id) as unknown as string,
    walletAddress: user.walletAddress,
  }
}

export const authOptions: AuthOptions = {
  // Setting error and signin pages to our /auth custom page
  pages: {
    signIn: "/auth",
    error: "/auth",
  },
  providers: [
    CredentialsProvider({
      id: "crypto",
      name: "Crypto Wallet Auth",
      credentials: {
        walletAddress: { label: "Wallet Address", type: "text" },
        signedNonce: { label: "Signed Nonce", type: "text" },
      },
      authorize: authorizeCrypto,
    }),
  ],
  adapter: PrismaAdapter(prisma),
  // Due to a NextAuth bug, the default database strategy is no usable
  //  with CredentialsProvider, so we need to set strategy to JWT
  session: {
    strategy: "jwt",
  },
  // Setting secret here for convenience, do not use this in production
  secret: process.env.NEXTAUTH_SECRET,

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.walletAddress = (user as any).walletAddress
      }
      return token
    },
    async session({ session, token }) {
      session.user = {
        id: Number(token.id),
        walletAddress: String(token.walletAddress),
      }
      return session
    },
  },
};

export default NextAuth(authOptions);
