"use client";

import { base_url, img_url } from "@/components/store/config";
import axios from "axios";
import Link from "next/link";
import { useParams } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  FiArrowLeft,
  FiBriefcase,
  FiCalendar,
  FiChevronLeft,
  FiChevronRight,
  FiClock,
  FiEye,
  FiFileText,
  FiMail,
  FiMapPin,
  FiPhone,
  FiSearch,
  FiUser,
} from "react-icons/fi";

interface User {
  _id: string;
  fullname: string;
  email: string;
  phone?: string;
  image?: string;
  gender?: string;
  dateOfBirth?: string | null;
  address?: string;
  resume?: string;
}

interface Job {
  _id: string;
  title: string;
  description?: string;
  companyName: string;
  companyLogo?: string;
  companyWebsite?: string;
  jobType: string;
  workMode: string;
  status: string;
  vacancies?: number;
  applicationsCount?: number;
}

interface Application {
  _id: string;
  userId: User;
  jobId: Job;
  resume?: string;
  coverLetter?: string;
  status: string;
  recruiterNote?: string;
  appliedAt: string;
  createdAt: string;
  updatedAt: string;
}

interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

 

const statusStyles: Record<string, string> = {
  APPLIED: "bg-blue-50 text-blue-700 border-blue-200",
  SHORTLISTED: "bg-purple-50 text-purple-700 border-purple-200",
  INTERVIEW: "bg-orange-50 text-orange-700 border-orange-200",
  SELECTED: "bg-green-50 text-green-700 border-green-200",
  REJECTED: "bg-red-50 text-red-700 border-red-200",
  WITHDRAWN: "bg-gray-100 text-gray-600 border-gray-200",
};

const formatStatus = (status: string) => {
  return status
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

const formatDate = (date?: string) => {
  if (!date) return "-";

  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const formatJobType = (value?: string) => {
  if (!value) return "-";

  return value
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

const getImageUrl = (path?: string) => {
  if (!path) return "";

  if (path.startsWith("http")) {
    return path;
  }

  return `${img_url}${path}`;
};

const Page = () => {
  const params = useParams();

  const id = Array.isArray(params?.id)
    ? params.id[0]
    : params?.id;

  const [applications, setApplications] = useState<Application[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    total: 0,
    page: 1,
    limit: 20,
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false,
  });

  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const fetchData = useCallback(
    async (page = 1) => {
      if (!id) return;

      try {
        setLoading(true);

        const response = await axios.get(
          `${base_url}/job/allapplication/${id}`,
          {
            params: {
              page,
              limit: 20,
            },
            withCredentials: true,
          }
        );

        const result = response.data;

        if (result.success) {
          setApplications(result.data || []);
          setPagination(result.pagination);
        } else {
          toast.error(result.message || "Failed to fetch applications");
        }
      } catch (error: any) {
        console.error(error);

        toast.error(
          error?.response?.data?.message ||
            "Failed to fetch applications"
        );
      } finally {
        setLoading(false);
      }
    },
    [id]
  );

  useEffect(() => {
    fetchData(1);
  }, [fetchData]);

  const filteredApplications = applications.filter((application) => {
    const user = application.userId;

    const searchText = search.toLowerCase();

    const matchesSearch =
      !search ||
      user?.fullname?.toLowerCase().includes(searchText) ||
      user?.email?.toLowerCase().includes(searchText) ||
      user?.phone?.toLowerCase().includes(searchText);

    const matchesStatus =
      statusFilter === "ALL" ||
      application.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const job = applications[0]?.jobId;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-[1600px] px-4 py-5 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <Link
                href="/jobs"
                className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50"
              >
                <FiArrowLeft size={18} />
              </Link>

              <div>
                <div className="flex items-center gap-2">
                  <FiBriefcase className="text-blue-600" />

                  <span className="text-sm font-medium text-slate-500">
                    Job Applications
                  </span>
                </div>

                <h1 className="mt-1 text-xl font-bold text-slate-900 sm:text-2xl">
                  {job?.title || "Applications"}
                </h1>

                {job && (
                  <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-slate-500">
                    <span>{job.companyName}</span>

                    <span className="text-slate-300">•</span>

                    <span>{formatJobType(job.jobType)}</span>

                    <span className="text-slate-300">•</span>

                    <span>{job.workMode}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Total */}
            <div className="flex items-center gap-3">
              <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5">
                <p className="text-xs font-medium text-slate-500">
                  Total Applications
                </p>

                <p className="mt-0.5 text-xl font-bold text-slate-900">
                  {pagination.total}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8">
        {/* Filters */}
        <div className="mb-5 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            {/* Search */}
            <div className="relative w-full lg:max-w-md">
              <FiSearch
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="text"
                placeholder="Search candidate by name, email or phone..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-11 w-full rounded-lg border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {/* Status */}
            <div className="flex flex-wrap gap-2">
              {[
                "ALL",
                "APPLIED",
                "SHORTLISTED",
                "INTERVIEW",
                "SELECTED",
                "REJECTED",
                "WITHDRAWN",
              ].map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`rounded-lg border px-3 py-2 text-xs font-semibold transition ${
                    statusFilter === status
                      ? "border-blue-600 bg-blue-600 text-white"
                      : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {status === "ALL"
                    ? "All"
                    : formatStatus(status)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Desktop Table */}
        <div className="hidden overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm lg:block">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1050px]">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Candidate
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Contact
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Status
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Applied
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Resume
                  </th>

                  <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <TableLoading />
                ) : filteredApplications.length === 0 ? (
                  <tr>
                    <td colSpan={6}>
                      <EmptyState />
                    </td>
                  </tr>
                ) : (
                  filteredApplications.map((application) => {
                    const user = application.userId;

                    return (
                      <tr
                        key={application._id}
                        className="transition hover:bg-slate-50/70"
                      >
                        {/* Candidate */}
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            {user?.image ? (
                              <img
                                src={getImageUrl(user.image)}
                                alt={user.fullname}
                                className="h-11 w-11 rounded-full border border-slate-200 object-cover"
                              />
                            ) : (
                              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                                <FiUser size={18} />
                              </div>
                            )}

                            <div className="min-w-0">
                              <Link
                                href={`/candidates/${user?._id}`}
                                className="block max-w-[220px] truncate font-semibold text-slate-900 hover:text-blue-600"
                              >
                                {user?.fullname || "Unknown User"}
                              </Link>

                              <p className="mt-0.5 text-xs text-slate-500">
                                {user?.gender
                                  ? user.gender
                                  : "Candidate"}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Contact */}
                        <td className="px-5 py-4">
                          <div className="space-y-1.5 text-sm">
                            <div className="flex items-center gap-2 text-slate-600">
                              <FiMail
                                size={14}
                                className="text-slate-400"
                              />

                              <span className="max-w-[230px] truncate">
                                {user?.email || "-"}
                              </span>
                            </div>

                            {user?.phone && (
                              <div className="flex items-center gap-2 text-slate-500">
                                <FiPhone
                                  size={14}
                                  className="text-slate-400"
                                />

                                <span>{user.phone}</span>
                              </div>
                            )}
                          </div>
                        </td>

                        {/* Status */}
                        <td className="px-5 py-4">
                          <span
                            className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${
                              statusStyles[
                                application.status
                              ] ||
                              "bg-slate-50 text-slate-600 border-slate-200"
                            }`}
                          >
                            {formatStatus(application.status)}
                          </span>
                        </td>

                        {/* Applied */}
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2 text-sm text-slate-600">
                            <FiCalendar
                              size={15}
                              className="text-slate-400"
                            />

                            {formatDate(application.appliedAt)}
                          </div>
                        </td>

                        {/* Resume */}
                        <td className="px-5 py-4">
                          {application.resume ? (
                            <a
                              href={getImageUrl(application.resume)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
                            >
                              <FiFileText size={15} />
                              View Resume
                            </a>
                          ) : (
                            <span className="text-xs text-slate-400">
                              No resume
                            </span>
                          )}
                        </td>

                        {/* Actions */}
                        <td className="px-5 py-4">
                          <div className="flex justify-end gap-2">
                            {/* Application View */}
                            <Link
                              href={`/applications/${application._id}`}
                              title="View Application"
                              className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
                            >
                              <FiEye size={17} />
                            </Link>

                            {/* User View */}
                            <Link
                              href={`/candidates/${user?._id}`}
                              title="View User"
                              className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition hover:border-purple-200 hover:bg-purple-50 hover:text-purple-600"
                            >
                              <FiUser size={17} />
                            </Link>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Mobile Cards */}
        <div className="space-y-3 lg:hidden">
          {loading ? (
            <MobileLoading />
          ) : filteredApplications.length === 0 ? (
            <EmptyState />
          ) : (
            filteredApplications.map((application) => {
              const user = application.userId;

              return (
                <div
                  key={application._id}
                  className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
                >
                  {/* User */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-3">
                      {user?.image ? (
                        <img
                          src={getImageUrl(user.image)}
                          alt={user.fullname}
                          className="h-12 w-12 shrink-0 rounded-full border border-slate-200 object-cover"
                        />
                      ) : (
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                          <FiUser size={20} />
                        </div>
                      )}

                      <div className="min-w-0">
                        <Link
                          href={`/candidates/${user?._id}`}
                          className="block truncate font-semibold text-slate-900 hover:text-blue-600"
                        >
                          {user?.fullname || "Unknown User"}
                        </Link>

                        <p className="mt-1 truncate text-xs text-slate-500">
                          {user?.email}
                        </p>
                      </div>
                    </div>

                    <span
                      className={`shrink-0 rounded-full border px-2 py-1 text-[10px] font-semibold ${
                        statusStyles[application.status] ||
                        "bg-slate-50 text-slate-600 border-slate-200"
                      }`}
                    >
                      {formatStatus(application.status)}
                    </span>
                  </div>

                  {/* Info */}
                  <div className="mt-4 grid grid-cols-2 gap-3">
                    <div className="rounded-lg bg-slate-50 p-3">
                      <div className="flex items-center gap-2 text-xs text-slate-400">
                        <FiPhone size={13} />
                        Phone
                      </div>

                      <p className="mt-1 truncate text-sm font-medium text-slate-700">
                        {user?.phone || "-"}
                      </p>
                    </div>

                    <div className="rounded-lg bg-slate-50 p-3">
                      <div className="flex items-center gap-2 text-xs text-slate-400">
                        <FiCalendar size={13} />
                        Applied
                      </div>

                      <p className="mt-1 text-sm font-medium text-slate-700">
                        {formatDate(application.appliedAt)}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="mt-4 grid grid-cols-3 gap-2">
                    <Link
                      href={`/applications/${application._id}`}
                      className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-3 py-2.5 text-xs font-semibold text-white transition hover:bg-blue-700"
                    >
                      <FiEye size={15} />
                      Application
                    </Link>

                    <Link
                      href={`/candidates/${user?._id}`}
                      className="flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
                    >
                      <FiUser size={15} />
                      User
                    </Link>

                    {application.resume ? (
                      <a
                        href={getImageUrl(application.resume)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
                      >
                        <FiFileText size={15} />
                        Resume
                      </a>
                    ) : (
                      <span className="flex items-center justify-center rounded-lg bg-slate-50 px-3 py-2.5 text-xs text-slate-400">
                        No Resume
                      </span>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Pagination */}
        {!loading && pagination.totalPages > 0 && (
          <div className="mt-5 flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-slate-500">
              Showing{" "}
              <span className="font-semibold text-slate-800">
                {applications.length}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-slate-800">
                {pagination.total}
              </span>{" "}
              applications
            </p>

            <div className="flex items-center justify-between gap-2 sm:justify-end">
              <button
                disabled={!pagination.hasPrevPage}
                onClick={() =>
                  fetchData(pagination.page - 1)
                }
                className="flex h-9 items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <FiChevronLeft />
                Previous
              </button>

              <div className="flex h-9 min-w-9 items-center justify-center rounded-lg bg-blue-600 px-3 text-sm font-semibold text-white">
                {pagination.page}
              </div>

              <button
                disabled={!pagination.hasNextPage}
                onClick={() =>
                  fetchData(pagination.page + 1)
                }
                className="flex h-9 items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next
                <FiChevronRight />
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

/* ---------------- Components ---------------- */

const TableLoading = () => {
  return (
    <>
      {[1, 2, 3, 4].map((item) => (
        <tr key={item}>
          <td colSpan={6} className="px-5 py-5">
            <div className="h-12 animate-pulse rounded-lg bg-slate-100" />
          </td>
        </tr>
      ))}
    </>
  );
};

const MobileLoading = () => {
  return (
    <>
      {[1, 2, 3].map((item) => (
        <div
          key={item}
          className="h-48 animate-pulse rounded-xl bg-white"
        />
      ))}
    </>
  );
};

const EmptyState = () => {
  return (
    <div className="flex min-h-[280px] flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white px-5 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-400">
        <FiUser size={25} />
      </div>

      <h3 className="mt-4 text-base font-semibold text-slate-800">
        No applications found
      </h3>

      <p className="mt-1 max-w-sm text-sm text-slate-500">
        There are no applications matching your current search
        or status filter.
      </p>
    </div>
  );
};

export default Page;