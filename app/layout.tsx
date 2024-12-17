import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "./(components)/Sidebar";
import SessionWrapper from "./(components)/SessionWrapper";

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
        <body className={`antialiased flex flex-col md:flex-row lg:flex-row`}>
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
