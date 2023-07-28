"use client";

import styles from "./page.module.css";
import { useState } from "react";

export default function Home() {
  const [text, setText] = useState("");
  const [existsInGithub, setExistsInGithub] = useState(null);
  const [existsInPip, setExistsInPip] = useState(null);
  const [loading, setLoading] = useState(false);

  async function searchPip(packageName) {
    console.log("xxx", packageName);

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
      return;
    }

    // const json = await resp.json();
    console.log("xxx", resp);
    if (resp.status === 200) setExistsInPip(true);
    else setExistsInPip(false);
  }

  async function searchGithub(repoName) {
    const res = await fetch(`/api/exists/github?repo=${repoName}`);
    const json = await res.json();
    setExistsInGithub(json.exists);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    console.log("handling submit...");
    await Promise.all([searchGithub(text), searchPip(text)]);
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

          {existsInPip && <p>❌ Pip package already exists</p>}
          {existsInPip !== null && !existsInPip && (
            <p>✅Pip package name is available!</p>
          )}
        </>
      )}
    </main>
  );
}
