import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Sidebar from "./(components)/Sidebar";
import SessionWrapper from "./(components)/SessionWrapper";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Cravish",
  description: "Your Online Recipie Dictionary",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SessionWrapper>
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col md:flex-row lg:flex-row`}
        >
          <div className="relative">
            <Sidebar />
          </div>
          <div className="mt-12 mb-14 md:my-0 md:ml-56 w-full h-full">
            {children}
          </div>
        </body>
      </html>
    </SessionWrapper>
  );
}
