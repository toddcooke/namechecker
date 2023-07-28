import "server-only";
import { Octokit, App } from "octokit";

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

import { NextResponse } from "next/server";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const repo = searchParams.get("repo");
  console.log("xxx", request);

  const resp = await octokit.request(
    `GET /search/repositories?q=${repo}&type=repositories`,
    {
      headers: {
        "X-GitHub-Api-Version": "2022-11-28",
      },
    },
  );

  console.log(resp.status);
  console.log(resp.data);

  // const body = await octokit.rest.repos.get({ repo: "asdf" });
  return NextResponse.json(
    { exists: resp.data.total_count > 0 },
    { status: resp.status },
  );
}
