import type { Metadata } from "next";
import { Raleway, Open_Sans, Playfair_Display } from "next/font/google";
import "./globals.css";
import "./typography.css";

const raleway = Raleway({ subsets: ["latin"], display: "swap", variable: "--font-raleway" });
const openSans = Open_Sans({ subsets: ["latin"], display: "swap", variable: "--font-open-sans" });
const playfairDisplay = Playfair_Display({ subsets: ["latin"], display: "swap", variable: "--font-playfair" });

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
      <body className={`${raleway.variable} ${openSans.variable} ${playfairDisplay.variable} font-sans`}>
        {children}
      </body>
    </html>
  );
}