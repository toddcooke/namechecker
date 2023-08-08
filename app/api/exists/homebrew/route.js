import 'server-only';

import { NextResponse } from 'next/server';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const name = searchParams.get('name');
  const resFormula = await fetch(
    `https://formulae.brew.sh/api/formula/${name}.json`,
  );
  await new Promise((r) => setTimeout(r, 1000));
  const resCask = await fetch(`https://formulae.brew.sh/api/cask/${name}.json`);
  const exists = resFormula.status !== 404 || resCask.status !== 404;
  return NextResponse.json({
    exists: exists,
    existsUrl:
      exists &&
      (resCask.status !== 404
        ? `https://formulae.brew.sh/api/cask/${name}.json`
        : `https://formulae.brew.sh/api/formula/${name}.json`),
  });
}
