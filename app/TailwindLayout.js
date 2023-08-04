import { Fragment } from "react";
import styles from "./page.module.css";
import Link from "next/link";

export default function TailwindLayout({ children }) {
  return (
    <>
      <div className="min-h-full dark:bg-slate-800">
        <div className="py-10">
          <header>
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <Link href={"https://github.com/toddcooke/namechecker"}>
                <h1 className="text-3xl font-bold leading-tight tracking-tight text-center text-gray-900 dark:text-amber-100">
                  Name Checker
                </h1>
              </Link>
              <h2 className={"text-center p-1 dark:text-amber-100"}>
                Find out if your project name is taken
              </h2>
            </div>
          </header>
          <main className={styles.main}>
            <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">{children}</div>
          </main>
        </div>
      </div>
    </>
  );
}
