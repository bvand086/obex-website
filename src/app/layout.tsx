import type { Metadata } from "next";
import { Raleway, Open_Sans, Playfair_Display } from "next/font/google";
import "./globals.css";
import "./typography.css";
import { Toaster } from "@/components/ui/toaster";

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
  },
  authors: [{ name: 'ØBEX Incorporated', url: 'https://OBEXCanada.com' }],
  creator: 'ØBEX Incorporated',
  publisher: 'ØBEX Incorporated',
  icons: {
    icon: [
      {
        url: "/favicon.ico",
        sizes: "any"
      },
      {
        url: "/new-favicon.ico",
        sizes: "any"
      }
    ],
    apple: {
      url: "/apple-touch-icon.png",
      sizes: "180x180"
    }
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
        {/* Google tag (gtag.js) */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-XVVHG56628"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-XVVHG56628');
            `
          }}
        />
        {/* Google Ads tag (gtag.js) */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=AW-16496906796"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'AW-16496906796');
            `
          }}
        />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="shortcut icon" href="/new-favicon.ico" type="image/x-icon" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" sizes="180x180" />
        <meta name="theme-color" content="#2A9D8F" />
        <meta name="contact" content="support@obexcanada.com" />
      </head>
      <body className={`${raleway.variable} ${openSans.variable} ${playfairDisplay.variable} font-sans`}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}