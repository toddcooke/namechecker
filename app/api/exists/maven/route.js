import "server-only";

import { NextResponse } from "next/server";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const name = searchParams.get("name");
  const response = await fetch(
    `https://search.maven.org/solrsearch/select?q=a:${name}&rows=1&wt=json`,
  );
  const json = await response.json();
  return NextResponse.json({ exists: json.response.numFound > 0 });
}
