import "server-only";

import { NextResponse } from "next/server";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const name = searchParams.get("name");
  const resFormula = await fetch(
    `https://formulae.brew.sh/api/formula/${name}.json`,
  );
  await new Promise((r) => setTimeout(r, 1000));
  const resCask = await fetch(
    `https://formulae.brew.sh/api/cask/${name}.json`,
  );
  return NextResponse.json({ exists: resFormula.status !== 404 || resCask.status !== 404 });
}
