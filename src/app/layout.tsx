import type { Metadata } from 'next';
import './globals.css';
import { WalletContextProvider } from '@/components/WalletProvider';
import { NextAuthProvider } from '@/components/NextAuthProvider';

export const metadata: Metadata = {
  title: 'YoChain — Your Web3 Identity, Proven Onchain',
  description: 'Generate a stunning, shareable Web3 profile powered by your real onchain activity across Solana, EVM, and GitHub.',
};


export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <NextAuthProvider>
          <WalletContextProvider>{children}</WalletContextProvider>
        </NextAuthProvider>
      </body>
    </html>
  );
}
