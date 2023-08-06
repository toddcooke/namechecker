import { NextResponse } from "next/server";
import path from "path";
import { promises } from "fs";

const whoiser = require("whoiser");
const dir = path.resolve("./public", ".");
const aptPackagesPath = process.env.VERCEL
  ? path.join(dir, "tlds.txt")
  : "public/tlds.txt";
const lines = (await promises.readFile(aptPackagesPath, "utf-8")).split("\n");

async function isValidTLD(tld) {
  for (let i = 1; i < lines.length; i++) {
    if (lines[i] === tld.toUpperCase()) return true;
  }
  return false;
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const name = searchParams.get("name");
  if (name.split(".").length - 1 > 1) {
    return NextResponse.json({
      domains: [],
      error: "Domain name must have 0 or 1 dots",
    });
  }
  if (name.match(/\w+\.\w/)) {
    const tld = name.split(".")[1];
    const isTld = await isValidTLD(tld);
    if (!isTld) {
      return NextResponse.json({ domains: [], error: `Invalid TLD: .${tld}` });
    }
    return NextResponse.json({ domains: [await isDomainAvailable(name)] });
  }
  let domains = [];
  let tlds = [".com", ".org", ".io", ".net", ".xyz"];
  for (let i = 0; i < tlds.length; i++) {
    if (i > 0) await new Promise((r) => setTimeout(r, 1000));
    const tld = tlds[i];
    let domain = await isDomainAvailable(name + tld);
    domains.push(domain);
  }
  return NextResponse.json({ domains: domains });
}

async function isDomainAvailable(domainName) {
  const domainWhois = await whoiser(domainName, { follow: 1 });
  if (JSON.stringify(domainWhois).includes('{"Domain Status":[]')) {
    return {
      domain: domainName,
      available: true,
    };
  }
  const firstDomainWhois = whoiser.firstResult(domainWhois);
  const firstTextLine = (firstDomainWhois.text[0] || "").toLowerCase();
  let domainAvailability = "unknown";
  if (firstTextLine.includes("reserved")) {
    domainAvailability = "reserved";
  } else if (
    firstDomainWhois["Domain Name"] &&
    firstDomainWhois["Domain Name"].toLowerCase() === domainName
  ) {
    domainAvailability = "registered";
  } else if (firstTextLine.includes(`no match for "${domainName}"`)) {
    domainAvailability = "available";
  }
  return {
    domain: domainName,
    available: domainAvailability === "available",
  };
}
