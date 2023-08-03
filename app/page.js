"use client";

import { useState } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/20/solid";
import TailwindLayout from "@/app/TailwindLayout";
import { LoadingIcon } from "@/app/components/LoadingIcon";
import Link from "next/link";

export default function Home() {
  const [text, setText] = useState("");
  const [existsInGithub, setExistsInGithub] = useState(null);
  const [existsInPypi, setExistsInPypi] = useState(null);
  const [availableDomains, setAvailableDomains] = useState(null);
  const [existsInHomebrew, setExistsInHomebrew] = useState(null);
  const [existsInApt, setExistsInApt] = useState(null);
  const [existsInCrates, setExistsInCrates] = useState(null);
  const [loading, setLoading] = useState(false);

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
      // 404 cors error issue https://github.com/pypi/warehouse/issues/14229
      console.log(e);
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

  async function searchCrates(name) {
    const response = await fetch(`https://crates.io/api/v1/crates/${name}`);
    setExistsInCrates(response.status === 200);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    let editedText = text.trim();
    if (!editedText) return;
    else setLoading(true);
    if (editedText.split(" ").length >= 2) {
      editedText = editedText.replaceAll(/\s+/gi, "-");
    }
    setText(editedText);
    // Set state to null to 'reset' search results
    setExistsInCrates(null);
    setExistsInApt(null);
    setExistsInHomebrew(null);
    setExistsInGithub(null);
    setExistsInPypi(null);
    setAvailableDomains(null);
    await Promise.all([
      searchGithub(editedText),
      searchPypi(editedText),
      searchDomainName(editedText),
      searchHomebrew(editedText),
      searchApt(editedText),
      searchCrates(editedText),
    ]);
    setLoading(false);
  }

  return (
    <TailwindLayout>
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
              spellCheck={false}
              autoCorrect={"off"}
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="block w-full rounded-none rounded-l-md border-0 py-1.5 pl-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 dark:bg-slate-700 dark:text-amber-100"
              placeholder="Name"
            />
          </div>
          <button
            type="button"
            onClick={handleSubmit}
            className="relative -ml-px inline-flex items-center gap-x-1.5 rounded-r-md px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 dark:text-amber-100 dark:hover:bg-slate-700"
          >
            Search
          </button>
        </div>
      </form>

      <ul className={"list-none pt-5 dark:text-amber-100"}>
        {existsInGithub && <li>❌ GitHub repo already exists</li>}
        {existsInGithub !== null && !existsInGithub && (
          <li>✅GitHub repo name is available!</li>
        )}

        {existsInPypi && <li>❌ PyPI package already exists</li>}
        {existsInPypi !== null && !existsInPypi && (
          <li>✅PyPI package name is available!</li>
        )}

        {existsInHomebrew && <li>❌ Homebrew cask/formula already exists</li>}
        {existsInHomebrew !== null && !existsInHomebrew && (
          <li>✅Homebrew cask/formula name is available!</li>
        )}

        {existsInApt && <li>❌ apt package already exists</li>}
        {existsInApt !== null && !existsInApt && (
          <li>✅apt package name is available!</li>
        )}

        {existsInCrates && <li>❌ Rust crate name already exists</li>}
        {existsInCrates !== null && !existsInCrates && (
          <li>✅Rust crate name is available!</li>
        )}

        {availableDomains !== null && availableDomains.length === 0 && (
          <li>
            ℹ️ Domain name (.com, .io, ...) taken.{" "}
            <Link
              target={"_blank"}
              style={{ "text-decoration": "underline" }}
              href={`https://domains.google.com/registrar/search?searchTerm=${text}&hl=en`}
            >
              See alternatives
            </Link>
          </li>
        )}
        {availableDomains !== null && availableDomains.length > 0 && (
          <>
            <li>
              <Link
                href={`https://domains.google.com/registrar/search?searchTerm=${text}&hl=en`}
              >
                ✅Domain name available!
              </Link>
            </li>
            <ul className={"list-disc"}>
              {availableDomains.map((d) => (
                <li className={"ms-5"} key={d.domain}>
                  {d.domain} is available!
                </li>
              ))}
            </ul>
          </>
        )}
      </ul>
      {loading && <LoadingIcon />}
    </TailwindLayout>
  );
}

// todo
// suggest alternate names from dictionary/thesarus
