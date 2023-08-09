import 'server-only';
import { Octokit, App } from 'octokit';

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

import { NextResponse } from 'next/server';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const name = searchParams.get('name');
  try {
    const response = await octokit.request(
      `GET /orgs/${name}`,
      {
        headers: {
          'X-GitHub-Api-Version': '2022-11-28',
        },
      },
    );

    const existsUrl = response?.data?.html_url;

    return NextResponse.json({
      exists: existsUrl !== undefined,
      existsUrl: existsUrl,
    });

  } catch (error) {
    return NextResponse.json({ exists: false });
  }
}
