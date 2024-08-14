import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ØBEX Incorporated",
  description: "Natural, Safe, and Effective Anti-Reflux Products",
  icons: {
    icon: '/new-favicon.ico',
    shortcut: '/new-favicon.ico',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/new-favicon.ico" sizes="any" />
        <link rel="shortcut icon" href="/new-favicon.ico" type="image/x-icon" />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}