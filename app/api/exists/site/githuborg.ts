import 'server-only';
import { Octokit, RequestError } from 'octokit';
import { NextResponse } from 'next/server';

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

export default async function GET(name) {
  try {
    const response = await octokit.request(`GET /users/${name}`, {
      headers: {
        'X-GitHub-Api-Version': '2022-11-28',
        'User-Agent':
          'namechecker.vercel.app https://github.com/toddcooke/namechecker',
      },
    });

    const existsUrl = response?.data?.html_url;

    return {
      exists: existsUrl !== undefined,
      existsUrl: existsUrl,
    };
  } catch (error) {
    if (error instanceof RequestError && error.status === 404) {
      return NextResponse.json({ exists: false });
    } else throw error;
  }
}
