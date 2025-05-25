'use client';

import React, { useCallback, useEffect, useState, Suspense } from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/20/solid';
import { LoadingIcon } from '@/app/components/LoadingIcon';
import Link from 'next/link';
import TailwindLayout from '@/app/TailwindLayout';
import { usePathname, useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';

interface CheckListState {
  success: boolean;
  name: string;
  exists: boolean;
  existsUrl: string;
}

function HomeContent() {
  const [text, setText] = useState('');
  const [siteResponse, setSiteResponse] = useState<CheckListState[]>([]);

  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams()!;

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams);
      params.set(name, value);
      return params.toString();
    },
    [searchParams],
  );

  // When the URL includes a name query param, set the text to that value
  const nameQueryParam = useSearchParams().get('name');
  useEffect(() => {
    if (nameQueryParam) setText(nameQueryParam);
  }, [nameQueryParam]);

  // The following names correspond to files in the /api/exists/site directory,
  // where each name is used as a filename in lowercase.
  const sites = [
    'PyPI',
    'Github',
    'GithubOrg',
    'Gitlab',
    'Homebrew',
    'Apt',
    'Crates',
    'Maven',
    'NPM',
    'NPMOrg',
    'RubyGems',
    'Nuget',
    'Go',
    'Packagist',
  ];

  async function fetchNameResult(site, name) {
    const response = await fetch(`/api/exists/site?site=${site}&name=${name}`);
    const json = await response.json();
    console.log(json);
    setSiteResponse((prevState) => [...prevState, { name: site, ...json }]);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    let editedText = text.trim();
    if (!editedText) return;
    else setLoading(true);
    if (editedText.split(' ').length >= 2) {
      editedText = editedText.replaceAll(/\s+/gi, '-');
    }
    router.push(pathname + '?' + createQueryString('name', text));
    setText(editedText);
    // Set state to null to 'reset' search results
    setSiteResponse([]);
    await Promise.all(sites.map((site) => fetchNameResult(site, editedText)));
    setLoading(false);
  }

  return (
    <TailwindLayout>
      <form onSubmit={handleSubmit}>
        <label
          htmlFor="name-search"
          className="block text-sm font-medium leading-6"
        >
          Search names
        </label>
        <div className="mt-2 flex rounded-md shadow-sm">
          <div className="relative flex flex-grow items-stretch focus-within:z-10">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <MagnifyingGlassIcon
                className="h-5 w-5 text-gray-400"
                aria-hidden="true"
              />
            </div>
            <input
              id={'name-search'}
              type="text"
              spellCheck={false}
              autoCorrect={'off'}
              value={text}
              onChange={(e) => setText(e.target.value.toLowerCase())}
              className="block w-full rounded-none rounded-l-md border-0 py-1.5 pl-10 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 bg-transparent"
              placeholder="Name"
            />
          </div>
          <button
            id={'search-button'}
            type="button"
            onClick={handleSubmit}
            className="relative -ml-px inline-flex items-center gap-x-1.5 rounded-r-md px-3 py-2 text-sm font-semibold ring-1 ring-inset ring-gray-300 hover:bg-neutral-200  dark:hover:bg-neutral-700"
          >
            Search
          </button>
        </div>
      </form>

      <ul className="list-none pt-5">
        {siteResponse.map((res, idx) => (
          <CheckListItem key={idx} state={res} />
        ))}
      </ul>
      {loading && <LoadingIcon />}
    </TailwindLayout>
  );
}

function CheckListItem({ state }: { state: CheckListState }) {
  if (!state.success) {
    return <li>Error while getting result for {state.name}.</li>;
  }

  if (state.exists) {
    return (
      <li>
        {' '}
        ❌ {state.name} name{' '}
        <Link
          style={{ textDecoration: 'underline' }}
          target={'_blank'}
          href={state.existsUrl}
        >
          already exists
        </Link>
      </li>
    );
  }

  return <li>✅ {state.name} name is available!</li>;
}

// This exists solely to fix this error:
// useSearchParams() should be wrapped in a suspense boundary at page "/".
export default function Home() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HomeContent />
    </Suspense>
  );
}
