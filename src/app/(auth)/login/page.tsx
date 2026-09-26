"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { authClient } from "@/lib/auth-client"; // BetterAuth client import
import {
  FiMail,
  FiLock,
  FiArrowRight,
  FiEye,
  FiEyeOff,
  FiStar,
  FiCheck,
} from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";

type LoginFormData = {
  emailOrPhone: string;
  password: string;
};

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    mode: "onBlur",
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      setErrorMessage(null);
      const { error } = await authClient.signIn.email({
        email: data.emailOrPhone, 
        password: data.password,
        callbackURL: "/", 
      });

      if (error) {
        setErrorMessage(error.message || "Invalid email or password.");
        return;
      }

      router.push("/");
    } catch (error) {
      console.error("Login failed:", error);
      setErrorMessage("Something went wrong. Please try again.");
    }
  };

  // Google OAuth Login Handler
  const handleGoogleLogin = async () => {
    try {
      setErrorMessage(null);
      await authClient.signIn.social({
        provider: "google",
        callbackURL: "/",
      });
    } catch (error) {
      console.error("Google login failed:", error);
      setErrorMessage("Google login failed. Please try again.");
    }
  };

  return (
    <main className="min-h-screen bg-[#030712] text-white flex items-center justify-center px-4 py-8 relative overflow-hidden">

      <div className="absolute top-[-180px] left-[-180px] w-[420px] h-[420px] rounded-full bg-amber-500/10 blur-[120px]" />
      <div className="absolute bottom-[-180px] right-[-180px] w-[420px] h-[420px] rounded-full bg-orange-500/10 blur-[120px]" />

      <div className="relative w-full max-w-[1050px] min-h-[600px] bg-[#0b1224] border border-white/[0.08] rounded-3xl shadow-2xl overflow-hidden flex flex-col lg:flex-row">
        
        <section className="hidden lg:flex lg:w-[43%] relative p-10 xl:p-12 flex-col justify-between border-r border-white/[0.07] bg-gradient-to-br from-[#111a31] to-[#080e1d]">
          <div className="absolute -top-28 -right-28 w-72 h-72 rounded-full border border-amber-400/[0.08]" />
          <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full border border-amber-400/[0.06]" />

          <div className="relative z-10">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/20">
                <FiStar className="text-[#111827] text-xl" />
              </div>
              <div>
                <h1 className="font-bold text-lg tracking-tight">AI POSTER</h1>
                <p className="text-[9px] tracking-[0.25em] text-amber-400 font-semibold uppercase">
                  MAKER
                </p>
              </div>
            </div>
          </div>

          <div className="relative z-10 max-w-[390px]">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-amber-400/20 bg-amber-400/[0.06] mb-6">
              <FiStar className="text-amber-400 text-xs" />
              <span className="text-[11px] font-medium text-amber-400">
                Welcome Back
              </span>
            </div>

            <h2 className="text-4xl xl:text-[42px] leading-[1.12] font-bold tracking-tight">
              Continue your
              <span className="block mt-1 bg-gradient-to-r from-amber-300 to-orange-500 bg-clip-text text-transparent">
                creative journey.
              </span>
            </h2>

            <p className="mt-5 text-sm leading-7 text-slate-400 max-w-[360px]">
              Access your saved posters, manage designs, and generate new AI-powered graphics instantly.
            </p>

            <div className="mt-8 space-y-4">
              <Feature
                title="Instant Dashboard Access"
                description="Pick up right where you left off on your projects."
              />
              <Feature
                title="Saved Templates"
                description="Access all your custom designs and exported posters."
              />
            </div>
          </div>

          <p className="relative z-10 text-xs text-slate-500">
            Create • Customize • Share
          </p>
        </section>

        <section className="w-full lg:w-[57%] flex items-center justify-center px-6 py-10 sm:px-10 lg:px-12 xl:px-16">
          <div className="w-full max-w-[500px]">
            <div className="mb-7">
              <h2 className="text-3xl font-bold tracking-tight text-white">
                Sign in to your account
              </h2>
              <p className="mt-2 text-sm text-slate-400">
                Welcome back! Please enter your details.
              </p>
            </div>

            {errorMessage && (
              <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
                {errorMessage}
              </div>
            )}

            <button
              type="button"
              onClick={handleGoogleLogin}
              className="w-full h-[52px] rounded-xl bg-white hover:bg-slate-100 text-slate-900 flex items-center justify-center gap-3 font-semibold text-sm transition-all duration-200 hover:shadow-lg hover:shadow-white/5 active:scale-[0.99]"
            >
              <FcGoogle className="text-xl" />
              Continue with Google
            </button>

            <div className="flex items-center gap-4 my-6">
              <div className="h-px flex-1 bg-white/[0.08]" />
              <span className="text-[11px] uppercase tracking-wider text-slate-500 font-medium whitespace-nowrap">
                Or continue with email
              </span>
              <div className="h-px flex-1 bg-white/[0.08]" />
            </div>

            <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
              
              <div>
                <label
                  htmlFor="emailOrPhone"
                  className="flex items-center gap-2 text-sm font-semibold text-slate-300 mb-2"
                >
                  Email Address
                </label>
                <div className="relative">
                  <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-[17px] z-10" />
                  <input
                    id="emailOrPhone"
                    type="email"
                    placeholder="Enter your email"
                    autoComplete="email"
                    {...register("emailOrPhone", {
                      required: "Email is required.",
                      pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: "Enter a valid email address.",
                      },
                    })}
                    className={`w-full h-[50px] rounded-xl border bg-[#eaf1fc] text-slate-900 pl-11 pr-4 text-sm outline-none placeholder:text-slate-500 transition-all focus:ring-2 ${
                      errors.emailOrPhone
                        ? "border-red-400 focus:border-red-400 focus:ring-red-400/20"
                        : "border-slate-300 focus:border-amber-400 focus:ring-amber-400/20"
                    }`}
                  />
                </div>
                {errors.emailOrPhone && (
                  <p className="mt-1.5 text-xs text-red-400">
                    {errors.emailOrPhone.message}
                  </p>
                )}
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label
                    htmlFor="password"
                    className="text-sm font-semibold text-slate-300"
                  >
                    Password
                  </label>
                  <Link
                    href="/forgot-password"
                    className="text-xs text-amber-400 hover:text-amber-300 transition-colors"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-[17px] z-10" />
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    {...register("password", {
                      required: "Password is required.",
                      minLength: {
                        value: 6,
                        message: "Password must be at least 6 characters.",
                      },
                    })}
                    className={`w-full h-[50px] rounded-xl border bg-[#eaf1fc] text-slate-900 pl-11 pr-12 text-sm outline-none placeholder:text-slate-500 transition-all focus:ring-2 ${
                      errors.password
                        ? "border-red-400 focus:border-red-400 focus:ring-red-400/20"
                        : "border-slate-300 focus:border-amber-400 focus:ring-amber-400/20"
                    }`}
                  />
                  <button
                    type="button"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-800 transition-colors z-10"
                  >
                    {showPassword ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1.5 text-xs text-red-400">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="group w-full h-[52px] rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-slate-950 font-bold text-sm flex items-center justify-center gap-3 transition-all duration-200 shadow-lg shadow-amber-500/10 hover:shadow-amber-500/20 disabled:opacity-60 disabled:cursor-not-allowed active:scale-[0.99]"
              >
                {isSubmitting ? (
                  <>
                    <span className="w-4 h-4 border-2 border-slate-900/30 border-t-slate-900 rounded-full animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign In
                    <FiArrowRight className="text-lg group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>

            <p className="text-center text-sm text-slate-500 mt-6">
              Don't have an account?{" "}
              <Link
                href="/register"
                className="text-amber-400 hover:text-amber-300 font-semibold transition-colors"
              >
                Sign up
              </Link>
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}

function Feature({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-start gap-3.5">
      <div className="w-8 h-8 shrink-0 rounded-lg border border-amber-400/20 bg-amber-400/[0.05] flex items-center justify-center">
        <FiCheck className="text-amber-400 text-xs" />
      </div>
      <div>
        <h3 className="text-xs font-semibold text-slate-200">{title}</h3>
        <p className="mt-0.5 text-[11px] text-slate-500">{description}</p>
      </div>
    </div>
  );
}