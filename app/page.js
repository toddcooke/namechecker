"use client";

import Image from "next/image";
import styles from "./page.module.css";
import { useState } from "react";

export default function Home() {
  const [text, setText] = useState("");
  const [existsInGithub, setExistsInGithub] = useState(null);

  async function existsInPip(packageName) {
    const res = await fetch(`https://pypi.org/pypi/${packageName}/json`);
    return res.status === 200;
  }

  async function searchGithub(repoName) {
    const res = await fetch(`/api/exists/github?repo=${repoName}`);
    const json = await res.json();

    console.log("xxx", json);

    setExistsInGithub(json.exists);
  }

  function handleSubmit(e) {
    e.preventDefault();
    console.log("handling submit...");
    searchGithub(text);
  }

  return (
    <main className={styles.main}>
      <input
        value={text}
        type={"text"}
        onChange={(e) => setText(e.target.value)}
        onSubmit={handleSubmit}
      />

      <p>existsInGithub {existsInGithub}</p>

      <button onClick={handleSubmit}>Search</button>

      {existsInGithub && <p>GitHub repo already exists</p>}
      {existsInGithub !== null && !existsInGithub && (
        <p>GitHub repo name is available!</p>
      )}
    </main>
  );
}
