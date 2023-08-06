import { NextResponse } from "next/server";

const whoiser = require("whoiser");

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const name = searchParams.get("name");
  let tlds = [".com", ".org", ".io", ".net", ".xyz"];
  try {
    const dotCount = name.split(".").length - 1;
    if (dotCount === 1) {
      new URL("https://" + name);
      return NextResponse.json({ domains: [await isDomainAvailable(name)] });
    } else if (dotCount > 1) {
      return NextResponse.json({ domains: [] });
    }
  } catch (e) {
    console.log(e);
    return NextResponse.json({ domains: [] });
  }

  let domains = [];
  for (let i = 0; i < tlds.length; i++) {
    if (i > 0) {
      await new Promise((r) => setTimeout(r, 1000));
    }
    const tld = tlds[i];
    let domain = await isDomainAvailable(name + tld);
    domains.push(domain);
  }
  return NextResponse.json({ domains: domains });
}

async function isDomainAvailable(domainName) {
  const domainWhois = await whoiser(domainName, { follow: 2 });
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
