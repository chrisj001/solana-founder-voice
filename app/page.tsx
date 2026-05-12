"use client";

import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useWallet } from "@solana/wallet-adapter-react";

export default function Home() {
  const { publicKey } = useWallet();

  return (
    <main className="flex flex-col items-center justify-center min-h-screen gap-6">
      <h1 className="text-2xl font-bold">AUDD Invoice App</h1>

      <WalletMultiButton />

      {publicKey && (
        <p className="text-green-600">
          Connected: {publicKey.toBase58()}
        </p>
      )}
    </main>
  );
}