import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const username = searchParams.get('username');

  if (!username) {
    return NextResponse.json({ error: 'Username required' }, { status: 400 });
  }

  const token = req.headers.get('x-github-token');
  const headers: Record<string, string> = {
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
  };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  try {
    const [userRes, reposRes, eventsRes] = await Promise.all([
      fetch(`https://api.github.com/users/${username}`, { headers }),
      fetch(`https://api.github.com/users/${username}/repos?sort=stars&per_page=6&type=owner`, { headers }),
      fetch(`https://api.github.com/users/${username}/events/public?per_page=100`, { headers }),
    ]);

    const user = await userRes.json();
    const repos = await reposRes.json();
    const events = await eventsRes.json();

    // Count languages across repos
    const langMap: Record<string, number> = {};
    if (Array.isArray(repos)) {
      for (const repo of repos) {
        if (repo.language) {
          langMap[repo.language] = (langMap[repo.language] || 0) + (repo.size || 1);
        }
      }
    }

    // Count contributions from events
    let commitCount = 0;
    let prCount = 0;
    if (Array.isArray(events)) {
      for (const event of events) {
        if (event.type === 'PushEvent') commitCount += event.payload?.commits?.length || 0;
        if (event.type === 'PullRequestEvent') prCount++;
      }
    }

    const topRepos = Array.isArray(repos)
      ? repos
          .filter((r: any) => !r.fork)
          .slice(0, 6)
          .map((r: any) => ({
            name: r.name,
            description: r.description,
            stars: r.stargazers_count,
            forks: r.forks_count,
            language: r.language,
            url: r.html_url,
            topics: r.topics?.slice(0, 3) || [],
          }))
      : [];

    const totalStars = Array.isArray(repos)
      ? repos.reduce((sum: number, r: any) => sum + (r.stargazers_count || 0), 0)
      : 0;

    return NextResponse.json({
      user: {
        login: user.login,
        name: user.name,
        avatar: user.avatar_url,
        bio: user.bio,
        location: user.location,
        company: user.company,
        blog: user.blog,
        publicRepos: user.public_repos,
        followers: user.followers,
        following: user.following,
        createdAt: user.created_at,
      },
      stats: {
        totalStars,
        commitCount,
        prCount,
        topLanguages: Object.entries(langMap)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 5)
          .map(([name, size]) => ({ name, size })),
      },
      topRepos,
    });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch GitHub data' }, { status: 500 });
  }
}
