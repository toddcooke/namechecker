import { NextResponse } from "next/server";

const whoiser = require("whoiser");

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const domainName = searchParams.get("domainName");
  const tlds = [".com", ".org", ".io", ".net", ".xyz"];
  let domains = [];
  for (let i = 0; i < tlds.length; i++) {
    if (i > 0) {
      await new Promise((r) => setTimeout(r, 1000));
    }
    const tld = tlds[i];
    let domain = await isDomainAvailable(domainName + tld);
    domains.push(domain);
  }
  console.log(domains);
  return NextResponse.json({ domains: domains });
}

async function isDomainAvailable(domainName) {
  const domainWhois = await whoiser(domainName, { follow: 1 });
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
    available:
      domainAvailability !== "reserved" && domainAvailability !== "registered",
  };
}
