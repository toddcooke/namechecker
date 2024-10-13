import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import { promises } from 'fs';
import { topLevelDomains } from '@/app/util';

const https = require('https');

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
  const { searchParams } = new URL(request.url);
  const name = searchParams.get('name');
  // Validate input
  if (name.split('.').length - 1 > 1) {
    return NextResponse.json({
      domains: [],
      error: 'Domain name must have 0 or 1 dots',
    });
  }
  // name includes TLD, check if valid
  if (name.match(/\w+\.\w/)) {
    const tld = name.split('.')[1];
    const isTld = await isValidTLD(tld);
    if (!isTld) {
      return NextResponse.json({ domains: [], error: `Invalid TLD: .${tld}` });
    }
    return NextResponse.json({ domains: [await isDomainAvailable(name)] });
  }
  // Check availability
  const domainPromises = topLevelDomains.map((tld) =>
    isDomainAvailable(name + tld),
  );
  const domains = await Promise.all(domainPromises);
  return NextResponse.json({ domains: domains });
}

function checkSelfSignedCert(url) {
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      req.destroy();
      reject(new Error('Request timed out'));
    }, 5000); // Timeout set to 5 seconds
    const req = https.get(url, (res) => {
      clearTimeout(timeout);
      res.on('data', () => {}); // Consume response data to free up memory
      res.on('end', () => {
        resolve(false); // No error means the certificate is not self-signed
      });
    });
    req.on('error', (e) => {
      clearTimeout(timeout);
      if (e.code === 'DEPTH_ZERO_SELF_SIGNED_CERT') {
        resolve(true); // Self-signed certificate detected
      } else {
        reject(e); // Other errors
      }
    });
    req.end();
  });
}

async function isDomainAvailable(domainName) {
  let available = false;
  try {
    const url = `https://${domainName}`;
    const isSelfSigned = await checkSelfSignedCert(url);
    if (isSelfSigned) {
      return {
        domain: domainName,
        available: false,
      };
    }

    const resp = await fetch(url, {
      signal: AbortSignal.timeout(5000),
    });
    available = false;
  } catch (e) {
    if (e.name === 'AbortError') {
      available = false;
    } else {
      available = true;
    }
  }
  return {
    domain: domainName,
    available: available,
  };
}
