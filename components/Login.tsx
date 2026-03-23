"use client";

import { useForm } from "react-hook-form";
import Image from "next/image";
import axios from "axios";
import { Plus_Jakarta_Sans } from "next/font/google";
import HomePageLogo from "@/public/login/HomeLogo.png";
import { useRouter } from "next/navigation";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

type formData = {
  email: string;
  password: string;
  remember?: boolean;
};

export default function Login() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<formData>();

  const onSubmit = async (data: formData): Promise<void> => {
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/login`,
        data,
      );
      console.log("Server Response:", res.data);
      localStorage.setItem("token", res.data.token);
      router.push("/rooms");
    } catch (error) {
      console.error("Login Error:", error);
    }
  };

  return (
    <div
      className={`${jakarta.className} flex items-center justify-center min-h-screen bg-slate-100`}
    >
      {/* Card */}
      <div className="flex flex-col w-full max-w-md p-8 bg-white shadow-xl rounded-xl gap-6">
        {/* Header */}
        <div className="flex flex-col items-center gap-2">
          <Image
            src={HomePageLogo}
            alt="SwiftStay Logo"
            width={50}
            height={50}
          />
          <h1 className="text-2xl font-bold">SwiftStay</h1>
          <p className="text-slate-500 text-sm">
            Welcome back! Please enter your details.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          {/* Email */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold">Email Address</label>

            <input
              type="email"
              placeholder="name@example.com"
              className="border px-4 py-2 rounded-md"
              {...register("email", {
                required: "Email is required",
              })}
            />

            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email.message}</p>
            )}
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold">Password</label>

            <input
              type="password"
              placeholder="••••••••"
              className="border px-4 py-2 rounded-md"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Minimum 6 characters",
                },
              })}
            />

            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password.message}</p>
            )}
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="bg-orange-500 cursor-pointer text-white py-2 rounded-md font-semibold hover:bg-orange-600"
          >
            Login
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-gray-300"></div>
            <span className="text-xs text-gray-400">OR</span>
            <div className="flex-1 h-px bg-gray-300"></div>
          </div>
        </form>

        {/* Footer */}
        {/* <p className="text-center text-sm">
          Don't have an account?{" "}
          <span className="text-orange-500 font-semibold cursor-pointer">
            Sign Up
          </span>
        </p> */}
      </div>
    </div>
  );
}
