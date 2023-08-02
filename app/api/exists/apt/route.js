import "server-only";
import { NextResponse } from "next/server";
import { promises } from "fs";
import * as path from "path";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const name = searchParams.get("name");
  const dir = path.resolve("./public", ".");
  console.log(dir);
  let aptPackagesPath = process.env.VERCEL
    ? path.join(dir, "apt-packages.txt")
    : "public/apt-packages.txt";
  const lines = await promises.readFile(aptPackagesPath, "utf-8");
  const found = lines.includes(name);
  return NextResponse.json({ exists: found });
}
