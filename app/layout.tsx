"use client";
import "./globals.css";
import Sidebar from "./(components)/Sidebar";
import SessionWrapper from "./(components)/SessionWrapper";
import { AppWrapper } from "./context";

// import type { Metadata } from "next";
// export const metadata: Metadata = {
//   title: "Cravish",
//   description: "Your Online Recipie Dictionary",
// };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SessionWrapper>
      <AppWrapper>
        <html lang="en">
          <head>
            <title>Cravish</title>
            <meta name="description" content="Your Online Recipie Dictionary" />
          </head>
          <body className={`antialiased flex flex-col md:flex-row lg:flex-row`}>
            <div className="relative">
              <Sidebar />
            </div>
            <div className="mt-12 mb-14 md:my-0 md:ml-56 w-full h-full">
              {children}
            </div>
          </body>
        </html>
      </AppWrapper>
    </SessionWrapper>
  );
}
