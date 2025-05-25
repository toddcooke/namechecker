import 'server-only';
import { fetchOptions } from '@/app/util';

export default async function GET(name) {
  const response = await fetch(
    `https://crates.io/api/v1/crates/${name}`,
    fetchOptions,
  );
  const exists = response.status === 200;
  return {
    exists: exists,
    existsUrl: exists && `https://crates.io/crates/${name}`,
  };
}
