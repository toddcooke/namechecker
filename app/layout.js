import "./globals.css";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Name Checker",
  description: "Find out if your name is taken",
};

export default function RootLayout({ children }) {
  return (
    <html className="h-full dark:bg-slate-800 " lang="en">
      <body className="h-full">{children}</body>
    </html>
  );
}
