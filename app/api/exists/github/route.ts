import 'server-only';
import { Octokit } from 'octokit';

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const name = searchParams.get('name');
  const response = await octokit.request(
    `GET /search/repositories?q=${name}&type=repositories`,
    {
      headers: {
        'X-GitHub-Api-Version': '2022-11-28',
        'User-Agent':
          'namechecker.vercel.app https://github.com/toddcooke/namechecker',
      },
    },
  );

  const repositories = response.data.items
    .filter(
      (item) =>
        item.name.toLowerCase() === name.toLowerCase() &&
        item.stargazers_count > 10,
    )
    .sort((a, b) => b.stargazers_count - a.stargazers_count);

  const existsUrl = repositories[0]?.html_url;

  return NextResponse.json({
    exists: existsUrl !== undefined,
    existsUrl: existsUrl,
  });
}
