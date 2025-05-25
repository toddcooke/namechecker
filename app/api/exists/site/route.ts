import 'server-only';

import { NextRequest, NextResponse } from 'next/server';
import { fetchOptions } from '@/app/util';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const name = searchParams.get('name');
  const site = searchParams.get('site').toLowerCase();

  let result;
  try {
    let caller = await import(`./${site}.ts`);
    result = { success: true, ...await caller.default(name) };
  }
  catch (err) {
    console.log(err)
    result = {
      success: false
    }
  }

  return NextResponse.json(result)
}