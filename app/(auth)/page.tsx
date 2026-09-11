"use client";

import { base_url, img_url } from "@/components/store/config";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";

import { Doughnut, Bar } from "react-chartjs-2";

import {
  FiUsers,
  FiBriefcase,
  FiFileText,
  FiGrid,
  FiLayers,
  FiBookOpen,
  FiArrowUpRight,
  FiClock,
  FiCheckCircle,
  FiUser,
} from "react-icons/fi";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement
);

interface DashboardData {
  overview: {
    users: number;
    jobs: number;
    applications: number;
    categories: number;
    subCategories: number;
    articles: number;
  };

  jobs: {
    total: number;
    published: number;
    draft: number;
    closed: number;
  };

  applications: {
    total: number;
    applied: number;
    shortlisted: number;
    interview: number;
    selected: number;
    rejected: number;
  };

  applicationStats: {
    name: string;
    value: number;
  }[];

  categories: {
    _id: string;
    title: string;
    subCategoryCount: number;
  }[];

  recentApplications: any[];

  recentUsers: any[];
}

const Page = () => {
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboard = async () => {
    try {
      setLoading(true);

      const response = await axios.get(`${base_url}/auth/dashboad`, {
        withCredentials: true,
      });

      if (response.data?.success) {
        setDashboard(response.data.data);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="h-screen overflow-auto bg-slate-50 p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-10 w-56 rounded-lg bg-slate-200" />

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div
                key={item}
                className="h-32 rounded-2xl bg-white shadow-sm"
              />
            ))}
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="h-96 rounded-2xl bg-white" />
            <div className="h-96 rounded-2xl bg-white" />
          </div>
        </div>
      </div>
    );
  }

  if (!dashboard) {
    return (
      <div className="flex h-screen overflow-auto items-center justify-center bg-slate-50">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-slate-800">
            Dashboard unavailable
          </h2>

          <button
            onClick={fetchDashboard}
            className="mt-4 rounded-lg bg-[#153497] px-5 py-2.5 text-sm font-semibold text-white"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // -----------------------------
  // CHART DATA
  // -----------------------------

  const applicationChartData = {
    labels: dashboard.applicationStats.map((item) => item.name),

    datasets: [
      {
        data: dashboard.applicationStats.map((item) => item.value),
        borderWidth: 0,
        hoverOffset: 6,
      },
    ],
  };

  const applicationChartOptions = {
    responsive: true,
    maintainAspectRatio: false,

    plugins: {
      legend: {
        position: "bottom" as const,

        labels: {
          usePointStyle: true,
          padding: 20,
        },
      },
    },

    cutout: "68%",
  };

  const applicationBarData = {
    labels: dashboard.applicationStats.map((item) => item.name),

    datasets: [
      {
        label: "Applications",
        data: dashboard.applicationStats.map((item) => item.value),
        borderRadius: 8,
        barThickness: 35,
      },
    ],
  };

  const applicationBarOptions = {
    responsive: true,
    maintainAspectRatio: false,

    plugins: {
      legend: {
        display: false,
      },
    },

    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          precision: 0,
        },
      },

      x: {
        grid: {
          display: false,
        },
      },
    },
  };

  // -----------------------------
  // CARDS
  // -----------------------------

  const cards = [
    {
      title: "Total Users",
      value: dashboard.overview.users,
      icon: FiUsers,
      bg: "bg-blue-50",
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
    },

    {
      title: "Total Jobs",
      value: dashboard.overview.jobs,
      icon: FiBriefcase,
      bg: "bg-purple-50",
      iconBg: "bg-purple-100",
      iconColor: "text-purple-600",
    },

    {
      title: "Applications",
      value: dashboard.overview.applications,
      icon: FiFileText,
      bg: "bg-orange-50",
      iconBg: "bg-orange-100",
      iconColor: "text-orange-600",
    },

    {
      title: "Categories",
      value: dashboard.overview.categories,
      icon: FiGrid,
      bg: "bg-green-50",
      iconBg: "bg-green-100",
      iconColor: "text-green-600",
    },

    {
      title: "Sub Categories",
      value: dashboard.overview.subCategories,
      icon: FiLayers,
      bg: "bg-pink-50",
      iconBg: "bg-pink-100",
      iconColor: "text-pink-600",
    },

    {
      title: "Articles",
      value: dashboard.overview.articles,
      icon: FiBookOpen,
      bg: "bg-indigo-50",
      iconBg: "bg-indigo-100",
      iconColor: "text-indigo-600",
    },
  ];

  return (
    <div className="h-screen overflow-auto bg-slate-50 p-4 md:p-6 lg:p-8">

      {/* HEADER */}
      <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
            Dashboard
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Overview of your job portal
          </p>
        </div>

        <button
          onClick={fetchDashboard}
          className="flex w-fit items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
        >
          <FiArrowUpRight />
          Refresh
        </button>
      </div>

      {/* OVERVIEW CARDS */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {cards.map((card) => {
          const Icon = card.icon;

          return (
            <div
              key={card.title}
              className="group rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="flex items-start justify-between">
                <div
                  className={`flex h-11 w-11 items-center justify-center rounded-xl ${card.iconBg}`}
                >
                  <Icon className={`text-xl ${card.iconColor}`} />
                </div>

                <FiArrowUpRight className="text-slate-300 transition group-hover:text-slate-500" />
              </div>

              <div className="mt-5">
                <p className="text-sm font-medium text-slate-500">
                  {card.title}
                </p>

                <h2 className="mt-1 text-3xl font-bold text-slate-900">
                  {card.value}
                </h2>
              </div>
            </div>
          );
        })}
      </div>

      {/* JOB + APPLICATION SUMMARY */}
      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">

        {/* JOB STATUS */}
        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Job Overview
              </h2>

              <p className="text-sm text-slate-500">
                Current job status
              </p>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50">
              <FiBriefcase className="text-purple-600" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div className="rounded-xl bg-slate-50 p-4">
              <p className="text-xs font-medium text-slate-500">
                Total
              </p>

              <p className="mt-2 text-2xl font-bold text-slate-900">
                {dashboard.jobs.total}
              </p>
            </div>

            <div className="rounded-xl bg-green-50 p-4">
              <p className="text-xs font-medium text-green-600">
                Published
              </p>

              <p className="mt-2 text-2xl font-bold text-green-700">
                {dashboard.jobs.published}
              </p>
            </div>

            <div className="rounded-xl bg-yellow-50 p-4">
              <p className="text-xs font-medium text-yellow-600">
                Draft
              </p>

              <p className="mt-2 text-2xl font-bold text-yellow-700">
                {dashboard.jobs.draft}
              </p>
            </div>

            <div className="rounded-xl bg-red-50 p-4">
              <p className="text-xs font-medium text-red-600">
                Closed
              </p>

              <p className="mt-2 text-2xl font-bold text-red-700">
                {dashboard.jobs.closed}
              </p>
            </div>
          </div>
        </div>

        {/* APPLICATION SUMMARY */}
        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Application Overview
              </h2>

              <p className="text-sm text-slate-500">
                Application pipeline
              </p>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50">
              <FiFileText className="text-orange-600" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
            <div>
              <p className="text-xs text-slate-500">Applied</p>
              <p className="mt-1 text-xl font-bold text-slate-800">
                {dashboard.applications.applied}
              </p>
            </div>

            <div>
              <p className="text-xs text-slate-500">Shortlisted</p>
              <p className="mt-1 text-xl font-bold text-blue-600">
                {dashboard.applications.shortlisted}
              </p>
            </div>

            <div>
              <p className="text-xs text-slate-500">Interview</p>
              <p className="mt-1 text-xl font-bold text-purple-600">
                {dashboard.applications.interview}
              </p>
            </div>

            <div>
              <p className="text-xs text-slate-500">Selected</p>
              <p className="mt-1 text-xl font-bold text-green-600">
                {dashboard.applications.selected}
              </p>
            </div>

            <div>
              <p className="text-xs text-slate-500">Rejected</p>
              <p className="mt-1 text-xl font-bold text-red-600">
                {dashboard.applications.rejected}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CHARTS */}
      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">

        {/* DOUGHNUT */}
        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
          <div className="mb-5">
            <h2 className="text-lg font-bold text-slate-900">
              Application Distribution
            </h2>

            <p className="text-sm text-slate-500">
              Applications by current status
            </p>
          </div>

          <div className="relative h-[320px]">
            <Doughnut
              data={applicationChartData}
              options={applicationChartOptions}
            />

            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-bold text-slate-900">
                {dashboard.applications.total}
              </span>

              <span className="text-xs text-slate-500">
                Applications
              </span>
            </div>
          </div>
        </div>

        {/* BAR */}
        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
          <div className="mb-5">
            <h2 className="text-lg font-bold text-slate-900">
              Application Statistics
            </h2>

            <p className="text-sm text-slate-500">
              Status-wise application count
            </p>
          </div>

          <div className="h-[320px]">
            <Bar
              data={applicationBarData}
              options={applicationBarOptions}
            />
          </div>
        </div>
      </div>

      {/* RECENT APPLICATIONS + USERS */}
      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-3">

        {/* RECENT APPLICATIONS */}
        <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm xl:col-span-2">
          <div className="flex items-center justify-between border-b border-slate-100 p-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Recent Applications
              </h2>

              <p className="text-sm text-slate-500">
                Latest job applications
              </p>
            </div>

            <FiClock className="text-slate-400" />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px]">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50 text-left">
                  <th className="px-6 py-4 text-xs font-semibold uppercase text-slate-500">
                    Applicant
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase text-slate-500">
                    Job
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase text-slate-500">
                    Applied
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase text-slate-500">
                    Status
                  </th>
                </tr>
              </thead>

              <tbody>
                {dashboard.recentApplications.length === 0 ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-6 py-10 text-center text-sm text-slate-500"
                    >
                      No applications found
                    </td>
                  </tr>
                ) : (
                  dashboard.recentApplications.map((application) => (
                    <tr
                      key={application._id}
                      className="border-b border-slate-100 last:border-0 hover:bg-slate-50"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-slate-100">
                            {application.userId?.image ? (
                              <img
                                src={`${img_url}${application.userId.image}`}
                                alt=""
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <FiUser className="text-slate-400" />
                            )}
                          </div>

                          <div>
                            <p className="font-semibold text-slate-800">
                              {application.userId?.fullname || "Unknown"}
                            </p>

                            <p className="text-xs text-slate-500">
                              {application.userId?.email}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <p className="font-medium text-slate-800">
                          {application.jobId?.title || "Unknown Job"}
                        </p>

                        <p className="text-xs text-slate-500">
                          {application.jobId?.companyName}
                        </p>
                      </td>

                      <td className="px-6 py-4 text-sm text-slate-500">
                        {new Date(
                          application.appliedAt || application.createdAt
                        ).toLocaleDateString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>

                      <td className="px-6 py-4">
                        <StatusBadge status={application.status} />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* RECENT USERS */}
        <div className="rounded-2xl border border-slate-100 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 p-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Recent Users
              </h2>

              <p className="text-sm text-slate-500">
                Newly registered users
              </p>
            </div>

            <FiUsers className="text-slate-400" />
          </div>

          <div className="divide-y divide-slate-100">
            {dashboard.recentUsers.length === 0 ? (
              <div className="p-6 text-center text-sm text-slate-500">
                No users found
              </div>
            ) : (
              dashboard.recentUsers.map((user) => (
                <div
                  key={user._id}
                  className="flex items-center gap-3 p-5 transition hover:bg-slate-50"
                >
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-slate-100">
                    {user.image ? (
                      <img
                        src={`${img_url}${user.image}`}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <FiUser className="text-slate-400" />
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold text-slate-800">
                      {user.fullname}
                    </p>

                    <p className="truncate text-xs text-slate-500">
                      {user.email}
                    </p>

                    <p className="mt-1 text-[11px] text-slate-400">
                      {new Date(user.createdAt).toLocaleDateString(
                        "en-IN",
                        {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        }
                      )}
                    </p>
                  </div>

                  <div>
                    {user.status ? (
                      <span className="flex items-center gap-1 rounded-full bg-green-50 px-2.5 py-1 text-xs font-semibold text-green-600">
                        <FiCheckCircle />
                        Active
                      </span>
                    ) : (
                      <span className="rounded-full bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-600">
                        Inactive
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* CATEGORIES */}
      <div className="mt-6 rounded-2xl border border-slate-100 bg-white shadow-sm">
        <div className="border-b border-slate-100 p-6">
          <h2 className="text-lg font-bold text-slate-900">
            Job Categories
          </h2>

          <p className="text-sm text-slate-500">
            Categories and their subcategories
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 p-6 md:grid-cols-2 lg:grid-cols-3">
          {dashboard.categories.map((category) => (
            <div
              key={category._id}
              className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 p-4 transition hover:border-slate-200 hover:bg-white hover:shadow-sm"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white shadow-sm">
                  <FiGrid className="text-[#153497]" />
                </div>

                <div>
                  <p className="font-semibold text-slate-800">
                    {category.title}
                  </p>

                  <p className="text-xs text-slate-500">
                    Category
                  </p>
                </div>
              </div>

              <div className="text-right">
                <p className="text-lg font-bold text-slate-900">
                  {category.subCategoryCount}
                </p>

                <p className="text-[11px] text-slate-500">
                  Subcategories
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const StatusBadge = ({ status }: { status: string }) => {
  const statusStyles: Record<string, string> = {
    APPLIED: "bg-blue-50 text-blue-600",
    SHORTLISTED: "bg-purple-50 text-purple-600",
    INTERVIEW: "bg-yellow-50 text-yellow-700",
    SELECTED: "bg-green-50 text-green-600",
    REJECTED: "bg-red-50 text-red-600",
    WITHDRAWN: "bg-slate-100 text-slate-600",
  };

  const statusText: Record<string, string> = {
    APPLIED: "Applied",
    SHORTLISTED: "Shortlisted",
    INTERVIEW: "Interview",
    SELECTED: "Selected",
    REJECTED: "Rejected",
    WITHDRAWN: "Withdrawn",
  };

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
        statusStyles[status] || "bg-slate-100 text-slate-600"
      }`}
    >
      {statusText[status] || status}
    </span>
  );
};

export default Page;