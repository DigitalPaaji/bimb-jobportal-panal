"use client";

import { base_url, img_url } from "@/components/store/config";
import axios from "axios";
import { useSearchParams, useRouter } from "next/navigation";
import React, { Suspense, useEffect, useState } from "react";
import { toast } from "react-toastify";

import {
  FiBriefcase,
  FiCalendar,
  FiChevronLeft,
  FiChevronRight,
  FiClock,
  FiDownload,
  FiFileText,
  FiFilter,
  FiMail,
  FiPhone,
  FiSearch,
  FiUser,
  FiX,
} from "react-icons/fi";
import Link from "next/link";
import { PiEyeDuotone } from "react-icons/pi";

axios.defaults.withCredentials = true;

type Application = {
  _id: string;

  userId: {
    _id: string;
    fullname: string;
    email: string;
    phone: string;
    image?: string | null;
    resume?: string | null;
  };

  jobId: {
    _id: string;
    title: string;
    companyName: string;
    companyLogo?: string | null;
    jobType: string;
    workMode: string;
    status: string;
  };

  resume?: string | null;
  coverLetter?: string;
  answers?: any[];

  status: string;
  appliedAt: string;
  createdAt: string;
  updatedAt: string;
};

type Pagination = {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
};

const Page = () => {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-50 flex items-center justify-center">
          <div className="flex items-center gap-3 text-slate-500">
            <div className="w-5 h-5 border-2 border-slate-300 border-t-slate-800 rounded-full animate-spin" />
            Loading applications...
          </div>
        </div>
      }
    >
      <Applications />
    </Suspense>
  );
};

export default Page;

const Applications = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentPage = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 20;
  const typeapp = searchParams.get("typeapp") || "week";

  const [applications, setApplications] = useState<Application[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);

  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchApplication = async () => {
    setLoading(true);

    try {
      const params = new URLSearchParams();

      params.set("page", currentPage.toString());
      params.set("limit", limit.toString());
      params.set("typeapp", typeapp);

      const response = await axios.get(
        `${base_url}/job/application?${params.toString()}`
      );

      const result = response.data;

      setApplications(result.data || []);
      setPagination(result.pagination || null);
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || "Failed to fetch applications"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplication();
  }, [currentPage, limit, typeapp]);

  const changeFilter = (filter: string) => {
    const params = new URLSearchParams(searchParams.toString());

    params.set("typeapp", filter);
    params.set("page", "1");

    router.push(`?${params.toString()}`);
  };

  const changePage = (page: number) => {
    if (page < 1) return;
    if (pagination && page > pagination.totalPages) return;

    const params = new URLSearchParams(searchParams.toString());

    params.set("page", page.toString());

    router.push(`?${params.toString()}`);
  };

  const filteredApplications = applications.filter((application) => {
    const searchText = search.toLowerCase();

    return (
      application.userId?.fullname?.toLowerCase().includes(searchText) ||
      application.userId?.email?.toLowerCase().includes(searchText) ||
      application.jobId?.title?.toLowerCase().includes(searchText) ||
      application.jobId?.companyName?.toLowerCase().includes(searchText)
    );
  });

  const filterOptions = [
    {
      value: "today",
      label: "Today",
    },
    {
      value: "week",
      label: "This Week",
    },
    {
      value: "month",
      label: "This Month",
    },
    {
      value: "all",
      label: "All Applications",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-6 lg:p-8">
      <div className="max-w-[1600px] mx-auto">

        {/* HEADER */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 mb-7">

          <div>
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-sm">
                <FiFileText size={21} />
              </div>

              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
                  Applications
                </h1>

                <p className="text-sm text-slate-500 mt-1">
                  Manage and review job applications
                </p>
              </div>
            </div>
          </div>

          {/* TOTAL */}
          <div className="bg-white border border-slate-200 rounded-xl px-5 py-3 flex items-center gap-4 shadow-sm">
            <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <FiUser size={19} />
            </div>

            <div>
              <p className="text-xs text-slate-500">
                {typeapp === "all"
                  ? "Total Applications"
                  : `${filterOptions.find(
                      (item) => item.value === typeapp
                    )?.label || "Applications"}`}
              </p>

              <p className="text-xl font-bold text-slate-900">
                {pagination?.total ?? applications.length}
              </p>
            </div>
          </div>
        </div>

        {/* FILTER / SEARCH */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 mb-6 shadow-sm">

          <div className="flex flex-col xl:flex-row xl:items-center gap-4">

            {/* SEARCH */}
            <div className="relative flex-1">
              <FiSearch
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                size={18}
              />

              <input
                type="text"
                placeholder="Search applicant, email, job or company..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full h-11 pl-11 pr-10 rounded-xl border border-slate-200 bg-slate-50 text-sm outline-none focus:border-slate-400 focus:bg-white transition"
              />

              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                >
                  <FiX />
                </button>
              )}
            </div>

            {/* FILTER */}
            <div className="flex items-center gap-2 overflow-x-auto">
              <div className="hidden sm:flex w-10 h-10 rounded-lg bg-slate-100 items-center justify-center text-slate-500 shrink-0">
                <FiFilter size={17} />
              </div>

              {filterOptions.map((filter) => (
                <button
                  key={filter.value}
                  onClick={() => changeFilter(filter.value)}
                  className={`
                    h-10 px-4 rounded-lg text-sm font-medium whitespace-nowrap
                    transition-all border
                    ${
                      typeapp === filter.value
                        ? "bg-slate-900 text-white border-slate-900 shadow-sm"
                        : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                    }
                  `}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* APPLICATIONS */}
        {loading ? (
          <LoadingSkeleton />
        ) : filteredApplications.length === 0 ? (
          <EmptyState search={search} />
        ) : (
          <div className="space-y-4">

            {filteredApplications.map((application) => (
              <ApplicationCard
                key={application._id}
                application={application}
              />
            ))}

          </div>
        )}

        {/* PAGINATION */}
        {!loading && pagination && pagination.totalPages > 1 && (
          <div className="mt-7 bg-white border border-slate-200 rounded-xl px-4 py-3 flex flex-col sm:flex-row items-center justify-between gap-3">

            <p className="text-sm text-slate-500">
              Page{" "}
              <span className="font-semibold text-slate-800">
                {pagination.page}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-slate-800">
                {pagination.totalPages}
              </span>
            </p>

            <div className="flex items-center gap-2">

              <button
                disabled={!pagination.hasPrevPage}
                onClick={() => changePage(currentPage - 1)}
                className="w-9 h-9 rounded-lg border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <FiChevronLeft />
              </button>

              {Array.from(
                { length: pagination.totalPages },
                (_, index) => index + 1
              )
                .filter((page) => {
                  return (
                    page === 1 ||
                    page === pagination.totalPages ||
                    Math.abs(page - currentPage) <= 1
                  );
                })
                .map((page, index, arr) => (
                  <React.Fragment key={page}>

                    {index > 0 && arr[index - 1] !== page - 1 && (
                      <span className="px-1 text-slate-400">
                        ...
                      </span>
                    )}

                    <button
                      onClick={() => changePage(page)}
                      className={`
                        w-9 h-9 rounded-lg text-sm font-medium
                        ${
                          page === currentPage
                            ? "bg-slate-900 text-white"
                            : "border border-slate-200 text-slate-600 hover:bg-slate-50"
                        }
                      `}
                    >
                      {page}
                    </button>

                  </React.Fragment>
                ))}

              <button
                disabled={!pagination.hasNextPage}
                onClick={() => changePage(currentPage + 1)}
                className="w-9 h-9 rounded-lg border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <FiChevronRight />
              </button>

            </div>
          </div>
        )}
      </div>
    </div>
  );
};


/* =========================================================
   APPLICATION CARD
========================================================= */

const ApplicationCard = ({
  application,
}: {
  application: Application;
}) => {
  const applicant = application.userId;
  const job = application.jobId;

  const appliedDate = new Date(application.appliedAt);

  const formattedDate = appliedDate.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  const formattedTime = appliedDate.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-md transition-shadow overflow-hidden">

      <div className="p-5">

        {/* TOP */}
        <div className="flex flex-col xl:flex-row xl:items-center gap-5">

          {/* APPLICANT */}
          <div className="flex items-center gap-4 min-w-[280px] xl:w-[28%]">

            {applicant?.image ? (
              <img
                src={`${img_url}${applicant.image}`}
                alt={applicant.fullname}
                className="w-14 h-14 rounded-full object-cover border border-slate-200"
              />
            ) : (
              <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                <FiUser size={24} />
              </div>
            )}

            <div className="min-w-0">
              <h3 className="font-semibold text-slate-900 truncate">
                {applicant?.fullname || "Unknown Applicant"}
              </h3>

              <div className="flex items-center gap-2 text-sm text-slate-500 mt-1">
                <FiMail size={14} />
                <span className="truncate">
                  {applicant?.email || "No email"}
                </span>
              </div>

              {applicant?.phone && (
                <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
                  <FiPhone size={13} />
                  {applicant.phone}
                </div>
              )}
            </div>

          </div>

          {/* DIVIDER */}
          <div className="hidden xl:block w-px h-14 bg-slate-200" />

          {/* JOB */}
          <div className="flex-1 min-w-0">

            <div className="flex items-start gap-3">

              {job?.companyLogo ? (
                <img
                  src={`${img_url}${job.companyLogo}`}
                  alt={job.companyName}
                  className="w-11 h-11 rounded-lg object-contain border border-slate-200 bg-white p-1"
                />
              ) : (
                <div className="w-11 h-11 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500">
                  <FiBriefcase size={19} />
                </div>
              )}

              <div className="min-w-0">

                <h3 className="font-semibold text-slate-900 truncate">
                  {job?.title || "Unknown Job"}
                </h3>

                <p className="text-sm text-slate-500 mt-1 truncate">
                  {job?.companyName || "Unknown Company"}
                </p>

                <div className="flex flex-wrap gap-2 mt-2">

                  <span className="text-xs font-medium px-2.5 py-1 rounded-md bg-blue-50 text-blue-700">
                    {formatLabel(job?.jobType)}
                  </span>

                  <span className="text-xs font-medium px-2.5 py-1 rounded-md bg-purple-50 text-purple-700">
                    {formatLabel(job?.workMode)}
                  </span>

                </div>

              </div>
            </div>
          </div>

          {/* DATE */}
          <div className="xl:w-[150px] shrink-0">

            <div className="flex items-center gap-2 text-sm text-slate-700">
              <FiCalendar className="text-slate-400" />
              <span>{formattedDate}</span>
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
              <FiClock />
              <span>{formattedTime}</span>
            </div>

          </div>

          {/* STATUS */}
          <div className="shrink-0">
            <StatusBadge status={application.status} />
          </div>

        </div>

        {/* BOTTOM */}
        <div className="mt-5 pt-4 border-t border-slate-100 flex flex-col md:flex-row md:items-center md:justify-between gap-3">

          <div className="flex items-center gap-2">

            {application.resume && (
              <a
                href={`${base_url}${application.resume}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-slate-900 text-white text-sm font-medium hover:bg-slate-800 transition"
              >
                <FiDownload size={15} />
                Resume
              </a>
            )}

            {applicant?.resume && !application.resume && (
              <a
                href={`${base_url}${applicant.resume}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-slate-900 text-white text-sm font-medium hover:bg-slate-800 transition"
              >
                <FiDownload size={15} />
                Resume
              </a>
            )}

          </div>

          {application.coverLetter && (
            <div className="flex-1 md:max-w-[650px]">

              <div className="flex items-start gap-2">
                <FiFileText
                  className="text-slate-400 mt-0.5 shrink-0"
                  size={16}
                />

                <p className="text-sm text-slate-500 line-clamp-2">
                  {application.coverLetter}
                </p>
              </div>

            </div>
          )}

   
              <Link
             href={`/applications/${application._id}`}
           
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-green-900 text-white text-sm font-medium hover:bg-green-800 transition"
              >
                <PiEyeDuotone  size={15} />
                View
              </Link>
         

        </div>

      </div>
    </div>
  );
};


/* =========================================================
   STATUS
========================================================= */

const StatusBadge = ({ status }: { status: string }) => {

  const statusConfig: Record<
    string,
    {
      label: string;
      className: string;
    }
  > = {
    APPLIED: {
      label: "Applied",
      className: "bg-blue-50 text-blue-700 border-blue-100",
    },

    REVIEWING: {
      label: "Reviewing",
      className: "bg-yellow-50 text-yellow-700 border-yellow-100",
    },

    SHORTLISTED: {
      label: "Shortlisted",
      className: "bg-green-50 text-green-700 border-green-100",
    },

    REJECTED: {
      label: "Rejected",
      className: "bg-red-50 text-red-700 border-red-100",
    },

    HIRED: {
      label: "Hired",
      className: "bg-emerald-50 text-emerald-700 border-emerald-100",
    },
  };

  const config = statusConfig[status] || {
    label: formatLabel(status),
    className: "bg-slate-50 text-slate-600 border-slate-200",
  };

  return (
    <span
      className={`inline-flex items-center px-3 py-1.5 rounded-full border text-xs font-semibold whitespace-nowrap ${config.className}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current mr-2" />
      {config.label}
    </span>
  );
};


/* =========================================================
   EMPTY
========================================================= */

const EmptyState = ({ search }: { search: string }) => {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl py-20 text-center">

      <div className="w-16 h-16 mx-auto rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400">
        {search ? <FiSearch size={27} /> : <FiFileText size={27} />}
      </div>

      <h3 className="mt-5 text-lg font-semibold text-slate-900">
        {search
          ? "No applications found"
          : "No applications available"}
      </h3>

      <p className="text-sm text-slate-500 mt-2">
        {search
          ? "Try searching with a different keyword."
          : "There are no applications for the selected period."}
      </p>

    </div>
  );
};


/* =========================================================
   LOADING
========================================================= */

const LoadingSkeleton = () => {
  return (
    <div className="space-y-4">

      {[1, 2, 3, 4].map((item) => (
        <div
          key={item}
          className="bg-white border border-slate-200 rounded-2xl p-5 animate-pulse"
        >
          <div className="flex flex-col xl:flex-row gap-5">

            <div className="flex items-center gap-4 xl:w-[28%]">
              <div className="w-14 h-14 rounded-full bg-slate-200" />

              <div className="space-y-2 flex-1">
                <div className="h-4 bg-slate-200 rounded w-32" />
                <div className="h-3 bg-slate-200 rounded w-48" />
                <div className="h-3 bg-slate-200 rounded w-28" />
              </div>
            </div>

            <div className="flex-1 space-y-3">
              <div className="h-4 bg-slate-200 rounded w-48" />
              <div className="h-3 bg-slate-200 rounded w-32" />

              <div className="flex gap-2">
                <div className="h-6 w-20 bg-slate-200 rounded" />
                <div className="h-6 w-20 bg-slate-200 rounded" />
              </div>
            </div>

            <div className="w-32 space-y-2">
              <div className="h-3 bg-slate-200 rounded w-24" />
              <div className="h-3 bg-slate-200 rounded w-16" />
            </div>

            <div className="h-7 w-20 bg-slate-200 rounded-full" />

          </div>
        </div>
      ))}

    </div>
  );
};


/* =========================================================
   HELPERS
========================================================= */

const formatLabel = (value?: string) => {
  if (!value) return "";

  return value
    .toLowerCase()
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};