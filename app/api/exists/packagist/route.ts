import 'server-only';

import { NextRequest, NextResponse } from 'next/server';
import { fetchOptions } from '@/app/util';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const name = searchParams.get('name');
  const response = await fetch(
    `https://packagist.org/search.json?q=${name}`,
    fetchOptions,
  );
  const json = await response.json();
  const existsUrl = json.results
    .filter((item) => item.name.split('/')[1] === name)
    .sort((a, b) => a.downloads < b.downloads)
    .pop()?.url;
  return NextResponse.json({
    exists: existsUrl !== undefined,
    existsUrl: existsUrl,
  });
}
