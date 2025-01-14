import 'server-only';

import { NextRequest, NextResponse } from 'next/server';
import { fetchOptions } from '@/app/util';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const name = searchParams.get('name');
  const response = await fetch(
    `https://www.npmjs.com/org/${name}`,
    fetchOptions,
  );
  const exists = response.status === 200;
  return NextResponse.json({
    name: "NPM org",
    exists: exists,
    existsUrl: exists && `https://www.npmjs.com/org/${name}`,
  });
}
