import "server-only";
import { NextResponse } from "next/server";
import { promises } from "fs";
import { serverRuntimeConfig } from "@/next.config";
import * as path from "path";
import * as fs from "fs";

// This needs to be a server-side route because fs in next.js is only available server-side
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const name = searchParams.get("name");
  let aptPackagesPath = process.env.VERCEL
    ? "/var/task/.next/server/app/apt-packages.txt"
    : "public/apt-packages.txt";
  console.log("project root", serverRuntimeConfig.PROJECT_ROOT);
  console.log(
    "files in project root",
    fs.readdirSync(serverRuntimeConfig.PROJECT_ROOT),
  );
  console.log("pwd", __dirname);
  const lines = await promises.readFile(aptPackagesPath, "utf-8");
  const found = lines.includes(name);
  return NextResponse.json({ exists: found });
}
