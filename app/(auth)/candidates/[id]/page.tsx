"use client";

import { base_url, img_url } from "@/components/store/config";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  FiArrowLeft,
  FiBriefcase,
  FiCalendar,
  FiCheckCircle,
  FiClock,
  FiDownload,
  FiMail,
  FiMapPin,
  FiPhone,
  FiTrash2,
  FiUser,
  FiXCircle,
} from "react-icons/fi";

axios.defaults.withCredentials = true;

interface AppliedJob {
  _id: string;
  title: string;
  companyName: string;
  companyLogo: string | null;
  jobType: string;
  workMode: string;
  status: string;
  isFeatured: boolean;
  isUrgent: boolean;
  views: number;
  applicationsCount: number;
  createdAt: string;
}

interface UserData {
  _id: string;
  fullname: string;
  email: string;
  phone: string;
  image: string | null;
  status: boolean;
  lastLoginAt: string | null;
  gender: string | null;
  dateOfBirth: string | null;
  address: string | null;
  resume: string | null;
  jobappled: AppliedJob[];
  createdAt: string;
  updatedAt: string;
}

const Page = () => {
  const { id } = useParams();
  const router = useRouter();

  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [statusLoading, setStatusLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchUser = async () => {
    try {
      setLoading(true);

      const response = await axios.get(`${base_url}/user/get/${id}`);

      if (response.data?.success) {
        setUser(response.data.user);
      }
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || "Failed to fetch user"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchUser();
    }
  }, [id]);

  // Toggle user status
  const handleStatusToggle = async () => {
    if (!user) return;

    try {
      setStatusLoading(true);

      const newStatus = !user.status;

     
      const response = await axios.patch(
        `${base_url}/user/status/${user._id}`,
        {
          status: newStatus,
        }
      );

      if (response.data?.success) {
        setUser((prev) =>
          prev
            ? {
                ...prev,
                status: newStatus,
              }
            : prev
        );

        toast.success(
          newStatus
            ? "User activated successfully"
            : "User deactivated successfully"
        );
      }
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || "Failed to update user status"
      );
    } finally {
      setStatusLoading(false);
    }
  };

  // Delete user
  const handleDelete = async () => {
    if (!user) return;

    const confirmed = window.confirm(
      `Are you sure you want to delete ${user.fullname}? This action cannot be undone.`
    );

    if (!confirmed) return;

    try {
      setDeleteLoading(true);

      /*
       * Change this endpoint according to your backend.
       *
       * Example:
       * DELETE /user/delete/:id
       */
      const response = await axios.delete(
        `${base_url}/user/delete/${user._id}`
      );

      if (response.data?.success) {
        toast.success("User deleted successfully");
        router.push("/admin/users");
      }
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || "Failed to delete user"
      );
    } finally {
      setDeleteLoading(false);
    }
  };

  const getImageUrl = (image: string | null) => {
    if (!image) return "";

    if (image.startsWith("http")) {
      return image;
    }

    return `${img_url}${image}`;
  };

  const getResumeUrl = (resume: string | null) => {
    if (!resume) return "#";

    if (resume.startsWith("http")) {
      return resume;
    }

    return `${base_url}${resume}`;
  };

  const formatDate = (date: string | null) => {
    if (!date) return "Not provided";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatDateTime = (date: string | null) => {
    if (!date) return "Never";

    return new Date(date).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatText = (value: string | null) => {
    if (!value) return "Not provided";

    return value
      .replaceAll("_", " ")
      .toLowerCase()
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 p-6">
        <div className="mx-auto max-w-7xl animate-pulse space-y-6">
          <div className="h-10 w-48 rounded-lg bg-slate-200" />

          <div className="h-64 rounded-2xl bg-white shadow-sm" />

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="h-80 rounded-2xl bg-white" />
            <div className="h-80 rounded-2xl bg-white lg:col-span-2" />
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-[500px] items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-50">
            <FiXCircle className="text-3xl text-red-500" />
          </div>

          <h2 className="text-xl font-semibold text-slate-800">
            User not found
          </h2>

          <button
            onClick={() => router.back()}
            className="mt-5 rounded-lg bg-[#153497] px-5 py-2.5 text-sm font-medium text-white"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className=" h-screen  overflow-auto bg-slate-50 p-4 md:p-6">
      <div className="mx-auto max-w-7xl space-y-6">

        {/* ================= HEADER ================= */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.back()}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-100"
            >
              <FiArrowLeft size={19} />
            </button>

            <div>
              <h1 className="text-xl font-bold text-slate-900 md:text-2xl">
                User Details
              </h1>

              <p className="mt-0.5 text-sm text-slate-500">
                View and manage user information
              </p>
            </div>
          </div>

          <button
            onClick={handleDelete}
            disabled={deleteLoading}
            className="flex items-center justify-center gap-2 rounded-xl bg-red-500 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <FiTrash2 size={17} />

            {deleteLoading ? "Deleting..." : "Delete User"}
          </button>
        </div>

        {/* ================= PROFILE CARD ================= */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          {/* Top gradient */}
          <div className="h-28 bg-gradient-to-r from-[#40eb8d] via-[#3af09b] to-[#27fd87]" />

          <div className="px-5 pb-6 md:px-8">
            <div className="-mt-12 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
              
              {/* User */}
              <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
                <div className="h-24 w-24 shrink-0 overflow-hidden rounded-2xl border-4 border-white bg-slate-100 shadow-md">
                  {user.image ? (
                    <img
                      src={getImageUrl(user.image)}
                      alt={user.fullname}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-slate-400">
                      <FiUser size={38} />
                    </div>
                  )}
                </div>

                <div className="pb-1">
                  <h2 className="text-2xl font-bold text-slate-900">
                    {user.fullname}
                  </h2>

                  <div className="mt-1 flex flex-wrap items-center gap-3 text-sm text-slate-500">
                    <span className="flex items-center gap-1.5">
                      <FiMail />
                      {user.email}
                    </span>

                    {user.phone && (
                      <span className="flex items-center gap-1.5">
                        <FiPhone />
                        {user.phone}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Status */}
              <div className="flex items-center gap-3">
                <span
                  className={`rounded-full px-3 py-1.5 text-xs font-bold ${
                    user.status
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-red-50 text-red-700"
                  }`}
                >
                  {user.status ? "ACTIVE" : "INACTIVE"}
                </span>

                <button
                  onClick={handleStatusToggle}
                  disabled={statusLoading}
                  className={`relative h-7 w-12 rounded-full transition ${
                    user.status
                      ? "bg-emerald-500"
                      : "bg-slate-300"
                  } ${
                    statusLoading
                      ? "cursor-not-allowed opacity-60"
                      : ""
                  }`}
                  title={
                    user.status
                      ? "Deactivate user"
                      : "Activate user"
                  }
                >
                  <span
                    className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition-all ${
                      user.status ? "left-6" : "left-1"
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ================= MAIN GRID ================= */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">

          {/* ================= PERSONAL INFORMATION ================= */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-[#153497]">
                <FiUser size={19} />
              </div>

              <div>
                <h3 className="font-bold text-slate-900">
                  Personal Information
                </h3>

                <p className="text-xs text-slate-500">
                  User profile details
                </p>
              </div>
            </div>

            <div className="space-y-5">
              <InfoItem
                label="Full Name"
                value={user.fullname}
              />

              <InfoItem
                label="Email Address"
                value={user.email}
                icon={<FiMail />}
              />

              <InfoItem
                label="Phone Number"
                value={user.phone}
                icon={<FiPhone />}
              />

              <InfoItem
                label="Gender"
                value={formatText(user.gender)}
              />

              <InfoItem
                label="Date of Birth"
                value={formatDate(user.dateOfBirth)}
                icon={<FiCalendar />}
              />

              <InfoItem
                label="Address"
                value={user.address || "Not provided"}
                icon={<FiMapPin />}
              />
            </div>
          </div>

          {/* ================= ACCOUNT INFORMATION ================= */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                <FiClock size={19} />
              </div>

              <div>
                <h3 className="font-bold text-slate-900">
                  Account Information
                </h3>

                <p className="text-xs text-slate-500">
                  Account activity
                </p>
              </div>
            </div>

            <div className="space-y-5">
              <InfoItem
                label="Account Status"
                value={user.status ? "Active" : "Inactive"}
              />

              <InfoItem
                label="Last Login"
                value={formatDateTime(user.lastLoginAt)}
              />

              <InfoItem
                label="Joined On"
                value={formatDateTime(user.createdAt)}
              />

              <InfoItem
                label="Last Updated"
                value={formatDateTime(user.updatedAt)}
              />

              <div>
                <p className="mb-2 text-xs font-medium uppercase tracking-wide text-slate-400">
                  Resume
                </p>

                {user.resume ? (
                  <a
                    href={getResumeUrl(user.resume)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 p-3 transition hover:border-[#153497]/30 hover:bg-blue-50"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-50 text-red-500">
                        <FiDownload size={18} />
                      </div>

                      <div>
                        <p className="text-sm font-semibold text-slate-700">
                          Resume
                        </p>

                        <p className="text-xs text-slate-400">
                          View / Download
                        </p>
                      </div>
                    </div>

                    <FiDownload className="text-[#153497]" />
                  </a>
                ) : (
                  <div className="rounded-xl bg-slate-50 p-4 text-sm text-slate-400">
                    No resume uploaded
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ================= APPLICATION SUMMARY ================= */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
                <FiBriefcase size={19} />
              </div>

              <div>
                <h3 className="font-bold text-slate-900">
                  Application Summary
                </h3>

                <p className="text-xs text-slate-500">
                  Job application overview
                </p>
              </div>
            </div>

            <div className="rounded-2xl bg-slate-50 p-5">
              <p className="text-sm font-medium text-slate-500">
                Total Applications
              </p>

              <p className="mt-2 text-4xl font-bold text-[#153497]">
                {user.jobappled?.length || 0}
              </p>

              <p className="mt-2 text-xs text-slate-400">
                Jobs this user has applied for
              </p>
            </div>

            <div className="mt-5 space-y-3">
              <div className="flex items-center justify-between rounded-xl border border-slate-100 p-3">
                <span className="text-sm text-slate-500">
                  Featured Jobs
                </span>

                <span className="font-bold text-slate-800">
                  {
                    user.jobappled?.filter(
                      (job) => job.isFeatured
                    ).length || 0
                  }
                </span>
              </div>

              <div className="flex items-center justify-between rounded-xl border border-slate-100 p-3">
                <span className="text-sm text-slate-500">
                  Urgent Jobs
                </span>

                <span className="font-bold text-slate-800">
                  {
                    user.jobappled?.filter(
                      (job) => job.isUrgent
                    ).length || 0
                  }
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ================= APPLIED JOBS ================= */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col gap-3 border-b border-slate-200 p-5 sm:flex-row sm:items-center sm:justify-between md:p-6">
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                Applied Jobs
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Jobs applied by this user
              </p>
            </div>

            <div className="rounded-full bg-blue-50 px-3 py-1 text-sm font-semibold text-[#153497]">
              {user.jobappled?.length || 0} Applications
            </div>
          </div>

          {user.jobappled?.length > 0 ? (
            <div className="divide-y divide-slate-100">
              {user.jobappled.map((job) => (
                <div
                  key={job._id}
                  className="p-5 transition hover:bg-slate-50 md:p-6"
                >
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

                    <div className="flex items-start gap-4">
                      {/* Company Logo */}
                      <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
                        {job.companyLogo ? (
                          <img
                            src={getImageUrl(job.companyLogo)}
                            alt={job.companyName}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <FiBriefcase
                            className="text-slate-400"
                            size={22}
                          />
                        )}
                      </div>

                      <div>
                        <h4 className="font-bold text-slate-900">
                          {job.title}
                        </h4>

                        <p className="mt-1 text-sm text-slate-500">
                          {job.companyName}
                        </p>

                        <div className="mt-3 flex flex-wrap gap-2">
                          <span className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                            {formatText(job.jobType)}
                          </span>

                          <span className="rounded-lg bg-blue-50 px-2.5 py-1 text-xs font-medium text-[#153497]">
                            {formatText(job.workMode)}
                          </span>

                          {job.isFeatured && (
                            <span className="rounded-lg bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-700">
                              Featured
                            </span>
                          )}

                          {job.isUrgent && (
                            <span className="rounded-lg bg-red-50 px-2.5 py-1 text-xs font-medium text-red-600">
                              Urgent
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-5 lg:text-right">
                      <div>
                        <p className="text-xs text-slate-400">
                          Job Status
                        </p>

                        <span
                          className={`mt-1 inline-flex rounded-full px-3 py-1 text-xs font-bold ${
                            job.status === "PUBLISHED"
                              ? "bg-emerald-50 text-emerald-700"
                              : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          {formatText(job.status)}
                        </span>
                      </div>

                      <div className="hidden sm:block">
                        <p className="text-xs text-slate-400">
                          Posted
                        </p>

                        <p className="mt-1 text-sm font-semibold text-slate-700">
                          {formatDate(job.createdAt)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center px-5 py-16 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
                <FiBriefcase
                  className="text-slate-400"
                  size={26}
                />
              </div>

              <h4 className="mt-4 font-semibold text-slate-700">
                No applications
              </h4>

              <p className="mt-1 text-sm text-slate-400">
                This user has not applied for any jobs yet.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

/* ================= INFO ITEM ================= */

const InfoItem = ({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon?: React.ReactNode;
}) => {
  return (
    <div>
      <p className="mb-1 text-xs font-medium uppercase tracking-wide text-slate-400">
        {label}
      </p>

      <div className="flex items-start gap-2">
        {icon && (
          <span className="mt-0.5 text-slate-400">
            {icon}
          </span>
        )}

        <p className="break-words text-sm font-medium text-slate-700">
          {value}
        </p>
      </div>
    </div>
  );
};

export default Page;