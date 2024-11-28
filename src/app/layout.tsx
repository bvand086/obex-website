import type { Metadata } from "next";
import { Raleway, Open_Sans, Playfair_Display } from "next/font/google";
import "./globals.css";
import "./typography.css";

const raleway = Raleway({ subsets: ["latin"], display: "swap", variable: "--font-raleway" });
const openSans = Open_Sans({ subsets: ["latin"], display: "swap", variable: "--font-open-sans" });
const playfairDisplay = Playfair_Display({ subsets: ["latin"], display: "swap", variable: "--font-playfair" });

export const metadata: Metadata = {
  metadataBase: new URL('https://OBEXCanada.com'),
  title: {
    default: "ØBEX | Natural Anti-Reflux Solutions",
    template: "%s | ØBEX Incorporated"
  },
  description: "ØBEX Incorporated provides natural, safe anti-reflux products using innovative alginate-raft technology. Discover effective heartburn relief backed by scientific research.",
  keywords: ["OBEX", "ØBEX", "heartburn relief", "acid reflux", "natural antacid", "alginate-raft technology", "reflux management", "natural heartburn solution"],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://OBEXCanada.com",
    siteName: "ØBEX Incorporated",
    title: "ØBEX | Natural Anti-Reflux Solutions",
    description: "Natural, safe anti-reflux products using innovative alginate-raft technology. Discover ØBEX for effective heartburn relief.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "ØBEX Natural Anti-Reflux Solutions"
      }
    ]
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: "https://OBEXCanada.com"
  }
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
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="theme-color" content="#2A9D8F" />
      </head>
      <body className={`${raleway.variable} ${openSans.variable} ${playfairDisplay.variable} font-sans`}>
        {children}
      </body>
    </html>
  );
}