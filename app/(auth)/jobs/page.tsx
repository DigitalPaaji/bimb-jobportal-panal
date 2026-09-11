"use client";

import { base_url, img_url } from "@/components/store/config";
import axios from "axios";
import { useSearchParams, useRouter } from "next/navigation";
import React, { Suspense, useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  FiSearch,
  FiRefreshCw,
  FiEdit,
  FiTrash2,
  FiEye,
  FiStar,
  FiAlertCircle,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";

type Category = {
  _id: string;
  title: string;
};

type SubCategory = {
  _id: string;
  title: string;
  category?: string | Category;
};

type Job = {
  _id: string;
  title: string;
  companyName: string;
  companyLogo?: string;
  jobType: string;
  workMode: string;
  category?: {
    _id: string;
    title: string;
  };
  subcategory?: {
    _id: string;
    title: string;
  };
  status: string;
  isFeatured: boolean;
  isUrgent: boolean;
  views: number;
  applicationsCount: number;
  createdAt: string;
};

type Pagination = {
  currentPage: number;
  limit: number;
  totalJobs: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
};

const Page = () => {
  return (
    <Suspense 
      fallback={
        <div className="flex min-h-[400px] items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-[#153497]" />
        </div>
      }
    >
      <JobCompo />
    </Suspense>
  );
};

export default Page;

const JobCompo = () => {
  const router = useRouter();
  const query = useSearchParams();

  const [allCategory, setAllCategory] = useState<Category[]>([]);
  const [allSubCategory, setAllSubCategory] = useState<SubCategory[]>([]);

  const [jobs, setJobs] = useState<Job[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);

  const [loading, setLoading] = useState(false);
  const [categoryLoading, setCategoryLoading] = useState(false);

  // ----------------------------------
  // URL FILTERS
  // ----------------------------------

  const currentPage = Number(query.get("page")) || 1;
  const limit = Number(query.get("limit")) || 20;

  const search = query.get("search") || "";
  const category = query.get("category") || "";
  const subcategory = query.get("subcategory") || "";
  const jobType = query.get("JobType") || "";
  const workMode = query.get("WorkMode") || "";

  // ----------------------------------
  // LOCAL SEARCH STATE
  // ----------------------------------

  const [searchInput, setSearchInput] = useState(search);

  useEffect(() => {
    setSearchInput(search);
  }, [search]);

  // ----------------------------------
  // UPDATE URL
  // ----------------------------------

  const updateQuery = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(query.toString());

      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }

      // Whenever a filter changes, go back to page 1
      if (key !== "page") {
        params.set("page", "1");
      }

      router.push(`?${params.toString()}`);
    },
    [query, router]
  );

  // ----------------------------------
  // SEARCH DEBOUNCE
  // ----------------------------------

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchInput !== search) {
        updateQuery("search", searchInput);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchInput, search, updateQuery]);

  // ----------------------------------
  // FETCH JOBS
  // ----------------------------------

  const fetchJob = async () => {
    try {
      setLoading(true);

      const params = new URLSearchParams();

      params.set("page", currentPage.toString());
      params.set("limit", limit.toString());

      if (search) {
        params.set("search", search);
      }

      if (category) {
        params.set("category", category);
      }

      if (subcategory) {
        params.set("subcategory", subcategory);
      }

      if (jobType) {
        params.set("JobType", jobType);
      }

      if (workMode) {
        params.set("WorkMode", workMode);
      }

      const response = await axios.get(
        `${base_url}/job/get?${params.toString()}`,
        {
          withCredentials: true,
        }
      );

      const data = response.data;

      if (data.success) {
        setJobs(data.data || []);
        setPagination(data.pagination || null);
      } else {
        setJobs([]);
        setPagination(null);
        toast.error(data.message || "Failed to fetch jobs");
      }
    } catch (error: any) {
      console.error(error);

      setJobs([]);
      setPagination(null);

      toast.error(
        error?.response?.data?.message || "Failed to fetch jobs"
      );
    } finally {
      setLoading(false);
    }
  };

  // ----------------------------------
  // FETCH CATEGORIES
  // ----------------------------------

  const fetchAllCate = async () => {
    try {
      setCategoryLoading(true);

      const response = await axios.get(`${base_url}/category/get`, {
        withCredentials: true,
      });

      const data = response.data;

      if (data.success) {
        setAllCategory(data.allCategory || []);
      } else {
        setAllCategory([]);
        toast.error(data.message || "Failed to fetch categories");
      }
    } catch (error: any) {
      setAllCategory([]);

      toast.error(
        error?.response?.data?.message ||
          "Failed to fetch categories"
      );
    } finally {
      setCategoryLoading(false);
    }
  };

  // ----------------------------------
  // FETCH SUBCATEGORIES
  // ----------------------------------

  const fetchAllSubCate = async () => {
    try {
      const response = await axios.get(`${base_url}/category/sub/get`, {
        withCredentials: true,
      });

      const data = response.data;

      if (data.success) {
        setAllSubCategory(data.subCategory || []);
      } else {
        setAllSubCategory([]);
        toast.error(data.message || "Failed to fetch subcategories");
      }
    } catch (error: any) {
      setAllSubCategory([]);

      toast.error(
        error?.response?.data?.message ||
          "Failed to fetch subcategories"
      );
    }
  };

  // ----------------------------------
  // INITIAL / FILTER FETCH
  // ----------------------------------

  useEffect(() => {
    fetchJob();
  }, [
    currentPage,
    limit,
    search,
    category,
    subcategory,
    jobType,
    workMode,
  ]);

  useEffect(() => {
    fetchAllCate();
    fetchAllSubCate();
  }, []);

  // ----------------------------------
  // RESET FILTERS
  // ----------------------------------

  const resetFilters = () => {
    setSearchInput("");

    router.push("?");
  };

  // ----------------------------------
  // PAGE CHANGE
  // ----------------------------------

  const changePage = (pageNumber: number) => {
    if (pageNumber < 1) return;

    if (pagination && pageNumber > pagination.totalPages) {
      return;
    }

    updateQuery("page", pageNumber.toString());
  };

  // ----------------------------------
  // DELETE JOB
  // ----------------------------------

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this job?"
    );

    if (!confirmed) return;

    try {
      // Change this endpoint if your backend uses another route.
      const response = await axios.delete(
        `${base_url}/job/delete/${id}`,
        {
          withCredentials: true,
        }
      );

      if (response.data.success) {
        toast.success(
          response.data.message || "Job deleted successfully"
        );

        fetchJob();
      } else {
        toast.error(
          response.data.message || "Failed to delete job"
        );
      }
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ||
          "Failed to delete job"
      );
    }
  };

  // ----------------------------------
  // HELPERS
  // ----------------------------------

  const getLogo = (logo?: string) => {
    if (!logo) return "";

    if (logo.startsWith("http")) {
      return logo;
    }

    return `${base_url}${logo}`;
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getJobTypeLabel = (type: string) => {
    return type
      .replaceAll("_", " ")
      .toLowerCase()
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  const getWorkModeLabel = (mode: string) => {
    return mode
      .replaceAll("_", " ")
      .toLowerCase()
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  // ----------------------------------
  // FILTERED SUBCATEGORIES
  // ----------------------------------

  const filteredSubCategories = allSubCategory.filter((item) => {
    if (!category) return true;

    if (!item.category) return true;

    if (typeof item.category === "string") {
      return item.category === category;
    }

    return item.category._id === category;
  });

  // ----------------------------------
  // RENDER
  // ----------------------------------

  return (
    <div className="min-h-screen  overflow-auto bg-gray-50 p-4 md:p-6">
      <div className="mx-auto ">

        {/* HEADER */}
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Jobs
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              Manage and monitor all job postings
            </p>
          </div>

          <button
            type="button"
            onClick={resetFilters}
            className="flex w-fit items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
          >
            <FiRefreshCw size={16} />
            Reset Filters
          </button>
        </div>

        {/* FILTER CARD */}
        <div className="mb-6 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">

            {/* SEARCH */}
            <div className="relative xl:col-span-2">
              <FiSearch
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={18}
              />

              <input
                type="text"
                value={searchInput}
                onChange={(e) =>
                  setSearchInput(e.target.value)
                }
                placeholder="Search jobs or company..."
                className="h-11 w-full rounded-lg border border-gray-300 bg-white pl-10 pr-4 text-sm outline-none transition focus:border-[#153497] focus:ring-2 focus:ring-[#153497]/10"
              />
            </div>

            {/* CATEGORY */}
            <select
              value={category}
              onChange={(e) => {
                updateQuery("category", e.target.value);

                // Clear subcategory when category changes
                const params = new URLSearchParams(
                  query.toString()
                );

                if (e.target.value) {
                  params.set("category", e.target.value);
                } else {
                  params.delete("category");
                }

                params.delete("subcategory");
                params.set("page", "1");

                router.push(`?${params.toString()}`);
              }}
              className="h-11 rounded-lg border border-gray-300 bg-white px-3 text-sm outline-none focus:border-[#153497] focus:ring-2 focus:ring-[#153497]/10"
            >
              <option value="">All Categories</option>

              {allCategory.map((item) => (
                <option key={item._id} value={item._id}>
                  {item.title}
                </option>
              ))}
            </select>

            {/* SUBCATEGORY */}
            <select
              value={subcategory}
              onChange={(e) =>
                updateQuery("subcategory", e.target.value)
              }
              className="h-11 rounded-lg border border-gray-300 bg-white px-3 text-sm outline-none focus:border-[#153497] focus:ring-2 focus:ring-[#153497]/10"
            >
              <option value="">All Subcategories</option>

              {filteredSubCategories.map((item) => (
                <option key={item._id} value={item._id}>
                  {item.title}
                </option>
              ))}
            </select>

            {/* JOB TYPE */}
            <select
              value={jobType}
              onChange={(e) =>
                updateQuery("JobType", e.target.value)
              }
              className="h-11 rounded-lg border border-gray-300 bg-white px-3 text-sm outline-none focus:border-[#153497] focus:ring-2 focus:ring-[#153497]/10"
            >
              <option value="">All Job Types</option>
              <option value="FULL_TIME">Full Time</option>
              <option value="PART_TIME">Part Time</option>
              <option value="CONTRACT">Contract</option>
              <option value="INTERNSHIP">Internship</option>
              <option value="FREELANCE">Freelance</option>
            </select>

            {/* WORK MODE */}
            <select
              value={workMode}
              onChange={(e) =>
                updateQuery("WorkMode", e.target.value)
              }
              className="h-11 rounded-lg border border-gray-300 bg-white px-3 text-sm outline-none focus:border-[#153497] focus:ring-2 focus:ring-[#153497]/10"
            >
              <option value="">All Work Modes</option>
              <option value="ONSITE">Onsite</option>
              <option value="REMOTE">Remote</option>
              <option value="HYBRID">Hybrid</option>
            </select>
          </div>
        </div>

        {/* TABLE */}
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">

          {/* TABLE HEADER */}
          <div className="flex flex-col gap-2 border-b border-gray-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-semibold text-gray-900">
                Job Listings
              </h2>

              <p className="text-xs text-gray-500">
                {pagination
                  ? `${pagination.totalJobs} total jobs`
                  : "Loading jobs..."}
              </p>
            </div>

            {loading && (
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-[#153497]" />
                Loading...
              </div>
            )}
          </div>

          {/* TABLE WRAPPER */}
         <div className="overflow-x-auto">

            <table className="w-full min-w-[1200px] text-left text-sm">

              <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                <tr>
                  <th className="px-5 py-4 font-semibold">
                    Job
                  </th>

                  <th className="px-5 py-4 font-semibold">
                    Company
                  </th>

                  <th className="px-5 py-4 font-semibold">
                    Category
                  </th>

                  <th className="px-5 py-4 font-semibold">
                    Job Type
                  </th>

                  <th className="px-5 py-4 font-semibold">
                    Work Mode
                  </th>

                  <th className="px-5 py-4 font-semibold">
                    Status
                  </th>

                  <th className="px-5 py-4 font-semibold">
                    Stats
                  </th>

                  <th className="px-5 py-4 font-semibold">
                    Created
                  </th>

                  <th className="px-5 py-4 text-right font-semibold">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">

              
                {loading && jobs.length === 0 ? (
                  Array.from({ length: 5 }).map((_, index) => (
                    <tr key={index}>
                      {Array.from({ length: 9 }).map(
                        (_, cellIndex) => (
                          <td
                            key={cellIndex}
                            className="px-5 py-5"
                          >
                            <div className="h-5 animate-pulse rounded bg-gray-100" />
                          </td>
                        )
                      )}
                    </tr>
                  ))
                ) : jobs.length === 0 ? (

                 
                  <tr>
                    <td
                      colSpan={9}
                      className="px-5 py-16 text-center"
                    >
                      <div className="flex flex-col items-center">
                        <FiAlertCircle
                          size={40}
                          className="mb-3 text-gray-300"
                        />

                        <h3 className="font-semibold text-gray-700">
                          No jobs found
                        </h3>

                        <p className="mt-1 text-sm text-gray-400">
                          Try changing your search or filters.
                        </p>
                      </div>
                    </td>
                  </tr>

                ) : (

                
                  jobs.map((job) => (
                    <tr
                      key={job._id}
                      className="transition hover:bg-gray-50"
                    >

                   
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">

                          <div className="h-11 w-11 shrink-0 overflow-hidden rounded-lg border border-gray-200 bg-gray-100">
                            {job.companyLogo ? (
                              <img
                                src={`${img_url}${job.companyLogo}`}
                                alt={job.companyName}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center text-sm font-bold text-gray-400">
                                {job.companyName
                                  ?.charAt(0)
                                  ?.toUpperCase()}
                              </div>
                            )}
                          </div>

                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <p className="max-w-[220px] truncate font-semibold text-gray-900">
                                {job.title}
                              </p>

                              {job.isFeatured && (
                                <FiStar
                                  size={15}
                                  className="shrink-0 text-yellow-500"
                                  fill="currentColor"
                                />
                              )}

                              {job.isUrgent && (
                                <FiAlertCircle
                                  size={15}
                                  className="shrink-0 text-red-500"
                                />
                              )}
                            </div>

                            <p className="mt-1 text-xs text-gray-400">
                              ID: {job._id}
                            </p>
                          </div>

                        </div>
                      </td>

                    
                      <td className="px-5 py-4">
                        <span className="font-medium text-gray-700">
                          {job.companyName}
                        </span>
                      </td>

                  
                      <td className="px-5 py-4">
                        <div>
                          <p className="font-medium text-gray-700">
                            {job.category?.title || "-"}
                          </p>

                          <p className="mt-1 text-xs text-gray-400">
                            {job.subcategory?.title || "-"}
                          </p>
                        </div>
                      </td>

                   
                      <td className="px-5 py-4">
                        <span className="inline-flex rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
                          {getJobTypeLabel(job.jobType)}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <span className="inline-flex rounded-full bg-purple-50 px-3 py-1 text-xs font-medium text-purple-700">
                          {getWorkModeLabel(job.workMode)}
                        </span>
                      </td>

                   
                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                            job.status === "PUBLISHED"
                              ? "bg-green-50 text-green-700"
                              : job.status === "PENDING"
                              ? "bg-yellow-50 text-yellow-700"
                              : job.status === "DRAFT"
                              ? "bg-gray-100 text-gray-600"
                              : "bg-red-50 text-red-700"
                          }`}
                        >
                          {job.status}
                        </span>
                      </td>

                   
                      <td className="px-5 py-4">
                        <div className="space-y-1 text-xs">
                          <div className="flex items-center gap-2 text-gray-500">
                            <FiEye size={14} />
                            {job.views || 0} views
                          </div>

                          <div className="text-gray-500">
                            {job.applicationsCount || 0} applications
                          </div>
                        </div>
                      </td>

                    
                      <td className="whitespace-nowrap px-5 py-4 text-gray-500">
                        {formatDate(job.createdAt)}
                      </td>

                   
                      <td className="px-5 py-4">
                        <div className="flex justify-end gap-2">

                          <button
                            type="button"
                            title="View"
                            onClick={() =>
                              router.push(
                                `/jobs/${job._id}/view`
                              )
                            }
                            className="rounded-lg border border-gray-200 p-2 text-gray-600 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
                          >
                            <FiEye size={16} />
                          </button>

                          <button
                            type="button"
                            title="Edit"
                            onClick={() =>
                              router.push(
                                `/jobs/${job._id}/edit`
                              )
                            }
                            className="rounded-lg border border-gray-200 p-2 text-gray-600 transition hover:border-yellow-200 hover:bg-yellow-50 hover:text-yellow-600"
                          >
                            <FiEdit size={16} />
                          </button>

                       

                        </div>
                      </td>

                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div> 

          {/* PAGINATION */}
          {pagination && pagination.totalPages > 0 && (
            <div className="flex flex-col gap-4 border-t border-gray-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">

              {/* INFO */}
              <div className="text-sm text-gray-500">
                Showing{" "}
                <span className="font-medium text-gray-700">
                  {(pagination.currentPage - 1) *
                    pagination.limit +
                    1}
                </span>{" "}
                to{" "}
                <span className="font-medium text-gray-700">
                  {Math.min(
                    pagination.currentPage *
                      pagination.limit,
                    pagination.totalJobs
                  )}
                </span>{" "}
                of{" "}
                <span className="font-medium text-gray-700">
                  {pagination.totalJobs}
                </span>{" "}
                jobs
              </div>

              {/* PAGINATION BUTTONS */}
              <div className="flex items-center gap-1">

                <button
                  type="button"
                  disabled={!pagination.hasPreviousPage}
                  onClick={() =>
                    changePage(
                      pagination.currentPage - 1
                    )
                  }
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-600 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <FiChevronLeft size={18} />
                </button>

                {Array.from(
                  {
                    length: pagination.totalPages,
                  },
                  (_, index) => index + 1
                )
                  .filter((pageNumber) => {
                    if (
                      pagination.totalPages <= 5
                    ) {
                      return true;
                    }

                    return (
                      pageNumber === 1 ||
                      pageNumber ===
                        pagination.totalPages ||
                      Math.abs(
                        pageNumber -
                          pagination.currentPage
                      ) <= 1
                    );
                  })
                  .map((pageNumber, index, array) => {

                    const previousPage =
                      array[index - 1];

                    const showDots =
                      previousPage &&
                      pageNumber -
                        previousPage >
                        1;

                    return (
                      <React.Fragment
                        key={pageNumber}
                      >

                        {showDots && (
                          <span className="flex h-9 w-9 items-center justify-center text-gray-400">
                            ...
                          </span>
                        )}

                        <button
                          type="button"
                          onClick={() =>
                            changePage(pageNumber)
                          }
                          className={`h-9 min-w-9 rounded-lg px-3 text-sm font-medium transition ${
                            pagination.currentPage ===
                            pageNumber
                              ? "bg-[#153497] text-white"
                              : "border border-gray-200 text-gray-600 hover:bg-gray-50"
                          }`}
                        >
                          {pageNumber}
                        </button>

                      </React.Fragment>
                    );
                  })}

                <button
                  type="button"
                  disabled={!pagination.hasNextPage}
                  onClick={() =>
                    changePage(
                      pagination.currentPage + 1
                    )
                  }
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-600 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <FiChevronRight size={18} />
                </button>

              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

