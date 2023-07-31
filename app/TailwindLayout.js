import { Fragment } from "react";

export default function TailwindLayout({ children }) {
  return (
    <>
      <div className="min-h-full">
        <div className="py-10">
          <header>
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <h1 className="text-3xl font-bold leading-tight tracking-tight text-center text-gray-900">
                Name Checker
              </h1>
              <h3 className={"text-center p-1"}>
                Find out if your name is taken
              </h3>
            </div>
          </header>
          <main>
            <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
              {/* Your content */}
              {children}
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
