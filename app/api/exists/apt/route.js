import "server-only";
import { NextResponse } from "next/server";
import { promises } from "fs";
import * as path from "path";

const dir = path.resolve("./public", ".");
const aptPackagesPath = process.env.VERCEL
  ? path.join(dir, "apt-packages.txt")
  : "public/apt-packages.txt";
const packages = await promises.readFile(aptPackagesPath, "utf-8");

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const name = searchParams.get("name");
  const found = packages.includes(name);
  return NextResponse.json({ exists: found });
}
