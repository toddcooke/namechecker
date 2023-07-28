// app/api/route.js

import { NextResponse } from "next/server";

export async function GET(request) {
  // Do whatever you want
  return NextResponse.json({ message: "Hello World" }, { status: 200 });
}
