import 'server-only';

import { NextRequest, NextResponse } from 'next/server';
import { fetchOptions } from '@/app/util';
import { Octokit } from 'octokit';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const name = searchParams.get('name');
  const site = searchParams.get('site').toLowerCase();


  const caller = get_caller(site);

  const result = caller(name);
  return result;
}

function get_caller(site) {
  switch (site) {
    case 'pypi':
      return fetchPypi;
    case 'github':
      return fetchGithub;
  }
}

async function fetchPypi(name) {
  const response = await fetch(
    `https://pypi.org/pypi/${name}/json`,
    fetchOptions,
  );
  const exists = response.status === 200;
  return NextResponse.json({
    name: "PyPI package",
    exists: exists,
    existsUrl: exists && `https://pypi.org/project/${name}/`,
  });
}


async function fetchGithub(name) {

  const octokit = new Octokit({
    auth: process.env.GITHUB_TOKEN,
  });


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
    name: "Github repo",
    exists: existsUrl !== undefined,
    existsUrl: existsUrl,
  });
}