import NextAuth from 'next-auth';
import GitHub from 'next-auth/providers/github';

const handler = NextAuth({
  providers: [
    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID || '',
      clientSecret: process.env.GITHUB_CLIENT_SECRET || '',
    }),
  ],
  callbacks: {
    async jwt({ token, account, profile }) {
      if (account?.access_token) {
        token.githubAccessToken = account.access_token;
      }
      // Store actual GitHub username (login), not display name
      if (profile) {
        token.githubUsername = (profile as any).login;
      }
      return token;
    },
    async session({ session, token }) {
      (session as any).githubAccessToken = token.githubAccessToken;
      // Expose the real GitHub username in session
      (session as any).githubUsername = token.githubUsername;
      return session;
    },
  },
});

export { handler as GET, handler as POST };
