import 'server-only';

import { fetchOptions } from '@/app/util';

export default async function GET(name) {
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
  return {
    exists: searchCount > 0,
    existsUrl: `https://pkg.go.dev/search?q=${name}&m=package`,
  };
}
