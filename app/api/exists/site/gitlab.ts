import 'server-only';

import { fetchOptions } from '@/app/util';

export default async function GET(name) {
  try {
    for (let page = 1; page <= 10; page++) {
      const response = await fetch(
        `https://gitlab.com/api/v4/projects?search="${name}"&per_page=100&page=${page}`,
        fetchOptions,
      );
      const json = await response.json();
      if (json.length === 0) break;
      const url = json.find((value) => value.name === name)?.web_url;
      if (url) {
        return {
          name: 'Gitlab project',
          exists: true,
          existsUrl: url,
        };
      }
    }
    return {
      name: 'Gitlab project',
      exists: false,
    };
  } catch (e) {
    // GitLab doesn't like their api getting spammed, but they don't have a projects/<name> endpoint.
    // So if we get an error we'll just show nothing.
    console.error(e);
    return null;
  }
}
