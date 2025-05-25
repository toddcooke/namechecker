import 'server-only';

import { fetchOptions } from '@/app/util';

export default async function GET(name) {
  const response = await fetch(
    `https://rubygems.org/api/v1/gems/${name}.json`,
    fetchOptions,
  );
  const exists = response.status === 200;
  return {
    name: 'Ruby gem',
    exists: exists,
    existsUrl: exists && `https://rubygems.org/gems/${name}`,
  };
}
