import "server-only";

import { NextResponse } from "next/server";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const name = searchParams.get("name");
  const response = await fetch(`https://registry.npmjs.org/${name}`);
  return NextResponse.json({ exists: response.status === 200 });
}
