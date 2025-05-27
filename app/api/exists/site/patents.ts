import 'server-only';
import { fetchOptions } from '@/app/util';

export default async function GET(name: string) {
  const query = encodeURIComponent(`{"_text_any":{"patent_title":"${name}"}}`);
  const url = `https://search.patentsview.org/api/v1/patent/?q=${query}`;
  const response = await fetch(url, {
    ...fetchOptions,
    headers: {
      ...fetchOptions.headers,
      accept: 'application/json',
      'X-Api-Key': process.env.PATENTVIEW_APIKEY,
    },
  });
  let exists = false;
  if (response.ok) {
    const data = await response.json();
    exists = !!(data?.patents && data.patents.length > 0);
  }
  return {
    name: 'Patent',
    exists: exists,
    existsUrl:
      exists && `https://patentsview.org/datatool#search&pat=2|${name}`,
    success: true,
  };
}
