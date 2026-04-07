"use client";

import Link from "next/link";
import Image from "next/image";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import HomePageLogo from "@/public/login/HomeLogo.png";
import { buildApiUrl } from "@/lib/api";

type FormData = {
  email: string;
  password: string;
};

function Spinner() {
  return (
    <span
      aria-hidden="true"
      className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white"
    />
  );
}

function EyeIcon({ open }: { open: boolean }) {
  if (open) {
    return (
      <svg
        aria-hidden="true"
        className="h-5 w-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth="1.8"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3 3l18 18M10.58 10.58a2 2 0 102.83 2.83M9.88 5.09A9.77 9.77 0 0112 4.86c5.2 0 8.73 4.18 9.67 5.43a1.17 1.17 0 010 1.42 17.72 17.72 0 01-3.19 3.39M6.61 6.61A17.32 17.32 0 002.33 10.3a1.17 1.17 0 000 1.42C3.27 12.97 6.8 17.14 12 17.14c1.43 0 2.73-.31 3.9-.81"
        />
      </svg>
    );
  }

  return (
    <svg
      aria-hidden="true"
      className="h-5 w-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M2.46 12.29a1.17 1.17 0 010-.58C3.4 10.46 6.93 6.29 12.13 6.29s8.73 4.17 9.67 5.42c.13.17.2.38.2.58s-.07.41-.2.58c-.94 1.25-4.47 5.42-9.67 5.42S3.4 13.54 2.46 12.29z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12.13 15.14a3.14 3.14 0 100-6.28 3.14 3.14 0 000 6.28z"
      />
    </svg>
  );
}

export default function Login() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCheckingSession, setIsCheckingSession] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  useEffect(() => {
    let mounted = true;

    async function checkExistingSession(): Promise<void> {
      const token = localStorage.getItem("token");

      if (!token) {
        if (mounted) {
          setIsCheckingSession(false);
        }
        return;
      }

      try {
        await axios.get(buildApiUrl("/auth/me"), {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        router.replace("/rooms");
      } catch {
        localStorage.removeItem("token");
        if (mounted) {
          setIsCheckingSession(false);
        }
      }
    }

    checkExistingSession();

    return () => {
      mounted = false;
    };
  }, [router]);

  const onSubmit = async (data: FormData): Promise<void> => {
    try {
      setIsSubmitting(true);
      const res = await axios.post(buildApiUrl("/login"), data);

      localStorage.setItem("token", res.data.token);
      router.push("/rooms");
    } catch (error) {
      console.error("Login Error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isCheckingSession) {
    return (
      <section className="w-full rounded-[28px] border border-white/60 bg-[rgba(255,255,255,0.92)] p-5 shadow-[0_20px_60px_rgba(66,30,17,0.12)] backdrop-blur-xl sm:p-6">
        <div className="flex min-h-80 items-center justify-center">
          <span className="text-sm font-medium text-[var(--color-secondary)]">
            Checking your session...
          </span>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full rounded-[28px] border border-white/60 bg-[rgba(255,255,255,0.92)] p-5 shadow-[0_20px_60px_rgba(66,30,17,0.12)] backdrop-blur-xl sm:p-6">
      <div className="mb-6 flex flex-col items-center gap-3 text-center">
        <div className="inline-flex items-center rounded-full border border-[rgba(169,50,0,0.12)] bg-[var(--color-surface-container-low)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-primary)]">
          SwiftStay
        </div>

        <div className="flex flex-col items-center gap-3">
          <Image
            src={HomePageLogo}
            alt="SwiftStay Logo"
            width={58}
            height={58}
            className="h-[58px] w-[58px] rounded-2xl"
          />

          <div className="space-y-2">
            <h1 className="font-headline text-3xl font-extrabold tracking-[-0.03em] text-[var(--color-on-surface)] sm:text-[2rem]">
              Welcome back
            </h1>
            <p className="text-sm leading-6 text-[var(--color-secondary)]">
              Please enter your details to continue to SwiftStay.
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-1.5">
          <label
            htmlFor="email"
            className="block text-sm font-semibold tracking-[0.01em] text-[var(--color-on-surface)]"
          >
            Email Address
          </label>

          <input
            id="email"
            type="email"
            placeholder="name@example.com"
            className={`w-full rounded-2xl border bg-white px-4 py-3.5 text-sm text-[var(--color-on-surface)] outline-none transition duration-200 placeholder:text-[var(--color-secondary)] hover:border-[rgba(169,50,0,0.35)] focus:border-[var(--color-primary)] focus:ring-4 focus:ring-[rgba(169,50,0,0.18)] ${
              errors.email
                ? "border-[rgba(194,65,12,0.55)]"
                : "border-[rgba(142,112,103,0.28)]"
            }`}
            {...register("email", {
              required: "Email is required",
            })}
          />

          {errors.email ? (
            <p className="text-sm font-medium text-[#c2410c]">
              {errors.email.message}
            </p>
          ) : null}
        </div>

        <div className="space-y-1.5">
          <label
            htmlFor="password"
            className="block text-sm font-semibold tracking-[0.01em] text-[var(--color-on-surface)]"
          >
            Password
          </label>

          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              className={`w-full rounded-2xl border bg-white px-4 py-3.5 pr-12 text-sm text-[var(--color-on-surface)] outline-none transition duration-200 placeholder:text-[var(--color-secondary)] hover:border-[rgba(169,50,0,0.35)] focus:border-[var(--color-primary)] focus:ring-4 focus:ring-[rgba(169,50,0,0.18)] ${
                errors.password
                  ? "border-[rgba(194,65,12,0.55)]"
                  : "border-[rgba(142,112,103,0.28)]"
              }`}
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Minimum 6 characters",
                },
              })}
            />

            <button
              type="button"
              onClick={() => setShowPassword((current) => !current)}
              className="absolute inset-y-0 right-3 inline-flex items-center justify-center text-[var(--color-secondary)] transition hover:text-[var(--color-primary)] focus:outline-none"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              <EyeIcon open={showPassword} />
            </button>
          </div>

          {errors.password ? (
            <p className="text-sm font-medium text-[#c2410c]">
              {errors.password.message}
            </p>
          ) : null}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex w-full items-center justify-center gap-3 rounded-2xl bg-[var(--color-primary)] px-4 py-3.5 text-sm font-semibold text-white shadow-[0_14px_28px_rgba(169,50,0,0.24)] transition duration-200 hover:bg-[#8a2800] hover:shadow-[0_18px_34px_rgba(169,50,0,0.28)] focus:outline-none focus:ring-4 focus:ring-[rgba(169,50,0,0.18)] disabled:cursor-not-allowed disabled:bg-[rgba(169,50,0,0.7)] disabled:shadow-none"
        >
          {isSubmitting ? <Spinner /> : null}
          <span>{isSubmitting ? "Logging In..." : "Login"}</span>
        </button>
      </form>

      <p className="mt-5 text-center text-sm text-[var(--color-secondary)]">
        Don&apos;t have an account?{" "}
        <Link
          href="/signup"
          className="font-semibold text-[var(--color-primary)] transition hover:text-[#8a2800]"
        >
          Sign Up
        </Link>
      </p>
    </section>
  );
}
