import "server-only";

import { NextResponse } from "next/server";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const name = searchParams.get("name");
  const response = await fetch(`https://packagist.org/search.json?q=${name}`);
  const json = await response.json();
  return NextResponse.json({ exists: json.total > 0 });
}
