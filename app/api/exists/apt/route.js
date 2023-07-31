import "server-only";
import { NextResponse } from "next/server";
import { promises } from "fs";

// This needs to be a server-side route because fs in next.js is only available server-side
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const name = searchParams.get("name");
  const lines = await promises.readFile("public/apt-packages.txt", "utf-8");
  const found = lines.includes(name);
  console.log(found);
  return NextResponse.json({ exists: found });
}
