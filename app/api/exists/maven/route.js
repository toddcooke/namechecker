import 'server-only';

import { NextResponse } from 'next/server';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const name = searchParams.get('name');
  const response = await fetch(
    `https://search.maven.org/solrsearch/select?q=a:${name}&rows=1&wt=json`,
  );
  const json = await response.json();
  const exists = json.response.numFound > 0;
  return NextResponse.json({
    exists: exists,
    // Sonatype search is currently somewhat broken,
    // so this link may not work correctly: https://issues.sonatype.org/browse/MVNCENTRAL-8264
    existsUrl:
      exists &&
      `https://central.sonatype.com/search?name=${name}&sort=name&q=${name}`,
  });
}
