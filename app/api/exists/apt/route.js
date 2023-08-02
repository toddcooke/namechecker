import "server-only";
import { NextResponse } from "next/server";
import { promises } from "fs";
import { join } from "path";
import { serverRuntimeConfig } from "@/next.config";

// This needs to be a server-side route because fs in next.js is only available server-side
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const name = searchParams.get("name");
  let aptPackagesPath = process.env.VERCEL
    ? join(serverRuntimeConfig.PROJECT_ROOT, "public/apt-packages.txt")
    : "public/apt-packages.txt";
  const lines = await promises.readFile(aptPackagesPath, "utf-8");
  const found = lines.includes(name);
  console.log(found);
  return NextResponse.json({ exists: found });
}
