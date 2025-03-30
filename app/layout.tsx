import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Montserrat } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "LiveDocs",
  description: "youre editor",
};

export const monts = Montserrat({
  variable: "--font-montserrat",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      appearance={{
        baseTheme: dark,
        variables : {colorPrimary : "#3371ff" , fontSize : "16px"},

      }}
    >
      <html lang="en">
        <body className={` ${geistMono.variable} antialiased`}>{children}</body>
      </html>
    </ClerkProvider>
  );
}
