import 'server-only';

import { fetchOptions } from '@/app/util';

export default async function GET(name) {
  const response = await fetch(
    `https://search.maven.org/solrsearch/select?q=a:${name}&rows=1&wt=json`,
    fetchOptions,
  );
  const json = await response.json();
  const exists = json.response.numFound > 0;
  return {
    name: 'Maven package',
    exists: exists,
    // Sonatype search is currently somewhat broken,
    // so this link may not work correctly: https://issues.sonatype.org/browse/MVNCENTRAL-8264
    existsUrl:
      exists &&
      `https://central.sonatype.com/search?name=${name}&sort=name&q=${name}`,
  };
}
