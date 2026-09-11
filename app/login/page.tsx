"use client";

import { base_url } from "@/components/store/config";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useRef, useState } from "react";
import {
  FaArrowLeft,
  FaCheck,
  FaEye,
  FaEyeSlash,
  FaLock,
  FaShieldHalved,
} from "react-icons/fa6";
import { toast } from "react-toastify";

const Page = () => {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);

  const [loginDetails, setLoginDetails] = useState({
    email: "",
    password: "",
  });

  const [otpSended, setOtpSended] = useState(false);
  const [loading, setLoading] = useState(false);

  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  // --------------------------------
  // LOGIN + SEND OTP
  // --------------------------------
  const LogginAdmin = async () => {
    try {
      if (!loginDetails.email.trim()) {
        toast.warn("Please enter your email");
        return;
      }

      if (!loginDetails.password) {
        toast.warn("Please enter your password");
        return;
      }

      setLoading(true);

      const response = await axios.post(
        `${base_url}/auth/login`,
        loginDetails
      );

      const data = response.data;

      if (data.success) {
        setOtpSended(true);

        toast.success("OTP sent to your email");

        // Focus first OTP input
        setTimeout(() => {
          otpRefs.current[0]?.focus();
        }, 100);
      } else {
        toast.error(data.message || "Login failed");
      }
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  // --------------------------------
  // VERIFY OTP
  // --------------------------------
  const VerifyOtp = async () => {
    try {
      const otp = otpRefs.current
        .map((input) => input?.value || "")
        .join("");

      if (otp.length !== 6) {
        toast.warn("Please enter the 6 digit OTP");
        return;
      }

      setLoading(true);

      const response = await axios.post(
        `${base_url}/auth/verify`,
        {
          ...loginDetails,
          otp,
        },
        {
          withCredentials: true,
        }
      );

      const data = response.data;

      if (data.success) {
        toast.success("Login successful");

        router.push("/");
      } else {
        toast.error(data.message || "Invalid OTP");
      }
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || "OTP verification failed"
      );
    } finally {
      setLoading(false);
    }
  };

  // --------------------------------
  // OTP INPUT CHANGE
  // --------------------------------
  const handleOtpChange = (
    index: number,
    value: string
  ) => {
    // Only numbers
    if (!/^\d*$/.test(value)) return;

    // Keep only one digit
    value = value.slice(-1);

    if (otpRefs.current[index]) {
      otpRefs.current[index]!.value = value;
    }

    // Move next
    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  // --------------------------------
  // OTP KEYBOARD
  // --------------------------------
  const handleOtpKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace") {
      if (!otpRefs.current[index]?.value && index > 0) {
        otpRefs.current[index - 1]?.focus();
      }
    }

    if (e.key === "ArrowLeft" && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }

    if (e.key === "ArrowRight" && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }

    if (e.key === "Enter") {
      VerifyOtp();
    }
  };

  // --------------------------------
  // PASTE OTP
  // --------------------------------
  const handleOtpPaste = (
    e: React.ClipboardEvent<HTMLInputElement>
  ) => {
    e.preventDefault();

    const pastedData = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);

    pastedData.split("").forEach((digit, index) => {
      if (otpRefs.current[index]) {
        otpRefs.current[index]!.value = digit;
      }
    });

    if (pastedData.length === 6) {
      otpRefs.current[5]?.focus();
    } else {
      otpRefs.current[pastedData.length]?.focus();
    }
  };

  // --------------------------------
  // CHANGE ACCOUNT
  // --------------------------------
  const changeAccount = () => {
    setOtpSended(false);

    setTimeout(() => {
      otpRefs.current.forEach((input) => {
        if (input) input.value = "";
      });
    }, 0);
  };

  // --------------------------------
  // UI
  // --------------------------------
  return (
    <main className="min-h-screen bg-slate-950 flex items-center justify-center px-4 py-10">

      {/* Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">

        {/* Logo / Header */}
        <div className="text-center mb-8">

          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-600 shadow-lg shadow-blue-600/30">
            {otpSended ? (
              <FaShieldHalved className="text-2xl text-white" />
            ) : (
              <FaLock className="text-2xl text-white" />
            )}
          </div>

          <h1 className="text-3xl font-bold text-white">
            {otpSended
              ? "Verify your account"
              : "Welcome back"}
          </h1>

          <p className="mt-2 text-sm text-slate-400">
            {otpSended
              ? `Enter the 6-digit OTP sent to ${loginDetails.email}`
              : "Sign in to access your admin dashboard"}
          </p>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur-xl sm:p-8">

          {/* LOGIN FORM */}
          {!otpSended ? (
            <div className="space-y-5">

              {/* Email */}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Email address
                </label>

                <input
                  type="email"
                  disabled={loading}
                  placeholder="admin@example.com"
                  value={loginDetails.email}
                  onChange={(e) =>
                    setLoginDetails((prev) => ({
                      ...prev,
                      email: e.target.value,
                    }))
                  }
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      LogginAdmin();
                    }
                  }}
                  className="w-full rounded-xl border border-white/10 bg-slate-900/70 px-4 py-3.5 text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 disabled:opacity-50"
                />
              </div>

              {/* Password */}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Password
                </label>

                <div className="relative">

                  <input
                    type={showPassword ? "text" : "password"}
                    disabled={loading}
                    placeholder="Enter your password"
                    value={loginDetails.password}
                    onChange={(e) =>
                      setLoginDetails((prev) => ({
                        ...prev,
                        password: e.target.value,
                      }))
                    }
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        LogginAdmin();
                      }
                    }}
                    className="w-full rounded-xl border border-white/10 bg-slate-900/70 px-4 py-3.5 pr-12 text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 disabled:opacity-50"
                  />

                  <button
                    type="button"
                    disabled={loading}
                    onClick={() =>
                      setShowPassword((prev) => !prev)
                    }
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-white"
                  >
                    {showPassword ? (
                      <FaEyeSlash />
                    ) : (
                      <FaEye />
                    )}
                  </button>

                </div>
              </div>

              {/* Login Button */}
              <button
                type="button"
                disabled={loading}
                onClick={LogginAdmin}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3.5 font-semibold text-white transition hover:bg-blue-500 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Sending OTP...
                  </>
                ) : (
                  "Continue"
                )}
              </button>

              {/* Security text */}
              <div className="flex items-center justify-center gap-2 pt-2 text-xs text-slate-500">
                <FaLock />
                Secure admin authentication
              </div>
            </div>
          ) : (
            /* OTP FORM */
            <div className="space-y-6">

              {/* OTP boxes */}
              <div>
                <div className="flex justify-center gap-2 sm:gap-3">

                  {[0, 1, 2, 3, 4, 5].map(
                    (index) => (
                      <input
                        key={index}
                        ref={(el) => {
                          otpRefs.current[index] = el;
                        }}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        autoComplete="one-time-code"
                        disabled={loading}
                        onChange={(e) =>
                          handleOtpChange(
                            index,
                            e.target.value
                          )
                        }
                        onKeyDown={(e) =>
                          handleOtpKeyDown(index, e)
                        }
                        onPaste={handleOtpPaste}
                        className="h-12 w-11 rounded-xl border border-white/10 bg-slate-900/70 text-center text-xl font-bold text-white outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 disabled:opacity-50 sm:h-14 sm:w-12"
                      />
                    )
                  )}

                </div>

                <p className="mt-3 text-center text-xs text-slate-500">
                  Enter the 6-digit verification code
                </p>
              </div>

              {/* Verify */}
              <button
                type="button"
                disabled={loading}
                onClick={VerifyOtp}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3.5 font-semibold text-white transition hover:bg-blue-500 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Verifying...
                  </>
                ) : (
                  <>
                    <FaCheck />
                    Verify & Login
                  </>
                )}
              </button>

              {/* Change account */}
              <button
                type="button"
                disabled={loading}
                onClick={changeAccount}
                className="mx-auto flex items-center gap-2 text-sm text-slate-400 transition hover:text-white"
              >
                <FaArrowLeft className="text-xs" />
                Change account
              </button>

              {/* Security */}
              <div className="rounded-xl border border-white/5 bg-white/[0.03] p-3 text-center text-xs text-slate-500">
                OTP is valid for a limited time.
                <br />
                Never share your verification code.
              </div>

            </div>
          )}
        </div>

        {/* Footer */}
        <p className="mt-6 text-center text-xs text-slate-600">
          © {new Date().getFullYear()} Admin Portal. All rights reserved.
        </p>

</div>
 </main> ); };

export default Page;
