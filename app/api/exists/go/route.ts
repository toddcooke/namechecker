import 'server-only';

import { NextRequest, NextResponse } from 'next/server';
import { fetchOptions } from '@/app/util';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const name = searchParams.get('name');
  const response = await fetch(
    `https://pkg.go.dev/search?q=${name}&m=package`,
    fetchOptions,
  );
  const text = await response.text();
  const regex = /Showing <strong>(\d+)<\/strong>/;
  const match = text.match(regex);
  let searchCount = 0;
  if (match && match[1]) {
    searchCount = parseInt(match[1]);
  }
  return NextResponse.json({
    exists: searchCount > 0,
    existsUrl: `https://pkg.go.dev/search?q=${name}&m=package`,
  });
}
