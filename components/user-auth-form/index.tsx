"use client"

import * as React from "react"

import { cn } from "@/lib/utils"
import { Icons } from "@/components/icons"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ethers } from "ethers";
import { signIn } from "next-auth/react";
import { useToast } from "@/components/ui/use-toast"

// Fix typescript errors for window.ethereum
declare global {
  interface Window {
    ethereum?: any;
  }
}

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> { }

export function UserAuthForm({ className, ...props }: UserAuthFormProps) {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = React.useState<boolean>(false)

  async function onSubmit(event: React.SyntheticEvent) {
    event.preventDefault()
  }

  async function onSignInWithCrypto() {
    try {
      setIsLoading(true)

      if (!window.ethereum) {
        toast({
          description: "Please install MetaMask first.",
        })
        setIsLoading(false)
        return;
      }

      // Get the wallet provider, the signer and address
      //  see: https://docs.ethers.org/v6/getting-started/#starting-signing
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const walletAddress = await signer.getAddress();

      // Send the public address to generate a nonce associates with our account
      const response = await fetch("/api/auth/crypto/generateNonce", {
        method: "POST",
        body: JSON.stringify({
          walletAddress,
        }),
      });
      const responseData = await response.json();

      // Sign the received nonce
      const signedNonce = await signer.signMessage(responseData.nonce);

      // Use NextAuth to sign in with our address and the nonce
      await signIn("crypto", {
        walletAddress,
        signedNonce,
        callbackUrl: "/dashboard",
      });

      setIsLoading(false)
    } catch {
      toast({
        variant: "destructive",
        description: "Error with signing, please try again.",
      })
      setIsLoading(false)
    }
  }

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <form onSubmit={onSubmit}>
        <div className="grid gap-2">
          <div className="grid gap-2">
            <Label htmlFor="email">
              Email
            </Label>
            <Input
              id="email"
              placeholder="name@example.com"
              type="email"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect="off"
              disabled={isLoading}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" disabled={isLoading} />
          </div>
          <Button disabled={isLoading}>
            Sign In with Email
          </Button>
        </div>
      </form>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>

      <Button variant="outline" type="button" disabled={isLoading} onClick={onSignInWithCrypto}>
        {isLoading ? (
          <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Icons.metamask className="mr-2 h-4 w-4" />
        )}{" "}
        Sign in with Metamask
      </Button>
    </div>
  )
}