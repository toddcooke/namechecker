import "server-only";
import { NextResponse } from "next/server";
import { promises } from "fs";

// This needs to be a server-side route because fs in next.js is only available server-side
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const name = searchParams.get("name");
  let aptPackagesPath = process.env.VERCEL
    ? "../../../../public/apt-packages.txt"
    : "public/apt-packages.txt";
  const lines = await promises.readFile(aptPackagesPath, "utf-8");
  const found = lines.includes(name);
  return NextResponse.json({ exists: found });
}
