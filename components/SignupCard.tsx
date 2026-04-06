"use client";

import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  type FieldError,
  type RegisterOptions,
  type UseFormRegisterReturn,
  useWatch,
  useForm,
} from "react-hook-form";
import { useRouter } from "next/navigation";
import { buildApiUrl } from "@/lib/api";

type SignupFormValues = {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
};

type SignupApiResponse = {
  success: boolean;
  message: string;
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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

type FieldProps = {
  id: keyof SignupFormValues;
  label: string;
  placeholder: string;
  type?: "text" | "email" | "password";
  error?: FieldError;
  registration: UseFormRegisterReturn;
  showPasswordToggle?: boolean;
};

/**
 * This field component is still presentational only.
 * React Hook Form gives us `registration`, which contains the `ref`, `name`,
 * `onChange`, and `onBlur` handlers that connect this input to the form.
 */
function Field({
  id,
  label,
  placeholder,
  type = "text",
  error,
  registration,
  showPasswordToggle = false,
}: FieldProps) {
  const [isVisible, setIsVisible] = useState(false);
  const inputType =
    showPasswordToggle && isVisible
      ? "text"
      : type === "password"
        ? "password"
        : type;

  return (
    <div className="space-y-2">
      <label
        htmlFor={id}
        className="block text-sm font-semibold tracking-[0.01em] text-[var(--color-on-surface)]"
      >
        {label}
      </label>

      <div className="relative">
        <input
          id={id}
          type={inputType}
          placeholder={placeholder}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : undefined}
          className={`w-full rounded-2xl border bg-white px-4 py-3.5 text-sm text-[var(--color-on-surface)] outline-none transition duration-200 placeholder:text-[var(--color-secondary)] hover:border-[rgba(169,50,0,0.35)] focus:border-[var(--color-primary)] focus:ring-4 focus:ring-[rgba(169,50,0,0.18)] ${
            showPasswordToggle ? "pr-12" : ""
          } ${
            error
              ? "border-[rgba(194,65,12,0.55)]"
              : "border-[rgba(142,112,103,0.28)]"
          }`}
          {...registration}
        />

        {showPasswordToggle ? (
          <button
            type="button"
            onClick={() => setIsVisible((current) => !current)}
            className="absolute inset-y-0 right-3 inline-flex items-center justify-center text-[var(--color-secondary)] transition hover:text-[var(--color-primary)] focus:outline-none"
            aria-label={isVisible ? "Hide password" : "Show password"}
          >
            <EyeIcon open={isVisible} />
          </button>
        ) : null}
      </div>

      {error ? (
        <p id={`${id}-error`} className="text-sm font-medium text-[#c2410c]">
          {error.message}
        </p>
      ) : null}
    </div>
  );
}

/**
 * SignupCard uses React Hook Form instead of storing each input in React state.
 *
 * Beginner-friendly idea:
 * - `register(...)` connects an input to RHF.
 * - `handleSubmit(...)` runs validation first, then calls our submit function.
 * - `formState.errors` stores validation messages for each field.
 * - `watch("password")` lets us react to one field while validating another.
 *
 * This is usually more efficient than controlled inputs because RHF can keep
 * more of the form state outside normal React re-render cycles.
 */
export default function SignupCard() {
  /**
   * `useForm` creates the RHF form controller.
   *
   * `defaultValues` is the starting form data.
   * `mode: "onChange"` means errors update while the user types.
   */
  const router = useRouter();

  const {
    control,
    register,
    handleSubmit,
    trigger,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormValues>({
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    mode: "onChange",
  });

  const passwordValue = useWatch({
    control,
    name: "password",
  });

  /**
   * Confirm password depends on the password field.
   * When password changes, we re-check confirm password so the mismatch message
   * stays in sync immediately.
   */
  useEffect(() => {
    if (getValues("confirmPassword")) {
      void trigger("confirmPassword");
    }
  }, [getValues, passwordValue, trigger]);

  /**
   * RHF calls this only after all validation rules pass.
   * We keep the fake delay so the loading spinner still demonstrates submit UX.
   */
  const onSubmit = async (data: SignupFormValues): Promise<void> => {
    try {
      const payload = {
        fullName: data.fullName,
        email: data.email,
        password: data.password,
      };
      console.log(data);
      const res = await axios.post<SignupApiResponse>(
        buildApiUrl("/signup"),
        payload,
      );
      const { success, message } = res.data;

      if (success) {
        toast.success(message);
        router.push("/login");
        return;
      }

      toast.error(message);
    } catch (error) {
      toast.error("Try again later after some time");
      console.error("Signup Error:", error);
    }
  };

  const fullNameRules: RegisterOptions<SignupFormValues, "fullName"> = {
    required: "Full name is required.",
  };

  const emailRules: RegisterOptions<SignupFormValues, "email"> = {
    required: "Email is required.",
    pattern: {
      value: emailPattern,
      message: "Enter a valid email address.",
    },
  };

  const passwordRules: RegisterOptions<SignupFormValues, "password"> = {
    required: "Password is required.",
    minLength: {
      value: 8,
      message: "Password must be at least 8 characters.",
    },
  };

  const confirmPasswordRules: RegisterOptions<
    SignupFormValues,
    "confirmPassword"
  > = {
    required: "Please confirm your password.",
    validate: (value) =>
      value === getValues("password") || "Passwords do not match.",
  };

  return (
    <section className="w-full rounded-[28px] border border-white/60 bg-[rgba(255,255,255,0.92)] p-4 shadow-[0_20px_60px_rgba(66,30,17,0.12)] backdrop-blur-xl sm:p-5">
      <div className="mb-6 space-y-3">
        <div className="inline-flex items-center rounded-full border border-[rgba(169,50,0,0.12)] bg-[var(--color-surface-container-low)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-primary)]">
          SwiftStay
        </div>

        <div className="space-y-2">
          <h1 className="font-headline text-3xl font-extrabold tracking-[-0.03em] text-[var(--color-on-surface)] sm:text-[2rem]">
            Create your account
          </h1>
          <p className="text-sm leading-6 text-[var(--color-secondary)]">
            Start booking thoughtfully designed stays with a calm, streamlined
            onboarding experience.
          </p>
        </div>
      </div>

      <form
        className="flex flex-col gap-3"
        onSubmit={handleSubmit(onSubmit)}
        noValidate
      >
        <Field
          id="fullName"
          label="Full Name (Do not enter middle name)"
          placeholder="Enter your full name"
          error={errors.fullName}
          registration={register("fullName", fullNameRules)}
        />
        <Field
          id="email"
          label="Email"
          type="email"
          placeholder="name@example.com"
          error={errors.email}
          registration={register("email", emailRules)}
        />

        <Field
          id="password"
          label="Password"
          type="password"
          placeholder="Create a password"
          error={errors.password}
          registration={register("password", passwordRules)}
          showPasswordToggle
        />

        <Field
          id="confirmPassword"
          label="Confirm Password"
          type="password"
          placeholder="Re-enter your password"
          error={errors.confirmPassword}
          registration={register("confirmPassword", confirmPasswordRules)}
          showPasswordToggle
        />

        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex w-full items-center justify-center gap-3 rounded-2xl bg-[var(--color-primary)] px-4 py-3.5 text-sm font-semibold text-white shadow-[0_14px_28px_rgba(169,50,0,0.24)] transition duration-200 hover:bg-[#8a2800] hover:shadow-[0_18px_34px_rgba(169,50,0,0.28)] focus:outline-none focus:ring-4 focus:ring-[rgba(169,50,0,0.18)] disabled:cursor-not-allowed disabled:bg-[rgba(169,50,0,0.7)] disabled:shadow-none"
        >
          {isSubmitting ? <Spinner /> : null}
          <span>{isSubmitting ? "Creating Account..." : "Create Account"}</span>
        </button>
      </form>

      <p className="mt-5 text-center text-sm text-[var(--color-secondary)]">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-semibold text-[var(--color-primary)] transition hover:text-[#8a2800]"
        >
          Login
        </Link>
      </p>
    </section>
  );
}
