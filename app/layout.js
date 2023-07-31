import "./globals.css";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Name Checker",
  description: "Find out if your name is taken",
};

export default function RootLayout({ children }) {
  return (
    // <html className="h-full">
    // <body className="h-full">
    <html className="h-full" lang="en">
      {/*<body className={inter.className}>{children}</body>*/}
      <body className="h-full">{children}</body>
    </html>
  );
}
