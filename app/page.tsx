'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/20/solid';
import { LoadingIcon } from '@/app/components/LoadingIcon';
import Link from 'next/link';
import TailwindLayout from '@/app/TailwindLayout';
import { usePathname, useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';

interface CheckListState {
  name: string;
  exists: boolean;
  existsUrl: string;
}

export default function Home() {
  const [text, setText] = useState('');
  const [siteResponse, setSiteResponse] = useState<CheckListState[]>([]);
  console.log(siteResponse)

  const [githubResponse, setGithubResponse] = useState<CheckListState>(null);
  const [githubOrgResponse, setGithubOrgResponse] = useState<CheckListState>(null);
  const [pypiResponse, setPypiResponse] = useState<CheckListState>(null);

  // const [homebrewResponse, setHomebrewResponse] =
  //   useState<CheckListState>(null);
  // const [aptResponse, setAptResponse] = useState<CheckListState>(null);
  // const [cratesResponse, setCratesResponse] = useState<CheckListState>(null);
  // const [mavenResponse, setMavenResponse] = useState<CheckListState>(null);
  // const [npmResponse, setNpmResponse] = useState<CheckListState>(null);
  // const [npmOrgResponse, setNpmOrgResponse] = useState<CheckListState>(null);
  // const [rubyGemsResponse, setRubyGemsResponse] =
  //   useState<CheckListState>(null);
  // const [nugetResponse, setNugetResponse] = useState<CheckListState>(null);
  // const [existsInGo, setExistsInGo] = useState<CheckListState>(null);
  // const [packagistResponse, setPackagistResponse] =
  //   useState<CheckListState>(null);
  // const [gitlabResponse, setGitlabResponse] = useState<CheckListState>(null);

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
    setText(nameQueryParam);
  }, [nameQueryParam]);

  const sites = [
    {
      name: "Github",
      searchName: async function (name) {
        const response = await fetch(`/api/exists/github?name=${name}`);
        const json = await response.json();
        // setGithubResponse(json);
        setSiteResponse(prevState => [...prevState, json]);
      }
    },
    {
      name: "PyPI",
      searchName: async function (name) {
        const response = await fetch(`/api/exists/pypi?name=${name}`);
        const json = await response.json();
        // setPypiResponse(json);
        console.log(json)
        setSiteResponse(prevState => [...prevState, json]);
      }
    }
  ]

  async function fetchNameResult(site, name) {
    const response = await fetch(`/api/exists/site?site=${site}&name=${name}`);
    const json = await response.json();
    console.log(json)
    setSiteResponse(prevState => [...prevState, json]);
  }

  // async function searchGithubOrg(name) {
  //   const response = await fetch(`/api/exists/github_org?name=${name}`);
  //   const json = await response.json();
  //   setGithubOrgResponse(json);
  // }

  // async function searchGitlab(name) {
  //   const response = await fetch(`/api/exists/gitlab?name=${name}`);
  //   const json = await response.json();
  //   setGitlabResponse(json);
  // }

  // async function searchHomebrew(name) {
  //   const response = await fetch(`/api/exists/homebrew?name=${name}`);
  //   const json = await response.json();
  //   setHomebrewResponse(json);
  // }

  // async function searchApt(name) {
  //   const response = await fetch(`/api/exists/apt?name=${name}`);
  //   const json = await response.json();
  //   setAptResponse(json);
  // }

  // async function searchCrates(name) {
  //   const response = await fetch(`/api/exists/crates?name=${name}`);
  //   const json = await response.json();
  //   setCratesResponse(json);
  // }

  // async function searchMaven(name) {
  //   const response = await fetch(`/api/exists/maven?name=${name}`);
  //   const json = await response.json();
  //   setMavenResponse(json);
  // }

  // async function searchNpm(name) {
  //   const response = await fetch(`/api/exists/npm?name=${name}`);
  //   const json = await response.json();
  //   setNpmResponse(json);
  // }

  // async function searchNpmOrg(name) {
  //   const response = await fetch(`/api/exists/npm_org?name=${name}`);
  //   const json = await response.json();
  //   setNpmOrgResponse(json);
  // }

  // async function searchRubygems(name) {
  //   const response = await fetch(`/api/exists/rubygems?name=${name}`);
  //   const json = await response.json();
  //   setRubyGemsResponse(json);
  // }

  // async function searchNuget(name) {
  //   const response = await fetch(`/api/exists/nuget?name=${name}`);
  //   const json = await response.json();
  //   setNugetResponse(json);
  // }

  // async function searchGo(name) {
  //   const response = await fetch(`/api/exists/go?name=${name}`);
  //   const json = await response.json();
  //   setExistsInGo(json.exists);
  // }

  // async function searchPackagist(name) {
  //   const response = await fetch(`/api/exists/packagist?name=${name}`);
  //   const json = await response.json();
  //   setPackagistResponse(json);
  // }

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
    await Promise.all(sites.map(site => { fetchNameResult(site.name, editedText) }))
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
        {siteResponse.map((res, idx) => <CheckListItem key={idx} state={res} name={res.name} />)}
      </ul>
      {loading && <LoadingIcon />}
    </TailwindLayout>
  );
}

function CheckListItem({
  state,
}: {
  state: CheckListState;
  name: string;
}) {
  return (
    <>
      {
        state.exists && (
          <li> ❌ {state.name} name {' '}
            <Link
              style={{ textDecoration: 'underline' }}
              target={'_blank'}
              href={state.existsUrl}
            >
              already exists
            </Link>
          </li>)
      }
      {!state.exists && <li>✅ {state.name} name is available!</li>}
    </>
  );
}
