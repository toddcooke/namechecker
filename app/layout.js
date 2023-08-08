import './globals.css';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Name Checker',
  description: 'Find out if your project name is taken',
  authors: [{ name: 'ToddCooke', url: 'https://github.com/toddcooke' }],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://namechecker.vercel.app',
    title: 'Name Checker',
    description: 'Find out if your project name is taken',
    siteName: 'Name Checker',
  },
};

export default function RootLayout({ children }) {
  return (
    <html className="h-full" lang="en">
      <head>
        <title>Name Checker</title>
        <meta
          property="og:image"
          content="https://namechecker.vercel.app/api/og"
        />
      </head>
      <body className="h-full">{children}</body>
    </html>
  );
}
