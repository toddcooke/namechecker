import { promises } from 'fs';
import * as path from 'path';

const dir = path.resolve('./public', '.');
const aptPackagesPath = process.env.VERCEL
  ? path.join(dir, 'apt-packages.txt')
  : 'public/apt-packages.txt';
const packages = (await promises.readFile(aptPackagesPath, 'utf-8')).split(
  '\n',
);

export default async function GET(name) {
  const response = await fetch(
    `${process.env.VERCEL_URL ? 'https://' + process.env.VERCEL_URL : 'http://localhost:3000'}/apt-packages.txt`,
  );
  const text = await response.text();
  const packages = text.split('\n');
  const exists = packages.includes(name);
  return {
    exists: exists,
    existsUrl: exists && `https://packages.ubuntu.com/kinetic/${name}`,
  };
}
