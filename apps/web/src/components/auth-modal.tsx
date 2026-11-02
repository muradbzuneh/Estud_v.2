"use client";

import React, { useState } from "react";
import {
  GraduationCap,
  Mail,
  Lock,
  CheckCircle2,
  AlertCircle,
  X,
  Eye,
  EyeOff,
  ShieldCheck,
} from "lucide-react";
import { signIn, signUp } from "@/lib/auth-client";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: "signin" | "signup";
}

const UNIVERSITIES = [
  "Addis Ababa University (AAU)",
  "Adama Science & Technology University (ASTU)",
  "Hawassa University",
  "Jimma University",
  "Mekelle University",
  "Bahir Dar University",
  "Wollo University (KIOT)",
  "Arba Minch University",
];

export function AuthModal({ isOpen, onClose, initialMode = "signin" }: AuthModalProps) {
  const [mode, setMode] = useState<"signin" | "signup">(initialMode);
  const [authMethod, setAuthMethod] = useState<"email" | "phone">("email");
  const [showPassword, setShowPassword] = useState(false);

  // Form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [university, setUniversity] = useState(UNIVERSITIES[0]);
  const [password, setPassword] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await signIn.social({
        provider: "google",
        callbackURL: window.location.origin,
      });
    } catch (err: any) {
      setError(err?.message || "Google Sign-In failed. Please try again.");
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      if (mode === "signup") {
        await signUp.email({
          email: authMethod === "email" ? email : `${phoneNumber.replace(/\s+/g, "")}@student.estud.et`,
          password,
          name,
          callbackURL: window.location.origin,
        });
        setIsSuccess(true);
      } else {
        await signIn.email({
          email: authMethod === "email" ? email : `${phoneNumber.replace(/\s+/g, "")}@student.estud.et`,
          password,
          callbackURL: window.location.origin,
        });
        onClose();
      }
    } catch (err: any) {
      setError(err?.message || "Authentication error. Please check credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 dark:bg-black/70 p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md rounded-2xl bg-white dark:bg-twilight-800 p-6 sm:p-8 shadow-2xl border border-slate-100 dark:border-twilight-700 text-slate-900 dark:text-twilight-100">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-5 top-5 p-2 rounded-full text-slate-400 dark:text-twilight-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-twilight-750 transition-colors cursor-pointer"
        >
          <X className="h-5 w-5" />
        </button>

        {isSuccess ? (
          <div className="text-center py-6">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-brand-50 dark:bg-twilight-750 text-brand-600 dark:text-brand-400 mb-4 animate-in zoom-in-75">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Welcome to Estud!</h3>
            <p className="mt-2 text-xs text-slate-600 dark:text-twilight-300 max-w-xs mx-auto">
              Your student account has been created. A confirmation link has been sent to verify your student status.
            </p>
            <button
              onClick={onClose}
              className="mt-6 w-full rounded-xl bg-brand-600 py-3 text-sm font-semibold text-white hover:bg-brand-700 transition cursor-pointer"
            >
              Continue to Marketplace
            </button>
          </div>
        ) : (
          <div>
            {/* Header matching Image 2 */}
            <div className="text-center mb-6">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-50 dark:bg-twilight-750 text-brand-600 dark:text-brand-400 mb-3 shadow-inner">
                <GraduationCap className="h-6 w-6" />
              </div>
              <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                {mode === "signin" ? "Sign in to Estud" : "Create an account"}
              </h2>
              <p className="text-xs text-slate-500 dark:text-twilight-400 mt-1">
                {mode === "signin" ? "Welcome back! Please enter your details." : "Join thousands of students trading securely across Ethiopia"}
              </p>
            </div>

            {/* Google OAuth Button */}
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-3 rounded-xl border border-slate-200 dark:border-twilight-700 bg-white dark:bg-twilight-750 py-2.5 px-4 text-xs font-semibold text-slate-700 dark:text-twilight-100 hover:bg-slate-50 dark:hover:bg-twilight-700 transition shadow-xs cursor-pointer"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  fill="#EA4335"
                />
              </svg>
              Continue with Google
            </button>

            {/* Separator */}
            <div className="relative my-5 text-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200 dark:border-twilight-700" />
              </div>
              <span className="relative bg-white dark:bg-twilight-800 px-3 text-[11px] uppercase tracking-wider text-slate-400 dark:text-twilight-400 font-medium">
                Or with {authMethod === "email" ? "Email" : "Phone"}
              </span>
            </div>

            {error && (
              <div className="mb-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 p-3 flex items-center gap-2 text-xs text-rose-800 dark:text-rose-200">
                <AlertCircle className="h-4 w-4 shrink-0 text-rose-600 dark:text-rose-400" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3.5">
              {mode === "signup" && (
                <div>
                  <label className="block text-[11px] font-medium uppercase tracking-wider text-slate-600 dark:text-twilight-300 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Alazar Tadesse"
                    className="w-full rounded-xl border border-slate-200 dark:border-twilight-700 bg-slate-50 dark:bg-twilight-750 px-3.5 py-2.5 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-twilight-400 focus:border-brand-500 focus:bg-white dark:focus:bg-twilight-750 focus:outline-none focus:ring-1 focus:ring-brand-500 transition"
                  />
                </div>
              )}

              {/* Mode switch: Email vs Phone */}
              <div className="flex justify-between items-center text-[11px]">
                <span className="font-medium uppercase tracking-wider text-slate-600 dark:text-twilight-300">
                  {authMethod === "email" ? "Student Email" : "Ethiopian Mobile Phone"}
                </span>
                <button
                  type="button"
                  onClick={() => setAuthMethod(authMethod === "email" ? "phone" : "email")}
                  className="text-brand-600 dark:text-brand-400 font-semibold hover:underline cursor-pointer"
                >
                  Use {authMethod === "email" ? "Phone (+251)" : "Email"} instead
                </button>
              </div>

              {authMethod === "email" ? (
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 dark:text-twilight-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@aau.edu.et or personal@gmail.com"
                    className="w-full rounded-xl border border-slate-200 dark:border-twilight-700 bg-slate-50 dark:bg-twilight-750 pl-10 pr-3.5 py-2.5 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-twilight-400 focus:border-brand-500 focus:bg-white dark:focus:bg-twilight-750 focus:outline-none focus:ring-1 focus:ring-brand-500 transition"
                  />
                </div>
              ) : (
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-500 dark:text-twilight-400">
                    +251
                  </span>
                  <input
                    type="tel"
                    required
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="911 234 567"
                    className="w-full rounded-xl border border-slate-200 dark:border-twilight-700 bg-slate-50 dark:bg-twilight-750 pl-14 pr-3.5 py-2.5 text-xs font-mono text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-twilight-400 focus:border-brand-500 focus:bg-white dark:focus:bg-twilight-750 focus:outline-none focus:ring-1 focus:ring-brand-500 transition"
                  />
                </div>
              )}

              {mode === "signup" && (
                <div>
                  <label className="block text-[11px] font-medium uppercase tracking-wider text-slate-600 dark:text-twilight-300 mb-1">
                    Your University
                  </label>
                  <select
                    value={university}
                    onChange={(e) => setUniversity(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 dark:border-twilight-700 px-3.5 py-2.5 text-xs bg-slate-50 dark:bg-twilight-750 text-slate-900 dark:text-white focus:border-brand-500 focus:bg-white dark:focus:bg-twilight-750 focus:outline-none focus:ring-1 focus:ring-brand-500 transition cursor-pointer"
                  >
                    {UNIVERSITIES.map((u) => (
                      <option key={u} value={u} className="bg-white dark:bg-twilight-800 text-slate-900 dark:text-white">
                        {u}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Password */}
              <div>
                <label className="block text-[11px] font-medium uppercase tracking-wider text-slate-600 dark:text-twilight-300 mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 dark:text-twilight-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="At least 8 characters"
                    className="w-full rounded-xl border border-slate-200 dark:border-twilight-700 bg-slate-50 dark:bg-twilight-750 pl-10 pr-10 py-2.5 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-twilight-400 focus:border-brand-500 focus:bg-white dark:focus:bg-twilight-750 focus:outline-none focus:ring-1 focus:ring-brand-500 transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-twilight-400 hover:text-slate-600 dark:hover:text-white cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Submit Button - Royal Violet-Indigo from Image 2 */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full rounded-xl bg-brand-600 hover:bg-brand-700 py-3 text-xs font-semibold text-white shadow-xs disabled:opacity-50 transition cursor-pointer mt-2"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Processing...
                  </span>
                ) : mode === "signin" ? (
                  "Sign In"
                ) : (
                  "Create account"
                )}
              </button>
            </form>

            {/* Toggle sign in / sign up matching Image 2 */}
            <div className="mt-5 text-center text-xs text-slate-500 dark:text-twilight-400">
              {mode === "signin" ? (
                <span>
                  Don't have an account yet?{" "}
                  <button
                    type="button"
                    onClick={() => setMode("signup")}
                    className="font-semibold text-brand-600 dark:text-brand-400 hover:underline cursor-pointer"
                  >
                    Sign up free
                  </button>
                </span>
              ) : (
                <span>
                  Already have an account?{" "}
                  <button
                    type="button"
                    onClick={() => setMode("signin")}
                    className="font-semibold text-brand-600 dark:text-brand-400 hover:underline cursor-pointer"
                  >
                    Log in
                  </button>
                </span>
              )}
            </div>

            {/* Trust badge */}
            <div className="mt-6 flex items-center justify-center gap-1.5 text-[11px] text-slate-400 dark:text-twilight-400 border-t border-slate-100 dark:border-twilight-700 pt-4">
              <ShieldCheck className="h-3.5 w-3.5 text-brand-600 dark:text-brand-400" />
              <span>Protected by Better Auth & Estud Student Escrow</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
