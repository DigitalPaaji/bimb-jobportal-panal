"use client";

import { base_url } from "@/components/store/config";
import axios from "axios";
import React, { useState } from "react";
import { toast } from "react-toastify";
import {
  FiMail,
  FiLock,
  FiEye,
  FiEyeOff,
  FiShield,
  FiArrowRight,
  FiCheckCircle,
  FiRefreshCw,
} from "react-icons/fi";

axios.defaults.withCredentials = true;

const Page = () => {
  const [inputData, setInputData] = useState({
    email: "",
    password: "",
    newemail: "",
    newpassword: "",
  });

  const [otp, setOtp] = useState("");
  const [otpSend, setOtpSend] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [verifyLoading, setVerifyLoading] = useState(false);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setInputData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // STEP 1: Verify old credentials and send OTP
  const handleSubmit = async () => {
    if (!inputData.email.trim()) {
      toast.warn("Please enter your current email");
      return;
    }

    if (!inputData.password.trim()) {
      toast.warn("Please enter your current password");
      return;
    }

    if (!inputData.newemail.trim() && !inputData.newpassword.trim()) {
      toast.warn("Please enter new email or new password");
      return;
    }

    if (
      inputData.newemail.trim() &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inputData.newemail)
    ) {
      toast.warn("Please enter a valid new email");
      return;
    }

    if (inputData.newpassword && inputData.newpassword.length < 6) {
      toast.warn("New password must be at least 6 characters");
      return;
    }

    try {
      setLoading(true);

      const response = await axios.put(
        `${base_url}/auth/update-profile`,
        {
          email: inputData.email,
          password: inputData.password,
          newemail: inputData.newemail,
          newpassword: inputData.newpassword,
        }
      );

      const data = response.data;

      if (data.success) {
        toast.success(data.message || "OTP sent successfully");

        setOtpSend(true);
        setOtp("");
      } else {
        toast.error(data.message || "Unable to send OTP");
      }
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ||
          "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // STEP 2: Verify OTP and update profile
  const handleVerifyOtp = async () => {
    if (!otp.trim()) {
      toast.warn("Please enter OTP");
      return;
    }

    if (otp.length < 4) {
      toast.warn("Please enter a valid OTP");
      return;
    }

    try {
      setVerifyLoading(true);

      const response = await axios.put(
        `${base_url}/auth/verify-profile-otp`,
        {
          ...inputData,
          otp,
        }
      );

      const data = response.data;

      if (data.success) {
        toast.success(data.message || "Profile updated successfully");

        setTimeout(() => {
          window.location.reload();
        }, 800);
      } else {
        toast.error(data.message || "Invalid OTP");
      }
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ||
          "Invalid or expired OTP"
      );
    } finally {
      setVerifyLoading(false);
    }
  };

  // Resend OTP
  const handleResendOtp = async () => {
    try {
      setLoading(true);

      const response = await axios.put(
        `${base_url}/auth/update-profile`,
        {
          email: inputData.email,
          password: inputData.password,
          newemail: inputData.newemail,
          newpassword: inputData.newpassword,
        }
      );

      const data = response.data;

      if (data.success) {
        toast.success("New OTP sent successfully");
        setOtp("");
      } else {
        toast.error(data.message || "Unable to resend OTP");
      }
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ||
          "Unable to resend OTP"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen overflow-auto bg-slate-50 flex items-center justify-center px-4 ">
      <div className="w-full max-w-xl">
        {/* Card */}
        <div className="bg-white border border-slate-200 rounded-3xl shadow-xl overflow-hidden">
          
          {/* Header */}
          <div className="px-6 sm:px-8 pt-8 pb-6 border-b border-slate-100">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <FiShield size={24} />
              </div>

              <div>
                <h1 className="text-2xl font-bold text-slate-900">
                  Update Profile
                </h1>

                <p className="text-sm text-slate-500 mt-1">
                  Change your email or password securely
                </p>
              </div>
            </div>
          </div>

          {/* Progress */}
          <div className="px-6 sm:px-8 pt-6">
            <div className="flex items-center gap-3">
              
              {/* Step 1 */}
              <div
                className={`flex items-center gap-2 ${
                  !otpSend
                    ? "text-indigo-600"
                    : "text-green-600"
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    !otpSend
                      ? "bg-indigo-600 text-white"
                      : "bg-green-100 text-green-600"
                  }`}
                >
                  {otpSend ? (
                    <FiCheckCircle size={17} />
                  ) : (
                    "1"
                  )}
                </div>

                <span className="text-sm font-semibold">
                  Details
                </span>
              </div>

              <div className="flex-1 h-px bg-slate-200" />

              {/* Step 2 */}
              <div
                className={`flex items-center gap-2 ${
                  otpSend
                    ? "text-indigo-600"
                    : "text-slate-400"
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    otpSend
                      ? "bg-indigo-600 text-white"
                      : "bg-slate-100 text-slate-400"
                  }`}
                >
                  2
                </div>

                <span className="text-sm font-semibold">
                  Verify
                </span>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="p-6 sm:p-8 space-y-6">
            
            {/* Current Details */}
            {!otpSend && (
              <>
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">
                    Current account
                  </h2>

                  <p className="text-sm text-slate-500 mt-1">
                    Enter your existing login details
                  </p>
                </div>

                {/* Current Email */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Current Email
                  </label>

                  <div className="relative">
                    <FiMail
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                      size={18}
                    />

                    <input
                      type="email"
                      name="email"
                      placeholder="you@example.com"
                      value={inputData.email}
                      onChange={handleInput}
                      className="w-full h-12 pl-11 pr-4 rounded-xl border border-slate-200 bg-slate-50 outline-none transition focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                    />
                  </div>
                </div>

                {/* Current Password */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Current Password
                  </label>

                  <div className="relative">
                    <FiLock
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                      size={18}
                    />

                    <input
                      type={
                        showPassword
                          ? "text"
                          : "password"
                      }
                      name="password"
                      placeholder="Enter current password"
                      value={inputData.password}
                      onChange={handleInput}
                      className="w-full h-12 pl-11 pr-12 rounded-xl border border-slate-200 bg-slate-50 outline-none transition focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowPassword((prev) => !prev)
                      }
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                    >
                      {showPassword ? (
                        <FiEyeOff size={19} />
                      ) : (
                        <FiEye size={19} />
                      )}
                    </button>
                  </div>
                </div>

                <div className="border-t border-slate-100 pt-6">
                  <h2 className="text-lg font-semibold text-slate-900">
                    New details
                  </h2>

                  <p className="text-sm text-slate-500 mt-1">
                    Leave a field empty if you don't want to change it.
                  </p>
                </div>

                {/* New Email */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    New Email
                    <span className="text-slate-400 font-normal">
                      {" "}
                      (optional)
                    </span>
                  </label>

                  <div className="relative">
                    <FiMail
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                      size={18}
                    />

                    <input
                      type="email"
                      name="newemail"
                      placeholder="new@example.com"
                      value={inputData.newemail}
                      onChange={handleInput}
                      className="w-full h-12 pl-11 pr-4 rounded-xl border border-slate-200 bg-slate-50 outline-none transition focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                    />
                  </div>
                </div>

                {/* New Password */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    New Password
                    <span className="text-slate-400 font-normal">
                      {" "}
                      (optional)
                    </span>
                  </label>

                  <div className="relative">
                    <FiLock
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                      size={18}
                    />

                    <input
                      type={
                        showNewPassword
                          ? "text"
                          : "password"
                      }
                      name="newpassword"
                      placeholder="Enter new password"
                      value={inputData.newpassword}
                      onChange={handleInput}
                      className="w-full h-12 pl-11 pr-12 rounded-xl border border-slate-200 bg-slate-50 outline-none transition focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowNewPassword(
                          (prev) => !prev
                        )
                      }
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                    >
                      {showNewPassword ? (
                        <FiEyeOff size={19} />
                      ) : (
                        <FiEye size={19} />
                      )}
                    </button>
                  </div>
                </div>

                {/* Save */}
                <button
                  type="button"
                  disabled={loading}
                  onClick={handleSubmit}
                  className="w-full h-12 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold flex items-center justify-center gap-2 transition"
                >
                  {loading ? (
                    <>
                      <FiRefreshCw
                        className="animate-spin"
                        size={18}
                      />
                      Sending OTP...
                    </>
                  ) : (
                    <>
                      Save & Send OTP
                      <FiArrowRight size={18} />
                    </>
                  )}
                </button>
              </>
            )}

            {/* OTP STEP */}
            {otpSend && (
              <div className="space-y-6">
                <div className="text-center">
                  <div className="mx-auto w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-5">
                    <FiShield size={30} />
                  </div>

                  <h2 className="text-2xl font-bold text-slate-900">
                    Verify OTP
                  </h2>

                  <p className="text-sm text-slate-500 mt-2">
                    We sent a verification code to your
                    registered email.
                  </p>
                </div>

                {/* OTP */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2 text-center">
                    Enter 6-digit OTP
                  </label>

                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    placeholder="000000"
                    value={otp}
                    onChange={(e) =>
                      setOtp(
                        e.target.value.replace(
                          /\D/g,
                          ""
                        )
                      )
                    }
                    className="w-full h-14 text-center text-2xl tracking-[0.5em] font-bold rounded-xl border border-slate-200 bg-slate-50 outline-none focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                  />
                </div>

                {/* Verify */}
                <button
                  type="button"
                  disabled={verifyLoading}
                  onClick={handleVerifyOtp}
                  className="w-full h-12 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold flex items-center justify-center gap-2 transition"
                >
                  {verifyLoading ? (
                    <>
                      <FiRefreshCw
                        className="animate-spin"
                        size={18}
                      />
                      Verifying...
                    </>
                  ) : (
                    <>
                      <FiCheckCircle size={18} />
                      Verify & Update
                    </>
                  )}
                </button>

                {/* Resend */}
                <div className="text-center">
                  <p className="text-sm text-slate-500">
                    Didn't receive the OTP?
                  </p>

                  <button
                    type="button"
                    disabled={loading}
                    onClick={handleResendOtp}
                    className="mt-2 text-sm font-semibold text-indigo-600 hover:text-indigo-700 disabled:opacity-50"
                  >
                    {loading
                      ? "Sending..."
                      : "Resend OTP"}
                  </button>
                </div>

                {/* Back */}
                <button
                  type="button"
                  onClick={() => {
                    setOtpSend(false);
                    setOtp("");
                  }}
                  className="w-full text-sm text-slate-500 hover:text-slate-800 transition"
                >
                  ← Change details
                </button>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-6 sm:px-8 py-5 bg-slate-50 border-t border-slate-100">
            <p className="text-xs text-center text-slate-500">
              Your account changes are protected with OTP
              verification.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;