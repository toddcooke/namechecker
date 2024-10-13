import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import { promises } from 'fs';
import { topLevelDomains } from '@/app/util';

const dir = path.resolve('./public', '.');
const aptPackagesPath = process.env.VERCEL
  ? path.join(dir, 'tlds.txt')
  : 'public/tlds.txt';
const lines = (await promises.readFile(aptPackagesPath, 'utf-8')).split('\n');

async function isValidTLD(tld) {
  for (let i = 1; i < lines.length; i++) {
    if (lines[i] === tld.toUpperCase()) return true;
  }
  return false;
}

export async function GET(request: NextRequest) {
  const startTime = new Date().getTime();
  const { searchParams } = new URL(request.url);
  const name = searchParams.get('name');
  // Validate input
  if (name.split('.').length - 1 > 1) {
    return NextResponse.json({
      domains: [],
      error: 'Domain name must have 0 or 1 dots',
    });
  }
  if (name.match(/\w+\.\w/)) {
    const tld = name.split('.')[1];
    const isTld = await isValidTLD(tld);
    if (!isTld) {
      return NextResponse.json({ domains: [], error: `Invalid TLD: .${tld}` });
    }
    return NextResponse.json({ domains: [await isDomainAvailable(name)] });
  }
  // Check availability
  let domains = [];
  for (let i = 0; i < topLevelDomains.length; i++) {
    // Return early if we are approaching 10s - Vercel limits function execution at 10s
    const nowTime = new Date().getTime();
    const secondsElapsed = (nowTime - startTime) / 1000;
    if (secondsElapsed >= 8.5) {
      return NextResponse.json({ domains: domains });
    }

    if (i > 0) await new Promise((r) => setTimeout(r, 1000));
    const tld = topLevelDomains[i];
    let domain = await isDomainAvailable(name + tld);
    domains.push(domain);
  }
  return NextResponse.json({ domains: domains });
}

async function isDomainAvailable(domainName) {
  const resp = await fetch(`https://${domainName}`);
  return {
    domain: domainName,
    available: resp.status === 404,
  };
}
