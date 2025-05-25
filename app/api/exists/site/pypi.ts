import { fetchOptions } from '@/app/util';

export default async function pypi(name) {
  const response = await fetch(
    `https://pypi.org/pypi/${name}/json`,
    fetchOptions,
  );
  const exists = response.status === 200;
  return {
    exists: exists,
    existsUrl: exists && `https://pypi.org/project/${name}/`,
  };
}
