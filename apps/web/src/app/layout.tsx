import type { Metadata } from "next";
import "./globals.css";
import { TRPCProvider } from "@/trpc/provider";

export const metadata: Metadata = {
  title: "Estud - Student Marketplace Ethiopia",
  description: "Managed student-to-student marketplace for textbooks, gear, electronics, and educational goods in Ethiopia.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased">
        <TRPCProvider>{children}</TRPCProvider>
      </body>
    </html>
  );
}
