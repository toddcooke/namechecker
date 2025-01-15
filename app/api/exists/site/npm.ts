import 'server-only';

import { NextRequest, NextResponse } from 'next/server';
import { fetchOptions } from '@/app/util';

export default async function GET(name) {
  const response = await fetch(
    `https://registry.npmjs.org/${name}`,
    fetchOptions,
  );
  const exists = response.status === 200;
  return {
    name: "NPM package",
    exists: exists,
    existsUrl: exists && `https://registry.npmjs.org/${name}`,
  };
}
