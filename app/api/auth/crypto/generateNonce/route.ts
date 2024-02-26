import { NextResponse, NextRequest } from "next/server"
import prisma from "@/prisma";
import crypto from "crypto";

interface CryptoNonceResponse {
  nonce: string;
  expires: string;
}

// Generating a nonce is the first step of both registering and logging in.
// Later steps of both logging in and registering require the user to sign
//  the nonce I send back, with that they prove that they are the owners
//  of the public address they gave.

export async function POST(request: NextRequest) {
  try {

    const { walletAddress } = await request.json();

    // Note: this nonce is displayed in the user's wallet for them to sign
    const nonce = crypto.randomBytes(32).toString("hex");

    // Set the expiry of the nonce to 1 hour
    const expires = new Date(new Date().getTime() + 1000 * 60 * 60);

    // Create or update the nonce for the given user
    //  see: https://www.prisma.io/docs/reference/api-reference/prisma-client-reference#upsert
    await prisma.user.upsert({
      where: { walletAddress },
      create: {
        walletAddress,
        cryptoLoginNonce: {
          create: {
            nonce,
            expires,
          },
        },
      },
      update: {
        cryptoLoginNonce: {
          upsert: {
            create: {
              nonce,
              expires,
            },
            update: {
              nonce,
              expires,
            },
          },
        },
      },
    });

    return NextResponse.json({
      nonce,
      expires: expires.toISOString(),
    })
  } catch (e) {
    return NextResponse.json(
      {
        message: `Error making payment: ${e}`,
      },
      { status: 500 },
    )
  }
}