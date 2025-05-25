import 'server-only';

import { NextRequest, NextResponse } from 'next/server';
import { fetchOptions } from '@/app/util';

export default async function GET(name) {
  const response = await fetch(
    `https://api.nuget.org/v3-flatcontainer/${name.toLowerCase()}/index.json`,
    fetchOptions,
  );
  const exists = response.status === 200;
  return {
    name: "Nuget package",
    exists: exists,
    existsUrl: exists && `https://www.nuget.org/packages/${name}`,
  };
}
