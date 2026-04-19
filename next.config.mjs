/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'avatars.githubusercontent.com' },
      { protocol: 'https', hostname: '*.arweave.net' },
      { protocol: 'https', hostname: 'arweave.net' },
      { protocol: 'https', hostname: '*.ipfs.io' },
      { protocol: 'https', hostname: 'ipfs.io' },
      { protocol: 'https', hostname: '*.nftstorage.link' },
      { protocol: 'https', hostname: 'raw.githubusercontent.com' },
    ],
  },
  turbopack: {},
};

export default nextConfig;
