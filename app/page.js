"use client";

import styles from "./page.module.css";
import { useState } from "react";

export default function Home() {
  const [text, setText] = useState("");
  const [existsInGithub, setExistsInGithub] = useState(null);
  const [existsInPypi, setExistsInPypi] = useState(null);
  const [availableDomains, setAvailableDomains] = useState(null);
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
    const res = await fetch(`/api/domain_available?domainName=${domainName}`);
    const json = await res.json();
    setAvailableDomains(json.domains.filter((d) => d.available));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    await Promise.all([
      searchGithub(text),
      searchPypi(text),
      searchDomainName(text),
    ]);
    setLoading(false);
  }

  return (
    <main className={styles.main}>
      <form onSubmit={handleSubmit}>
        <input
          value={text}
          type={"text"}
          onChange={(e) => setText(e.target.value)}
        />

        <button type={"submit"} onClick={handleSubmit}>
          Search
        </button>
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
  );
}
