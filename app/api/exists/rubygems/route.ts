import 'server-only';

import { NextRequest, NextResponse } from 'next/server';
import { fetchOptions } from '@/app/util';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const name = searchParams.get('name');
  const response = await fetch(
    `https://rubygems.org/api/v1/gems/${name}.json`,
    fetchOptions,
  );
  const exists = response.status === 200;
  return NextResponse.json({
    name: "Ruby gem",
    exists: exists,
    existsUrl: exists && `https://rubygems.org/gems/${name}`,
  });
}
