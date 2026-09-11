"use client";

import { base_url, img_url } from "@/components/store/config";
import axios from "axios";
import { useSearchParams, useRouter } from "next/navigation";
import React, { Suspense, useEffect, useState } from "react";
import {
  FiSearch,
  FiEye,
  FiEdit2,
  FiChevronLeft,
  FiChevronRight,
  FiUser,
  FiMail,
  FiPhone,
  FiFilter,
  FiRefreshCw,
} from "react-icons/fi";

interface User {
  _id: string;
  fullname: string;
  email: string;
  phone: string;
  image?: string;
  status: boolean;
}

interface Pagination {
  currentPage: number;
  limit: number;
  totalUsers: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

const Page = () => {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[400px] items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-[#153497]" />
        </div>
      }
    >
      <UserCompo />
    </Suspense>
  );
};

export default Page;

const UserCompo = () => {
  const router = useRouter();
  const query = useSearchParams();

  const page = Number(query.get("page")) || 1;
  const limit = Number(query.get("limit")) || 20;
  const searchQuery = query.get("search") || "";
  const statusQuery = query.get("status") || "";

  const [users, setUsers] = useState<User[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);

  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState(searchQuery);
  const [status, setStatus] = useState(statusQuery);

  const fetchUser = async () => {
    setLoading(true);

    try {
      const params = new URLSearchParams();

      params.set("page", page.toString());
      params.set("limit", limit.toString());

      if (searchQuery) {
        params.set("search", searchQuery);
      }

      if (statusQuery) {
        params.set("status", statusQuery);
      }

      const response = await axios.get(
        `${base_url}/user/getall?${params.toString()}`,
        {
          withCredentials: true,
        }
      );

      const data = response.data;

      setUsers(data?.users || []);
      setPagination(data?.pagination || null);
    } catch (error) {
      console.error("Failed to fetch users:", error);
      setUsers([]);
      setPagination(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, [page, limit, searchQuery, statusQuery]);

  /*
   * Update URL without refreshing page
   */
  const updateQuery = (key: string, value: string) => {
    const params = new URLSearchParams(query.toString());

    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }

    if (key !== "page") {
      params.set("page", "1");
    }

    router.push(`?${params.toString()}`);
  };

  /*
   * Search
   */
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    updateQuery("search", search.trim());
  };

  /*
   * Status filter
   */
  const handleStatus = (value: string) => {
    setStatus(value);
    updateQuery("status", value);
  };

  /*
   * Limit
   */
  const handleLimit = (value: string) => {
    updateQuery("limit", value);
  };

  /*
   * Pagination
   */
  const goToPage = (newPage: number) => {
    if (newPage < 1) return;

    if (pagination) {
      if (newPage > pagination.totalPages) return;
    }

    updateQuery("page", newPage.toString());
  };

  /*
   * Clear filters
   */
  const clearFilters = () => {
    setSearch("");
    setStatus("");

    router.push("?page=1&limit=20");
  };

  /*
   * Image URL
   */
  const getImageUrl = (image?: string) => {
    if (!image) return "";

    if (image.startsWith("http")) {
      return image;
    }

    return `${img_url}${image}`;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Users
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              Manage and view registered users
            </p>
          </div>

          <div className="rounded-lg bg-white px-4 py-2 shadow-sm ring-1 ring-gray-200">
            <span className="text-sm text-gray-500">
              Total Users
            </span>

            <p className="text-xl font-bold text-[#153497]">
              {pagination?.totalUsers ?? 0}
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-5 rounded-xl bg-white p-4 shadow-sm ring-1 ring-gray-200">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center">

            {/* Search */}
            <form
              onSubmit={handleSearch}
              className="flex flex-1"
            >
              <div className="relative w-full">
                <FiSearch
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by name, email or phone..."
                  className="h-11 w-full rounded-lg border border-gray-200 bg-gray-50 pl-10 pr-4 text-sm outline-none transition focus:border-[#153497] focus:bg-white focus:ring-2 focus:ring-[#153497]/10"
                />
              </div>

              <button
                type="submit"
                className="ml-2 h-11 rounded-lg bg-[#153497] px-5 text-sm font-medium text-white transition hover:bg-[#102775]"
              >
                Search
              </button>
            </form>

            {/* Status */}
            <div className="relative">
              <FiFilter
                size={17}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <select
                value={status}
                onChange={(e) => handleStatus(e.target.value)}
                className="h-11 min-w-[150px] appearance-none rounded-lg border border-gray-200 bg-white pl-9 pr-8 text-sm outline-none focus:border-[#153497]"
              >
                <option value="">All Status</option>
                <option value="true">Active</option>
                <option value="false">Inactive</option>
              </select>
            </div>

            {/* Limit */}
            <select
              value={limit}
              onChange={(e) => handleLimit(e.target.value)}
              className="h-11 rounded-lg border border-gray-200 bg-white px-3 text-sm outline-none focus:border-[#153497]"
            >
              <option value="10">10 / page</option>
              <option value="20">20 / page</option>
              <option value="50">50 / page</option>
              <option value="100">100 / page</option>
            </select>

            {/* Clear */}
            {(searchQuery || statusQuery) && (
              <button
                onClick={clearFilters}
                className="flex h-11 items-center justify-center gap-2 rounded-lg border border-gray-200 px-4 text-sm font-medium text-gray-600 transition hover:bg-gray-50"
              >
                <FiRefreshCw size={16} />
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-gray-200">

          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px]">

              {/* Table Head */}
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                    User
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Email
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Phone
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Status
                  </th>

                  <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Actions
                  </th>
                </tr>
              </thead>

              {/* Table Body */}
              <tbody className="divide-y divide-gray-100">

                {loading ? (
                  [...Array(5)].map((_, index) => (
                    <tr key={index}>
                      <td colSpan={5} className="px-5 py-5">
                        <div className="flex animate-pulse items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-gray-200" />

                          <div className="space-y-2">
                            <div className="h-3 w-32 rounded bg-gray-200" />
                            <div className="h-3 w-20 rounded bg-gray-100" />
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : users.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-5 py-16 text-center"
                    >
                      <div className="flex flex-col items-center">
                        <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-gray-100">
                          <FiUser
                            size={24}
                            className="text-gray-400"
                          />
                        </div>

                        <h3 className="font-semibold text-gray-800">
                          No users found
                        </h3>

                        <p className="mt-1 text-sm text-gray-500">
                          Try changing your search or filters.
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  users.map((user) => (
                    <tr
                      key={user._id}
                      className="transition hover:bg-gray-50"
                    >

                      {/* User */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">

                          {user.image ? (
                            <img
                              src={getImageUrl(user.image)}
                              alt={user.fullname}
                              className="h-11 w-11 rounded-full object-cover ring-2 ring-gray-100"
                            />
                          ) : (
                            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#153497]/10 text-[#153497]">
                              <FiUser size={20} />
                            </div>
                          )}

                          <div>
                            <p className="font-semibold text-gray-900">
                              {user.fullname}
                            </p>

                            <p className="text-xs text-gray-400">
                              ID: {user._id.slice(-8)}
                            </p>
                          </div>

                        </div>
                      </td>

                      {/* Email */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <FiMail
                            size={15}
                            className="text-gray-400"
                          />
                          {user.email}
                        </div>
                      </td>

                      {/* Phone */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <FiPhone
                            size={15}
                            className="text-gray-400"
                          />
                          {user.phone || "—"}
                        </div>
                      </td>

                      {/* Status */}
                      <td className="px-5 py-4">
                        {user.status ? (
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
                            <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                            Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-700">
                            <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
                            Inactive
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-4">
                        <div className="flex justify-end gap-2">

                          {/* View */}
                          <button
                            title="View user"
                            onClick={() =>
                              router.push(
                                `/candidates/${user._id}`
                              )
                            }
                            className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition hover:border-[#153497]/20 hover:bg-[#153497]/5 hover:text-[#153497]"
                          >
                            <FiEye size={17} />
                          </button>

                          {/* Edit */}
                          {/* <button
                            title="Edit user"
                            onClick={() =>
                              router.push(
                                `/candidates/${user._id}/edit`
                              )
                            }
                            className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
                          >
                            <FiEdit2 size={16} />
                          </button> */}

                        </div>
                      </td>

                    </tr>
                  ))
                )}

              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {!loading && pagination && pagination.totalUsers > 0 && (
            <div className="flex flex-col gap-3 border-t border-gray-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">

              <p className="text-sm text-gray-500">
                Showing{" "}
                <span className="font-medium text-gray-800">
                  {(pagination.currentPage - 1) *
                    pagination.limit +
                    1}
                </span>{" "}
                to{" "}
                <span className="font-medium text-gray-800">
                  {Math.min(
                    pagination.currentPage * pagination.limit,
                    pagination.totalUsers
                  )}
                </span>{" "}
                of{" "}
                <span className="font-medium text-gray-800">
                  {pagination.totalUsers}
                </span>{" "}
                users
              </p>

              <div className="flex items-center gap-1">

                {/* Previous */}
                <button
                  disabled={!pagination.hasPreviousPage}
                  onClick={() =>
                    goToPage(pagination.currentPage - 1)
                  }
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-600 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <FiChevronLeft size={18} />
                </button>

                {/* Page Numbers */}
                {Array.from(
                  {
                    length: pagination.totalPages,
                  },
                  (_, index) => index + 1
                )
                  .filter((pageNumber) => {
                    return (
                      pageNumber === 1 ||
                      pageNumber === pagination.totalPages ||
                      Math.abs(
                        pageNumber -
                          pagination.currentPage
                      ) <= 1
                    );
                  })
                  .map((pageNumber, index, arr) => {

                    const previousPage =
                      arr[index - 1];

                    const showDots =
                      previousPage &&
                      pageNumber - previousPage > 1;

                    return (
                      <React.Fragment key={pageNumber}>

                        {showDots && (
                          <span className="px-2 text-gray-400">
                            ...
                          </span>
                        )}

                        <button
                          onClick={() =>
                            goToPage(pageNumber)
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

                {/* Next */}
                <button
                  disabled={!pagination.hasNextPage}
                  onClick={() =>
                    goToPage(pagination.currentPage + 1)
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

