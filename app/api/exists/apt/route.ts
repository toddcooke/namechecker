import 'server-only';
import { NextRequest, NextResponse } from 'next/server';
import { promises } from 'fs';
import * as path from 'path';

const dir = path.resolve('./public', '.');
const aptPackagesPath = process.env.VERCEL
  ? path.join(dir, 'apt-packages.txt')
  : 'public/apt-packages.txt';
const packages = (await promises.readFile(aptPackagesPath, 'utf-8')).split(
  '\n',
);

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const name = searchParams.get('name');
  const exists = packages.includes(name);
  return NextResponse.json({
    name: "Apt package",
    exists: exists,
    existsUrl: exists && `https://packages.ubuntu.com/kinetic/${name}`,
  });
}
