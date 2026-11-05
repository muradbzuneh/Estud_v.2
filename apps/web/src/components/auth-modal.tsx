"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { z } from "zod";
import {
  Mail,
  Lock,
  CheckCircle2,
  AlertCircle,
  X,
  Eye,
  EyeOff,
  ShieldCheck,
  ShieldAlert,
  UserPlus,
  ArrowRight,
  Phone,
} from "lucide-react";
import { signIn, signUp } from "@/lib/auth-client";
import { EstudLogo } from "./estud-logo";

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

// Zod Validation Schemas
const signInEmailSchema = z.object({
  email: z.string().email("Please enter a valid email address (e.g. student@aau.edu.et)"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
});

const signInPhoneSchema = z.object({
  phoneNumber: z
    .string()
    .regex(/^(\+251|0)?[97]\d{8}$/, "Enter a valid Ethiopian phone number (e.g. 0911234567)"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
});

const signUpEmailSchema = z.object({
  name: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  university: z.string().min(1, "Please select your university"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
});

const signUpPhoneSchema = z.object({
  name: z.string().min(2, "Full name must be at least 2 characters"),
  phoneNumber: z
    .string()
    .regex(/^(\+251|0)?[97]\d{8}$/, "Enter a valid Ethiopian phone number (e.g. 0911234567)"),
  university: z.string().min(1, "Please select your university"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
});

export function AuthModal({ isOpen, onClose, initialMode = "signin" }: AuthModalProps) {
  const router = useRouter();
  let searchParams: URLSearchParams | null = null;
  try {
    searchParams = useSearchParams();
  } catch {
    // If rendered outside Suspense
  }

  const callbackUrl = searchParams?.get("callbackUrl") || "";
  const adminRequired = searchParams?.get("adminRequired") === "true";

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
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [isSuccess, setIsSuccess] = useState(false);
  const [unregisteredPrompt, setUnregisteredPrompt] = useState(false);

  if (!isOpen) return null;

  const handleGoogleSignIn = async () => {
    if (isLoading) return;
    setIsLoading(true);
    setError(null);
    setFieldErrors({});

    try {
      const targetUrl = callbackUrl || window.location.origin;
      await signIn.social({
        provider: "google",
        callbackURL: targetUrl,
      });
    } catch (err: any) {
      setError(
        "Google Sign-In is unavailable or was cancelled. Please sign in or register with email/phone below."
      );
      setIsLoading(false);
    }
  };

  const validateForm = (): boolean => {
    setFieldErrors({});
    setError(null);

    try {
      if (mode === "signin") {
        if (authMethod === "email") {
          signInEmailSchema.parse({ email: email.trim(), password });
        } else {
          signInPhoneSchema.parse({ phoneNumber: phoneNumber.trim(), password });
        }
      } else {
        if (authMethod === "email") {
          signUpEmailSchema.parse({
            name: name.trim(),
            email: email.trim(),
            university,
            password,
          });
        } else {
          signUpPhoneSchema.parse({
            name: name.trim(),
            phoneNumber: phoneNumber.trim(),
            university,
            password,
          });
        }
      }
      return true;
    } catch (err) {
      if (err instanceof z.ZodError) {
        const errors: Record<string, string> = {};
        err.errors.forEach((issue) => {
          const field = issue.path[0] as string;
          if (field && !errors[field]) {
            errors[field] = issue.message;
          }
        });
        setFieldErrors(errors);
      }
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Prevent rapid duplicate requests
    if (isLoading) return;

    // Run strict client-side Zod validation before any network request
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setError(null);
    setUnregisteredPrompt(false);

    const normalizedEmail = (
      authMethod === "email"
        ? email.trim()
        : `${phoneNumber.replace(/\s+/g, "")}@student.estud.et`
    ).toLowerCase();

    const isAdminEmail =
      normalizedEmail === "murad@gmail.com" ||
      normalizedEmail === "admin@estud.et";

    try {
      if (mode === "signup") {
        await signUp.email({
          email: normalizedEmail,
          password,
          name: name.trim(),
          callbackURL: window.location.origin,
        });
        setIsSuccess(true);
      } else {
        // Sign-in mode
        if (isAdminEmail || callbackUrl.startsWith("/admin")) {
          await signIn.email({
            email: normalizedEmail,
            password,
            callbackURL: `${window.location.origin}/admin`,
          });
          onClose();
          router.push("/admin");
          return;
        }

        const destination = callbackUrl
          ? `${window.location.origin}${callbackUrl.startsWith("/") ? callbackUrl : `/${callbackUrl}`}`
          : window.location.origin;

        await signIn.email({
          email: normalizedEmail,
          password,
          callbackURL: destination,
        });

        onClose();
        if (callbackUrl && !callbackUrl.startsWith("/admin")) {
          router.push(callbackUrl as any);
        } else {
          router.refresh();
        }
      }
    } catch (err: any) {
      const rawMessage = err?.message || String(err);
      const isUnregistered =
        rawMessage.toLowerCase().includes("not found") ||
        rawMessage.toLowerCase().includes("invalid email or password") ||
        rawMessage.toLowerCase().includes("invalid credentials") ||
        rawMessage.toLowerCase().includes("user does not exist");

      if (isUnregistered && mode === "signin") {
        setUnregisteredPrompt(true);
        setError("Account not found with these credentials. Don't have an Estud account yet?");
      } else {
        setError(rawMessage || "Authentication error. Please check your credentials.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSwitchToSignup = () => {
    setMode("signup");
    setError(null);
    setFieldErrors({});
    setUnregisteredPrompt(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/65 dark:bg-black/75 p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md rounded-3xl bg-white dark:bg-twilight-900 p-6 sm:p-8 shadow-2xl border border-slate-100 dark:border-twilight-700 text-slate-900 dark:text-twilight-100">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-5 top-5 p-2 rounded-full text-slate-400 dark:text-twilight-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-twilight-800 transition cursor-pointer"
        >
          <X className="h-5 w-5" />
        </button>

        {isSuccess ? (
          <div className="text-center py-6">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/15 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 mb-4 animate-in zoom-in-75">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Welcome to Estud!</h3>
            <p className="mt-2 text-xs text-slate-600 dark:text-twilight-300 max-w-xs mx-auto leading-relaxed">
              Your student account has been created. A verification email has been sent. You can now explore verified campus listings.
            </p>
            <button
              onClick={() => {
                onClose();
                if (callbackUrl) router.push(callbackUrl as any);
              }}
              className="mt-6 w-full rounded-xl bg-brand-600 hover:bg-brand-500 py-3 text-xs font-semibold text-white shadow-md shadow-brand-600/25 transition cursor-pointer"
            >
              Continue to Marketplace
            </button>
          </div>
        ) : (
          <div>
            {/* Admin Notice */}
            {adminRequired && (
              <div className="mb-4 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 p-3 flex items-start gap-2.5 text-xs text-amber-900 dark:text-amber-200">
                <ShieldAlert className="h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400 mt-0.5" />
                <div>
                  <p className="font-bold">Staff Access Required</p>
                  <p className="text-[11px] text-amber-800 dark:text-amber-300 mt-0.5">
                    Sign in with verified administrator credentials to access the Estud Operations Portal.
                  </p>
                </div>
              </div>
            )}

            {/* Official Estud Brand Header */}
            <div className="text-center mb-5">
              <div className="flex justify-center mb-3">
                <EstudLogo size={40} showText={true} />
              </div>
              <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                {mode === "signin" ? "Sign in to your account" : "Create your student account"}
              </h2>
              <p className="text-xs text-slate-500 dark:text-twilight-400 mt-1">
                {mode === "signin"
                  ? "Enter your credentials to access your listings and orders."
                  : "Join verified students trading safely across Ethiopian campuses."}
              </p>
            </div>

            {/* Google OAuth Button */}
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-3 rounded-xl border border-slate-200 dark:border-twilight-700 bg-white dark:bg-twilight-800 py-2.5 px-4 text-xs font-semibold text-slate-700 dark:text-twilight-100 hover:bg-slate-50 dark:hover:bg-twilight-750 transition shadow-xs cursor-pointer disabled:opacity-50"
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
            <div className="relative my-4 text-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200 dark:border-twilight-700" />
              </div>
              <span className="relative bg-white dark:bg-twilight-900 px-3 text-[10px] uppercase tracking-wider text-slate-400 dark:text-twilight-400 font-semibold">
                Or with {authMethod === "email" ? "Email" : "Phone"}
              </span>
            </div>

            {/* Smart Error Box with 1-Click "Create Account" Prompt */}
            {error && (
              <div className="mb-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 p-3.5 text-xs text-rose-800 dark:text-rose-200 space-y-2">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 shrink-0 text-rose-600 dark:text-rose-400" />
                  <span className="font-medium leading-tight">{error}</span>
                </div>

                {unregisteredPrompt && (
                  <button
                    type="button"
                    onClick={handleSwitchToSignup}
                    className="w-full flex items-center justify-center gap-2 rounded-xl bg-rose-600 hover:bg-rose-500 py-2 px-3 text-[11px] font-bold text-white transition cursor-pointer"
                  >
                    <UserPlus className="h-3.5 w-3.5" />
                    <span>Create Account as {authMethod === "email" ? email || "Student" : phoneNumber}</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3">
              {mode === "signup" && (
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 dark:text-twilight-200 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      if (fieldErrors.name) setFieldErrors((prev) => ({ ...prev, name: "" }));
                    }}
                    placeholder="e.g. Alazar Tadesse"
                    className="w-full rounded-xl border border-slate-200 dark:border-twilight-700 bg-slate-50 dark:bg-twilight-800 px-3.5 py-2.5 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-brand-500 focus:bg-white dark:focus:bg-twilight-800 focus:outline-none"
                  />
                  {fieldErrors.name && (
                    <p className="text-[11px] text-rose-500 font-medium mt-1">{fieldErrors.name}</p>
                  )}
                </div>
              )}

              {/* Mode switch: Email vs Phone */}
              <div className="flex justify-between items-center text-[11px]">
                <span className="font-semibold text-slate-700 dark:text-twilight-200">
                  {authMethod === "email" ? "Student or Admin Email *" : "Ethiopian Mobile Phone *"}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setAuthMethod(authMethod === "email" ? "phone" : "email");
                    setFieldErrors({});
                    setError(null);
                  }}
                  className="text-brand-600 dark:text-brand-400 font-semibold hover:underline cursor-pointer"
                >
                  Use {authMethod === "email" ? "Phone (+251)" : "Email"} instead
                </button>
              </div>

              {authMethod === "email" ? (
                <div>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (fieldErrors.email) setFieldErrors((prev) => ({ ...prev, email: "" }));
                      }}
                      placeholder="name@aau.edu.et or murad@gmail.com"
                      className="w-full rounded-xl border border-slate-200 dark:border-twilight-700 bg-slate-50 dark:bg-twilight-800 pl-10 pr-3.5 py-2.5 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-brand-500 focus:bg-white dark:focus:bg-twilight-800 focus:outline-none"
                    />
                  </div>
                  {fieldErrors.email && (
                    <p className="text-[11px] text-rose-500 font-medium mt-1">{fieldErrors.email}</p>
                  )}
                </div>
              ) : (
                <div>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-500">
                      +251
                    </span>
                    <input
                      type="tel"
                      required
                      value={phoneNumber}
                      onChange={(e) => {
                        setPhoneNumber(e.target.value);
                        if (fieldErrors.phoneNumber)
                          setFieldErrors((prev) => ({ ...prev, phoneNumber: "" }));
                      }}
                      placeholder="911 234 567"
                      className="w-full rounded-xl border border-slate-200 dark:border-twilight-700 bg-slate-50 dark:bg-twilight-800 pl-14 pr-3.5 py-2.5 text-xs font-mono text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-brand-500 focus:bg-white dark:focus:bg-twilight-800 focus:outline-none"
                    />
                  </div>
                  {fieldErrors.phoneNumber && (
                    <p className="text-[11px] text-rose-500 font-medium mt-1">
                      {fieldErrors.phoneNumber}
                    </p>
                  )}
                </div>
              )}

              {mode === "signup" && (
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 dark:text-twilight-200 mb-1">
                    Your University *
                  </label>
                  <select
                    value={university}
                    onChange={(e) => setUniversity(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 dark:border-twilight-700 px-3.5 py-2.5 text-xs bg-slate-50 dark:bg-twilight-800 text-slate-900 dark:text-white focus:border-brand-500 focus:outline-none cursor-pointer"
                  >
                    {UNIVERSITIES.map((u) => (
                      <option key={u} value={u} className="bg-white dark:bg-twilight-900 text-slate-900 dark:text-white">
                        {u}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Password - Enforcing minimum 8 characters via Zod */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-[11px] font-semibold text-slate-700 dark:text-twilight-200">
                    Password *
                  </label>
                  <span className="text-[10px] text-slate-400">Min. 8 characters</span>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    minLength={8}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (fieldErrors.password)
                        setFieldErrors((prev) => ({ ...prev, password: "" }));
                    }}
                    placeholder="At least 8 characters"
                    className="w-full rounded-xl border border-slate-200 dark:border-twilight-700 bg-slate-50 dark:bg-twilight-800 pl-10 pr-10 py-2.5 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-brand-500 focus:bg-white dark:focus:bg-twilight-800 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-white cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {fieldErrors.password && (
                  <p className="text-[11px] text-rose-500 font-medium mt-1">{fieldErrors.password}</p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full rounded-xl bg-brand-600 hover:bg-brand-500 py-3 text-xs font-semibold text-white shadow-md shadow-brand-600/25 disabled:opacity-50 transition cursor-pointer mt-1"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Validating & Signing In...
                  </span>
                ) : mode === "signin" ? (
                  adminRequired ? "Sign In to Admin Portal" : "Sign In"
                ) : (
                  "Create Student Account"
                )}
              </button>
            </form>

            {/* Toggle sign in / sign up */}
            <div className="mt-4 text-center text-xs text-slate-500 dark:text-twilight-400">
              {mode === "signin" ? (
                <span>
                  Don't have an account yet?{" "}
                  <button
                    type="button"
                    onClick={handleSwitchToSignup}
                    className="font-bold text-brand-600 dark:text-brand-400 hover:underline cursor-pointer"
                  >
                    Sign up free
                  </button>
                </span>
              ) : (
                <span>
                  Already have an account?{" "}
                  <button
                    type="button"
                    onClick={() => {
                      setMode("signin");
                      setError(null);
                      setFieldErrors({});
                      setUnregisteredPrompt(false);
                    }}
                    className="font-bold text-brand-600 dark:text-brand-400 hover:underline cursor-pointer"
                  >
                    Log in
                  </button>
                </span>
              )}
            </div>

            {/* Security Trust Badge */}
            <div className="mt-5 flex items-center justify-center gap-1.5 text-[11px] text-slate-400 dark:text-twilight-400 border-t border-slate-100 dark:border-twilight-800 pt-3">
              <ShieldCheck className="h-3.5 w-3.5 text-brand-600 dark:text-brand-400" />
              <span>Protected by Estud Campus SafeTrade & Better Auth</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
