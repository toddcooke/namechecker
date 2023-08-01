"use client";

import styles from "./page.module.css";
import { useState } from "react";
import {
  MagnifyingGlassIcon,
  PlusIcon,
  UsersIcon,
  XMarkIcon,
} from "@heroicons/react/20/solid";
import TailwindLayout from "@/app/TailwindLayout";

export default function Home() {
  const [text, setText] = useState("");
  const [existsInGithub, setExistsInGithub] = useState(null);
  const [existsInPypi, setExistsInPypi] = useState(null);
  const [availableDomains, setAvailableDomains] = useState(null);
  const [existsInHomebrew, setExistsInHomebrew] = useState(null);
  const [existsInApt, setExistsInApt] = useState(null);
  const [loading, setLoading] = useState(false);
  const [checks, setChecks] = useState({
    github: true,
    pypi: true,
    domains: true,
    homebrew: true,
    apt: true,
  });

  async function searchPypi(packageName) {
    let resp;
    try {
      resp = await fetch(`https://pypi.org/pypi/${packageName}/json`, {
        headers: {
          Host: "pypi.org",
          Accept: "application/json",
        },
      });
    } catch (e) {
      console.log(e);
      setExistsInPypi(false);
      return;
    }

    if (resp.status === 200) setExistsInPypi(true);
    else setExistsInPypi(false);
  }

  async function searchGithub(repoName) {
    const res = await fetch(`/api/exists/github?repo=${repoName}`);
    const json = await res.json();
    setExistsInGithub(json.exists);
  }

  async function searchDomainName(domainName) {
    const res = await fetch(`/api/exists/domain_name?domainName=${domainName}`);
    const json = await res.json();
    setAvailableDomains(json.domains.filter((d) => d.available));
  }

  async function searchHomebrew(name) {
    const resFormula = await fetch(
      `https://formulae.brew.sh/api/formula/${name}.json`,
    );
    await new Promise((r) => setTimeout(r, 1000));
    const resCask = await fetch(
      `https://formulae.brew.sh/api/cask/${name}.json`,
    );
    setExistsInHomebrew(resFormula.status !== 404 || resCask.status !== 404);
  }

  async function searchApt(name) {
    const res = await fetch(`/api/exists/apt?name=${name}`);
    const json = await res.json();
    setExistsInApt(json.exists);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    // Maybe show loading icon per search?
    // setLoading(true);
    // await Promise.all([
    searchGithub(text);
    searchPypi(text);
    searchDomainName(text);
    searchHomebrew(text);
    searchApt(text);
    // ]);
    // setLoading(false);
  }

  return (
    <TailwindLayout>
      <main className={styles.main}>
        <form onSubmit={handleSubmit}>
          <label
            htmlFor="name-search"
            className="block text-sm font-medium leading-6 text-gray-900 dark:text-amber-100"
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
                id={"name-search"}
                type="text"
                onChange={(e) => setText(e.target.value)}
                className="block w-full rounded-none rounded-l-md border-0 py-1.5 pl-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 dark:bg-slate-700 dark:text-amber-100"
                placeholder="Name"
              />
            </div>
            <button
              type="button"
              onClick={handleSubmit}
              className="relative -ml-px inline-flex items-center gap-x-1.5 rounded-r-md px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 dark:text-amber-100"
            >
              Search
            </button>
          </div>
        </form>

        {loading ? (
          "Loading..."
        ) : (
          <>
            {existsInGithub && <p>❌ GitHub repo already exists</p>}
            {existsInGithub !== null && !existsInGithub && (
              <p>✅GitHub repo name is available!</p>
            )}

            {existsInPypi && <p>❌ PyPI package already exists</p>}
            {existsInPypi !== null && !existsInPypi && (
              <p>✅PyPI package name is available!</p>
            )}

            {existsInHomebrew && <p>❌ Homebrew cask/formula already exists</p>}
            {existsInHomebrew !== null && !existsInHomebrew && (
              <p>✅Homebrew cask/formula name is available!</p>
            )}

            {existsInApt && <p>❌ apt package already exists</p>}
            {existsInApt !== null && !existsInApt && (
              <p>✅apt package name is available!</p>
            )}

            {availableDomains !== null && availableDomains.length === 0 && (
              <p>❌ Domain name already exists</p>
            )}
            {availableDomains !== null && availableDomains.length > 0 && (
              <>
                <p>✅Domain name available!</p>
                <ul>
                  {availableDomains.map((d) => (
                    <li key={d.domain}>{d.domain} is available!</li>
                  ))}
                </ul>
              </>
            )}
          </>
        )}
      </main>
    </TailwindLayout>
  );
}
// todo
// wrap up simple dark mode
//
// space search results better - shouldn't take up tons of vertiical space
//
// suggest alternate names from dictionary/thesarus
