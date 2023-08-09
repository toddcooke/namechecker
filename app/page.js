'use client';

import { useState } from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/20/solid';
import TailwindLayout from '@/app/TailwindLayout';
import { LoadingIcon } from '@/app/components/LoadingIcon';
import Link from 'next/link';

export default function Home() {
  const [text, setText] = useState('');
  const [githubResponse, setGithubResponse] = useState(null);
  const [githubOrgResponse, setGithubOrgResponse] = useState(null);
  const [pypiResponse, setPypiResponse] = useState(null);
  const [domains, setDomains] = useState(null);
  const [homebrewResponse, setHomebrewResponse] = useState(null);
  const [aptResponse, setAptResponse] = useState(null);
  const [cratesResponse, setCratesResponse] = useState(null);
  const [mavenResponse, setMavenResponse] = useState(null);
  const [npmResponse, setNpmResponse] = useState(null);
  const [rubyGemsResponse, setRubyGemsResponse] = useState(null);
  const [nugetResponse, setNugetResponse] = useState(null);
  const [existsInGo, setExistsInGo] = useState(null);
  const [packagistResponse, setPackagistResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const availableDomains = domains?.domains?.filter((d) => d.available);

  async function searchPypi(name) {
    const response = await fetch(`/api/exists/pypi?name=${name}`);
    const json = await response.json();
    setPypiResponse(json);
  }

  async function searchGithub(name) {
    const response = await fetch(`/api/exists/github?name=${name}`);
    const json = await response.json();
    setGithubResponse(json);
  }

  async function searchGithubOrg(name) {
    const response = await fetch(`/api/exists/github_org?name=${name}`);
    const json = await response.json();
    setGithubOrgResponse(json)
  }

  async function searchDomainName(name) {
    const response = await fetch(`/api/exists/domain_name?name=${name}`);
    const json = await response.json();
    setDomains(json);
  }

  async function searchHomebrew(name) {
    const response = await fetch(`/api/exists/homebrew?name=${name}`);
    const json = await response.json();
    setHomebrewResponse(json);
  }

  async function searchApt(name) {
    const response = await fetch(`/api/exists/apt?name=${name}`);
    const json = await response.json();
    setAptResponse(json);
  }

  async function searchCrates(name) {
    const response = await fetch(`/api/exists/crates?name=${name}`);
    const json = await response.json();
    setCratesResponse(json);
  }

  async function searchMaven(name) {
    const response = await fetch(`/api/exists/maven?name=${name}`);
    const json = await response.json();
    setMavenResponse(json);
  }

  async function searchNpm(name) {
    const response = await fetch(`/api/exists/npm?name=${name}`);
    const json = await response.json();
    setNpmResponse(json);
  }

  async function searchRubygems(name) {
    const response = await fetch(`/api/exists/rubygems?name=${name}`);
    const json = await response.json();
    setRubyGemsResponse(json);
  }

  async function searchNuget(name) {
    const response = await fetch(`/api/exists/nuget?name=${name}`);
    const json = await response.json();
    setNugetResponse(json);
  }

  async function searchGo(name) {
    const response = await fetch(`/api/exists/go?name=${name}`);
    const json = await response.json();
    setExistsInGo(json.exists);
  }

  async function searchPackagist(name) {
    const response = await fetch(`/api/exists/packagist?name=${name}`);
    const json = await response.json();
    setPackagistResponse(json);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    let editedText = text.trim();
    if (!editedText) return;
    else setLoading(true);
    if (editedText.split(' ').length >= 2) {
      editedText = editedText.replaceAll(/\s+/gi, '-');
    }
    setText(editedText);
    // Set state to null to 'reset' search results
    setCratesResponse(null);
    setAptResponse(null);
    setHomebrewResponse(null);
    setGithubResponse(null);
    setGithubOrgResponse(null);
    setPypiResponse(null);
    setDomains(null);
    setMavenResponse(null);
    setNpmResponse(null);
    setRubyGemsResponse(null);
    setNugetResponse(null);
    setExistsInGo(null);
    setPackagistResponse(null);
    await Promise.all([
      searchGithub(editedText),
      searchGithubOrg(editedText),
      searchPypi(editedText),
      searchDomainName(editedText),
      searchHomebrew(editedText),
      searchApt(editedText),
      searchCrates(editedText),
      searchMaven(editedText),
      searchNpm(editedText),
      searchRubygems(editedText),
      searchNuget(editedText),
      searchGo(editedText),
      searchPackagist(editedText),
    ]);
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
        <CheckListItem state={githubResponse} name={'GitHub repo'} />
        <CheckListItem state={githubOrgResponse} name={'GitHub org'} />
        <CheckListItem state={pypiResponse} name={'PyPI package'} />
        <CheckListItem
          state={homebrewResponse}
          name={'Homebrew cask/formula'}
        />
        <CheckListItem state={aptResponse} name={'apt package'} />
        <CheckListItem state={cratesResponse} name={'Rust crate'} />
        <CheckListItem state={mavenResponse} name={'Maven package'} />
        <CheckListItem state={npmResponse} name={'npm package'} />
        <CheckListItem state={rubyGemsResponse} name={'Ruby gem'} />
        <CheckListItem state={nugetResponse} name={'Nuget package'} />
        <CheckListItem state={packagistResponse} name={'Packagist package'} />
        {existsInGo && (
          <li>
            ℹ️ Go package name{' '}
            <Link
              target={'_blank'}
              style={{ textDecoration: 'underline' }}
              href={`https://pkg.go.dev/search?q=${text}&m=package`}
            >
              may already exist
            </Link>
          </li>
        )}
        {existsInGo !== null && !existsInGo && (
          <li>✅ Go package name is available!</li>
        )}
        {domains?.domains != null && (
          <>
            {availableDomains.length === 5 && (
              <li>
                <Link
                  target={'_blank'}
                  href={`https://domains.google.com/registrar/search?searchTerm=${text}&hl=en`}
                >
                  ✅ Domain names available!
                </Link>
              </li>
            )}
            {availableDomains.length === 0 && (
              <>
                {domains?.error ? (
                  <li>ℹ️ {domains.error}</li>
                ) : (
                  <li>
                    ℹ️ Domain name already exists.{' '}
                    <Link
                      target={'_blank'}
                      style={{ textDecoration: 'underline' }}
                      href={`https:domains.google.com/registrar/search?searchTerm=${text}&hl=en`}
                    >
                      See alternatives
                    </Link>
                  </li>
                )}
              </>
            )}
            {availableDomains.length > 0 &&
              availableDomains.length < domains?.domains?.length && (
                <li>
                  <Link
                    target={'_blank'}
                    href={`https://domains.google.com/registrar/search?searchTerm=${text}&hl=en`}
                  >
                    ℹ️ Some domain names available
                  </Link>
                </li>
              )}
            <ul className="list-disc">
              {domains?.domains?.map((d) =>
                d.available ? (
                  <li className="ms-5" key={d.domain}>
                    ✅{' '}
                    <Link
                      target={'_blank'}
                      style={{ textDecoration: 'underline' }}
                      href={`https://www.namecheap.com/domains/registration/results/?domain=${d.domain}`}
                    >
                      {d.domain}
                    </Link>{' '}
                    is available!
                  </li>
                ) : (
                  <li className="ms-5" key={d.domain}>
                    ❌{' '}
                    <Link
                      style={{ textDecoration: 'underline' }}
                      target={'_blank'}
                      href={`https://${d.domain}`}
                    >
                      {d.domain}
                    </Link>{' '}
                    already exists
                  </li>
                ),
              )}
            </ul>
          </>
        )}
      </ul>
      {loading && <LoadingIcon />}
    </TailwindLayout>
  );
}

/**
 * @param state
 *    state = {
 *     exists: boolean
 *     existsUrl: string
 *    }?
 * @param name "PyPI package", for example
 */
function CheckListItem({ state, name }) {
  return (
    <>
      {state && (
        <>
          {state.exists ? (
            <li>
              ❌ {name}
              {' name '}
              <Link
                style={{ textDecoration: 'underline' }}
                target={'_blank'}
                href={state.existsUrl}
              >
                already exists
              </Link>
            </li>
          ) : (
            <li>✅ {name} name is available!</li>
          )}
        </>
      )}
    </>
  );
}
