'use client';

import { FC, ReactNode, useCallback } from 'react';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import '@solana/wallet-adapter-react-ui/styles.css';

interface Props { children: ReactNode; }

export const WalletContextProvider: FC<Props> = ({ children }) => {
  const endpoint = process.env.NEXT_PUBLIC_SOLANA_RPC || 'https://api.devnet.solana.com';

  // Wallet Standard auto-discovery: pass empty array.
  // Any installed wallet that supports Wallet Standard (Phantom, Backpack,
  // Solflare, etc.) will be discovered automatically — no manual registration needed.
  const onError = useCallback((error: Error) => {
    console.warn('[WalletProvider] error:', error.message);
  }, []);

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={[]} autoConnect onError={onError}>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};
