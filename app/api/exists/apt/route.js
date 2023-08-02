import "server-only";
import { NextResponse } from "next/server";
import { promises } from "fs";
import * as path from "path";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const name = searchParams.get("name");
  let aptPackagesPath = process.env.VERCEL
    ? "/apt-packages.txt"
    : "public/apt-packages.txt";
  const lines = await promises.readFile(aptPackagesPath, "utf-8");
  const found = lines.includes(name);
  return NextResponse.json({ exists: found });
}
