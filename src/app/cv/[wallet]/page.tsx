import { Metadata } from 'next';
import CVPageClient from './CVPageClient';

interface Props {
  params: Promise<{ wallet: string }>;
  searchParams: Promise<{ gh?: string }>;
}

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const { wallet } = await params;
  const { gh } = await searchParams;
  const short = `${wallet.slice(0, 4)}...${wallet.slice(-4)}`;
  return {
    title: `${gh ? `@${gh}` : short} — SolCV`,
    description: `Web3 developer profile for ${gh ? `@${gh}` : short}. Built on Solana.`,
    openGraph: {
      title: `${gh ? `@${gh}` : short} — SolCV`,
      description: `Web3 CV powered by onchain activity and GitHub.`,
    },
  };
}

export default async function CVPage({ params, searchParams }: Props) {
  const { wallet } = await params;
  const { gh } = await searchParams;
  return <CVPageClient wallet={wallet} githubUsername={gh} />;
}
