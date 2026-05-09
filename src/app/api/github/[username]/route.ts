import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';

export async function GET(req: NextRequest, props: { params: Promise<{ username: string }> }) {
  const params = await props.params;
  const username = params.username;

  if (!username) {
    return NextResponse.json({ error: 'Username required' }, { status: 400 });
  }

  try {
    const session = await auth();
    // @ts-ignore - session type might not have githubAccessToken typed properly
    const token = session?.githubAccessToken;

    const headers: any = {
      'User-Agent': 'YoChain-App',
      'Accept': 'application/vnd.github.v3+json',
    };

    if (token) {
      headers['Authorization'] = `token ${token}`;
    }

    // Fetch user and repos from REST API, and contributions from scraping the public page
    const [userRes, reposRes, contributionsRes] = await Promise.all([
      fetch(`https://api.github.com/users/${username}`, { headers, next: { revalidate: 3600 } }),
      fetch(`https://api.github.com/users/${username}/repos?per_page=100&type=owner`, { headers, next: { revalidate: 3600 } }),
      fetch(`https://github.com/users/${username}/contributions`, { next: { revalidate: 3600 } })
    ]);

    if (!userRes.ok) {
      return NextResponse.json({ error: 'GitHub User not found' }, { status: 404 });
    }

    const userData = await userRes.json();
    const reposData = reposRes.ok ? await reposRes.json() : [];

    let totalStars = 0;
    const languageCounts: Record<string, number> = {};

    if (Array.isArray(reposData)) {
      reposData.forEach((repo: any) => {
        totalStars += repo.stargazers_count || 0;
        if (repo.language) {
          languageCounts[repo.language] = (languageCounts[repo.language] || 0) + 1;
        }
      });
    }

    const topLanguages = Object.entries(languageCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(entry => entry[0]);

    // Parse contributions graph HTML (Fallback if GraphQL is not available)
    let totalContributions = 0;
    if (contributionsRes.ok) {
      const htmlText = await contributionsRes.text();
      // Look for "1,234 contributions in the last year"
      const match = htmlText.match(/([\d,]+)\s+contributions\s+in\s+the\s+last\s+year/i);
      if (match) {
        totalContributions = parseInt(match[1].replace(/,/g, ''), 10);
      }
    }

    return NextResponse.json({
      username: userData.login,
      publicRepos: userData.public_repos || 0,
      totalStars,
      topLanguages,
      createdAt: userData.created_at,
      totalContributions
    });
  } catch (error) {
    console.error('GitHub API error:', error);
    return NextResponse.json({ error: 'Failed to fetch GitHub data' }, { status: 500 });
  }
}
