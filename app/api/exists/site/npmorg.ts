import 'server-only';

import { fetchOptions } from '@/app/util';

export default async function GET(name) {
  const response = await fetch(
    `https://www.npmjs.com/org/${name}`,
    fetchOptions,
  );
  const exists = response.status === 200;
  return {
    name: "NPM org",
    exists: exists,
    existsUrl: exists && `https://www.npmjs.com/org/${name}`,
  };
}
