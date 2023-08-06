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
  const [domains, setDomains] = useState(null);
  const [existsInHomebrew, setExistsInHomebrew] = useState(null);
  const [existsInApt, setExistsInApt] = useState(null);
  const [existsInCrates, setExistsInCrates] = useState(null);
  const [existsInMaven, setExistsInMaven] = useState(null);
  const [existsInNpm, setExistsInNpm] = useState(null);
  const [existsInRubygems, setExistsInRubygems] = useState(null);
  const [existsInNuget, setExistsInNuget] = useState(null);
  const [existsInGo, setExistsInGo] = useState(null);
  const [existsInPackagist, setExistsInPackagist] = useState(null);
  const [loading, setLoading] = useState(false);
  const availableDomains = domains?.filter((d) => d.available);

  async function searchPypi(name) {
    const response = await fetch(`/api/exists/pypi?name=${name}`);
    const json = await response.json();
    setExistsInPypi(json.exists);
  }

  async function searchGithub(name) {
    const response = await fetch(`/api/exists/github?name=${name}`);
    const json = await response.json();
    setExistsInGithub(json.exists);
  }

  async function searchDomainName(name) {
    const response = await fetch(`/api/exists/domain_name?name=${name}`);
    const json = await response.json();
    setDomains(json.domains);
  }

  async function searchHomebrew(name) {
    const response = await fetch(`/api/exists/homebrew?name=${name}`);
    const json = await response.json();
    setExistsInHomebrew(json.exists);
  }

  async function searchApt(name) {
    const response = await fetch(`/api/exists/apt?name=${name}`);
    const json = await response.json();
    setExistsInApt(json.exists);
  }

  async function searchCrates(name) {
    const response = await fetch(`/api/exists/crates?name=${name}`);
    const json = await response.json();
    setExistsInCrates(json.exists);
  }

  async function searchMaven(name) {
    const response = await fetch(`/api/exists/maven?name=${name}`);
    const json = await response.json();
    setExistsInMaven(json.exists);
  }

  async function searchNpm(name) {
    const response = await fetch(`/api/exists/npm?name=${name}`);
    const json = await response.json();
    setExistsInNpm(json.exists);
  }

  async function searchRubygems(name) {
    const response = await fetch(`/api/exists/rubygems?name=${name}`);
    const json = await response.json();
    setExistsInRubygems(json.exists);
  }

  async function searchNuget(name) {
    const response = await fetch(`/api/exists/nuget?name=${name}`);
    const json = await response.json();
    setExistsInNuget(json.exists);
  }

  async function searchGo(name) {
    const response = await fetch(`/api/exists/go?name=${name}`);
    const json = await response.json();
    setExistsInGo(json.exists);
  }

  async function searchPackagist(name) {
    const response = await fetch(`/api/exists/packagist?name=${name}`);
    const json = await response.json();
    setExistsInPackagist(json.exists);
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
    setDomains(null);
    setExistsInMaven(null);
    setExistsInNpm(null);
    setExistsInRubygems(null);
    setExistsInNuget(null);
    setExistsInGo(null);
    setExistsInPackagist(null);
    await Promise.all([
      searchGithub(editedText),
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
            id={"search-button"}
            type="button"
            onClick={handleSubmit}
            className="relative -ml-px inline-flex items-center gap-x-1.5 rounded-r-md px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 dark:text-amber-100 dark:hover:bg-slate-700"
          >
            Search
          </button>
        </div>
      </form>

      <ul className={"list-none pt-5 dark:text-amber-100"}>
        {existsInGithub && <li>❌ GitHub repo name already exists</li>}
        {existsInGithub !== null && !existsInGithub && (
          <li>✅ GitHub repo name is available!</li>
        )}

        {existsInPypi && <li>❌ PyPI package name already exists</li>}
        {existsInPypi !== null && !existsInPypi && (
          <li>✅ PyPI package name is available!</li>
        )}

        {existsInHomebrew && (
          <li>❌ Homebrew cask/formula name already exists</li>
        )}
        {existsInHomebrew !== null && !existsInHomebrew && (
          <li>✅ Homebrew cask/formula name is available!</li>
        )}

        {existsInApt && <li>❌ apt package name already exists</li>}
        {existsInApt !== null && !existsInApt && (
          <li>✅ apt package name is available!</li>
        )}

        {existsInCrates && <li>❌ Rust crate name already exists</li>}
        {existsInCrates !== null && !existsInCrates && (
          <li>✅ Rust crate name is available!</li>
        )}

        {existsInMaven && <li>❌ Maven package name already exists</li>}
        {existsInMaven !== null && !existsInMaven && (
          <li>✅ Maven package name is available!</li>
        )}

        {existsInNpm && <li>❌ npm package name already exists</li>}
        {existsInNpm !== null && !existsInNpm && (
          <li>✅ npm package name is available!</li>
        )}

        {existsInRubygems && <li>❌ Ruby gem name already exists</li>}
        {existsInRubygems !== null && !existsInRubygems && (
          <li>✅ Ruby gem name is available!</li>
        )}

        {existsInNuget && <li>❌ NuGet package name already exists</li>}
        {existsInNuget !== null && !existsInNuget && (
          <li>✅ NuGet package name is available!</li>
        )}

        {existsInPackagist && (
          <li>
            ℹ️ Packagist package name{" "}
            <Link
              style={{ textDecoration: "underline" }}
              href={`https://packagist.org/?query=${text}`}
            >
              may already exist
            </Link>
          </li>
        )}
        {existsInPackagist !== null && !existsInPackagist && (
          <li>✅ Packagist package name is available!</li>
        )}

        {existsInGo && (
          <li>
            ℹ️ Go package name{" "}
            <Link
              style={{ textDecoration: "underline" }}
              href={`https://pkg.go.dev/search?q=${text}&m=package`}
            >
              may already exist
            </Link>
          </li>
        )}
        {existsInGo !== null && !existsInGo && (
          <li>✅ Go package name is available!</li>
        )}

        {domains != null && (
          <>
            {availableDomains.length === 5 && (
              <li>
                <Link
                  target={"_blank"}
                  href={`https://domains.google.com/registrar/search?searchTerm=${text}&hl=en`}
                >
                  ✅ Domain names available!
                </Link>
              </li>
            )}
            {availableDomains.length === 0 && (
              <>
                {text.split(".").length - 1 > 1 ? (
                  <li>ℹ️ Domain name must have 0 or 1 dots</li>
                ) : (
                  <li>
                    ℹ️ Domain name already exists.{" "}
                    <Link
                      target={"_blank"}
                      style={{ textDecoration: "underline" }}
                      href={`https:domains.google.com/registrar/search?searchTerm=${text}&hl=en`}
                    >
                      See alternatives
                    </Link>
                  </li>
                )}
              </>
            )}
            {availableDomains.length > 0 &&
              availableDomains.length < domains.length && (
                <li>
                  <Link
                    target={"_blank"}
                    href={`https://domains.google.com/registrar/search?searchTerm=${text}&hl=en`}
                  >
                    ℹ️ Some domain names available
                  </Link>
                </li>
              )}
            <ul className={"list-disc"}>
              {domains.map((d) =>
                d.available ? (
                  <li className={"ms-5"} key={d.domain}>
                    ✅{" "}
                    <Link
                      target={"_blank"}
                      style={{ textDecoration: "underline" }}
                      href={`https://domains.google.com/registrar/search?searchTerm=${d.domain}&hl=en`}
                    >
                      {d.domain}
                    </Link>{" "}
                    is available!
                  </li>
                ) : (
                  <li className={"ms-5"} key={d.domain}>
                    ❌{" "}
                    <Link
                      style={{ textDecoration: "underline" }}
                      target={"_blank"}
                      href={`https://${d.domain}`}
                    >
                      {d.domain}
                    </Link>{" "}
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
