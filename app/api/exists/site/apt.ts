export default async function GET(name) {
  const url = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}/apt-packages.txt`
    : 'http://localhost:3000/apt-packages.txt';
  const response = await fetch(url);
  if (!response.ok) {
    return {
      exists: false,
      existsUrl: null,
      error: 'Could not fetch apt-packages.txt',
    };
  }
  const text = await response.text();
  const packages = text.split('\n');
  const exists = packages.includes(name);
  return {
    exists: exists,
    existsUrl: exists && `https://packages.ubuntu.com/kinetic/${name}`,
  };
}
