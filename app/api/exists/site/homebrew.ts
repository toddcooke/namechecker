import 'server-only';

import { fetchOptions } from '@/app/util';

export default async function GET(name) {
  const resFormula = await fetch(
    `https://formulae.brew.sh/api/formula/${name}.json`,
    fetchOptions,
  );
  await new Promise((r) => setTimeout(r, 1000));
  const resCask = await fetch(`https://formulae.brew.sh/api/cask/${name}.json`);
  const exists = resFormula.status !== 404 || resCask.status !== 404;
  return {
    exists: exists,
    existsUrl:
      exists &&
      (resCask.status !== 404
        ? `https://formulae.brew.sh/api/cask/${name}.json`
        : `https://formulae.brew.sh/api/formula/${name}.json`),
  };
}
