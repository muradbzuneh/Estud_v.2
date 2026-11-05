"use client";

import React, { Suspense } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { AuthModal } from "@/components/auth-modal";

function AuthModalWrapper() {
  const router = useRouter();
  return (
    <AuthModal
      isOpen={true}
      onClose={() => router.push("/")}
      initialMode="signin"
    />
  );
}

export default function AuthPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] dark:bg-twilight-900 text-slate-900 dark:text-twilight-100 transition-colors duration-200">
      <Navbar />
      <main className="flex-1 flex items-center justify-center p-4">
        <Suspense fallback={<div className="text-xs text-slate-400">Loading authentication...</div>}>
          <AuthModalWrapper />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
