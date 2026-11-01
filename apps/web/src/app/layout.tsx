import type { Metadata } from "next";
import "./globals.css";
import { TRPCProvider } from "@/trpc/provider";
import { ThemeProvider } from "@/components/theme-provider";
import { LanguageProvider } from "@/components/language-context";

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
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-[#F8FAFC] dark:bg-[#0B0F19] text-slate-900 dark:text-slate-100 antialiased transition-colors duration-200">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange={false}
        >
          <LanguageProvider>
            <TRPCProvider>{children}</TRPCProvider>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
