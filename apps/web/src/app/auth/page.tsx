"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { AuthModal } from "@/components/auth-modal";

export default function AuthPage() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAFA]">
      <Navbar />
      <main className="flex-1 flex items-center justify-center p-4">
        <AuthModal
          isOpen={isOpen}
          onClose={() => router.push("/")}
          initialMode="signin"
        />
      </main>
      <Footer />
    </div>
  );
}
