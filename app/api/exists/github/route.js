import 'server-only';
import { Octokit, App } from 'octokit';

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

import { NextResponse } from 'next/server';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const name = searchParams.get('name');
  const response = await octokit.request(
    `GET /search/repositories?q=${name}&type=repositories`,
    {
      headers: {
        'X-GitHub-Api-Version': '2022-11-28',
      },
    },
  );

  const repository = response.data.items.find(
    (item) => item.name.toLowerCase() === name.toLowerCase(),
  );

  const enoughStars = repository?.stargazers_count > 10;

  return NextResponse.json({
    exists: enoughStars,
    existsUrl: enoughStars && repository.html_url,
  });
}
