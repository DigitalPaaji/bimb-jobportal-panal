"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { toast } from "react-toastify";
import {
  FaArrowLeft,
  FaBriefcase,
  FaBuilding,
  FaCalendarAlt,
  FaCheckCircle,
  FaClock,
  FaGraduationCap,
  FaGlobe,

  FaMoneyBillWave,
  FaPhone,
  FaEnvelope,
  FaUsers,
  FaUserTie,
  FaEdit,
  FaEye,
  
  FaExclamationTriangle,
} from "react-icons/fa";
import { base_url, img_url } from "@/components/store/config";
import { FaLocationDot } from "react-icons/fa6";
import Link from "next/link";

interface Category {
  _id: string;
  title: string;
}

interface Location {
  city: string;
  state: string;
  country: string;
  address: string;
}

interface Experience {
  min: number;
  max: number;
}

interface Salary {
  min: number;
  max: number;
  currency: string;
  period: string;
}

interface Job {
  _id: string;
  title: string;
  slug: string;
  description: string;

  companyName: string;
  companyLogo: string;
  companyWebsite: string;

  jobType: string;
  workMode: string;

  category: Category;
  subcategory: Category;

  skills: string[];
  education: string[];
  responsibilities: string[];
  requirements: string[];
  benefits: string[];
questions:string[];
  location: Location;
  experience: Experience;
  salary: Salary;

  vacancies: number;
  applicationDeadline: string;
  applicationUrl: string;

  contactEmail: string;
  contactPhone: string;

  status: string;
  isFeatured: boolean;
  isUrgent: boolean;

  views: number;
  applicationsCount: number;

  createdAt: string;
  updatedAt: string;
}

const JobDetailsPage = () => {
  const params = useParams();
  const router = useRouter();

  const id = params?.id as string;

  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchJob = async () => {
    try {
      setLoading(true);

      const response = await axios.get(`${base_url}/job/get/${id}?viewtype=view`, {
        withCredentials: true,
      });

      if (response.data?.success) {
        setJob(response.data.job);
      } else {
        toast.error(response.data?.message || "Failed to fetch job");
      }
    } catch (error: any) {
      console.error("Fetch job error:", error);

      toast.error(
        error?.response?.data?.message || "Failed to fetch job details"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchJob();
    }
  }, [id]);

  const formatDate = (date: string) => {
    if (!date) return "N/A";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatSalary = () => {
    if (!job?.salary) return "Not specified";

    const { min, max, currency, period } = job.salary;

    const symbol = currency === "INR" ? "₹" : currency;

    const salaryMin = `${symbol}${min} LPA`;
    const salaryMax = `${symbol}${max} LPA`;

    if (min === max) {
      return salaryMin;
    }

    return `${salaryMin} - ${salaryMax}`;
  };


  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 p-4 md:p-6">
        <div className="mx-auto max-w-7xl animate-pulse space-y-6">
          <div className="h-10 w-40 rounded-lg bg-slate-200" />

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <div className="flex gap-5">
              <div className="h-20 w-20 rounded-xl bg-slate-200" />

              <div className="flex-1 space-y-3">
                <div className="h-7 w-1/3 rounded bg-slate-200" />
                <div className="h-4 w-1/4 rounded bg-slate-200" />
                <div className="h-4 w-1/2 rounded bg-slate-200" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="h-96 rounded-2xl bg-white lg:col-span-2" />
            <div className="h-96 rounded-2xl bg-white" />
          </div>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 p-6">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-red-500">
            <FaExclamationTriangle size={25} />
          </div>

          <h2 className="text-xl font-bold text-slate-800">
            Job not found
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            The job you are looking for does not exist or has been removed.
          </p>

          <button
            onClick={() => router.back()}
            className="mt-5 rounded-lg bg-[#153497] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#102a7c]"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen overflow-auto bg-slate-50 p-4 md:p-6">
      <div className="mx-auto max-w-7xl space-y-6">

        {/* TOP BAR */}
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <button
            onClick={() => router.back()}
            className="flex w-fit items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-[#153497]"
          >
            <FaArrowLeft />
            Back to Jobs
          </button>

          <button
            onClick={() => router.push(`/jobs/${job._id}/edit`)}
            className="flex cursor-pointer w-fit items-center gap-2 rounded-lg bg-[#153497] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#102a7c]"
          >
            <FaEdit />
            Edit Job
          </button>
        </div>

        {/* JOB HEADER */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="h-2 bg-[#153497]" />

          <div className="p-5 md:p-7">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">

              <div className="flex flex-col gap-5 sm:flex-row">

                {/* COMPANY LOGO */}
                <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
                  {job.companyLogo ? (
                    <img
                      src={`${img_url}${job.companyLogo}`}
                      alt={job.companyName}
                      className="h-full w-full object-contain"
                    />
                  ) : (
                    <FaBuilding
                      size={32}
                      className="text-slate-400"
                    />
                  )}
                </div>

                {/* JOB TITLE */}
                <div>
                  <div className="mb-2 flex flex-wrap items-center gap-2">

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-bold ${
                        job.status === "PUBLISHED"
                          ? "bg-green-100 text-green-700"
                          : job.status === "DRAFT"
                          ? "bg-slate-100 text-slate-600"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {job.status}
                    </span>

                    {job.isFeatured && (
                      <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-700">
                        Featured
                      </span>
                    )}

                    {job.isUrgent && (
                      <span className="flex items-center gap-1 rounded-full bg-red-100 px-3 py-1 text-xs font-bold text-red-700">
                        <FaExclamationTriangle />
                        Urgent
                      </span>
                    )}
                  </div>

                  <h1 className="text-2xl font-bold text-slate-900 md:text-3xl">
                    {job.title}
                  </h1>

                  <p className="mt-2 flex items-center gap-2 text-sm font-medium text-slate-600">
                    <FaBuilding className="text-[#153497]" />
                    {job.companyName}
                  </p>

                  <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm text-slate-500">

                    <span className="flex items-center gap-2">
                      <FaBriefcase className="text-[#153497]" />
                      {job.jobType?.replaceAll("_", " ")}
                    </span>

                    <span className="flex items-center gap-2">
                      <FaLocationDot className="text-[#153497]" />
                      {job.workMode}
                    </span>

                    <span className="flex items-center gap-2">
                      <FaCalendarAlt className="text-[#153497]" />
                      Posted {formatDate(job.createdAt)}
                    </span>

                  </div>
                </div>
              </div>

              {/* STATS */}
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:min-w-[320px]">

                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-center">
                  <FaEye className="mx-auto mb-2 text-[#153497]" />
                  <p className="text-xl font-bold text-slate-800">
                    {job.views}
                  </p>
                  <p className="text-xs text-slate-500">
                    Views
                  </p>
                </div>

                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-center">
                  <FaUsers className="mx-auto mb-2 text-[#153497]" />
                  <p className="text-xl font-bold text-slate-800">
                    {job.applicationsCount}
                  </p>
                  <p className="text-xs text-slate-500">
                    Applications
                  </p>
                </div>

                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-center">
                  <FaUserTie className="mx-auto mb-2 text-[#153497]" />
                  <p className="text-xl font-bold text-slate-800">
                    {job.vacancies}
                  </p>
                  <p className="text-xs text-slate-500">
                    Vacancies
                  </p>
                </div>

              </div>
            </div>
          </div>
        </div>

        {/* MAIN CONTENT */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">

          {/* LEFT */}
          <div className="space-y-6 lg:col-span-2">

            {/* JOB OVERVIEW */}
            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">

              <h2 className="mb-5 flex items-center gap-2 text-lg font-bold text-slate-900">
                <FaBriefcase className="text-[#153497]" />
                Job Overview
              </h2>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                <InfoBox
                  icon={<FaBriefcase />}
                  label="Job Type"
                  value={job.jobType?.replaceAll("_", " ")}
                />

                <InfoBox
                  icon={<FaLocationDot />}
                  label="Work Mode"
                  value={job.workMode}
                />

                <InfoBox
                  icon={<FaMoneyBillWave />}
                  label="Salary"
                  value={formatSalary()}
                />

                <InfoBox
                  icon={<FaUserTie />}
                  label="Experience"
                  value={`${job.experience?.min} - ${job.experience?.max} Years`}
                />

                <InfoBox
                  icon={<FaGraduationCap />}
                  label="Category"
                  value={job.category?.title || "N/A"}
                />

                <InfoBox
                  icon={<FaGraduationCap />}
                  label="Subcategory"
                  value={job.subcategory?.title || "N/A"}
                />

              </div>
            </section>

            {/* DESCRIPTION */}
            <ContentSection
              title="Job Description"
              content={job.description}
            />

            {/* RESPONSIBILITIES */}
            <ListSection
              title="Responsibilities"
              items={job.responsibilities}
              icon={<FaCheckCircle />}
            />

            {/* REQUIREMENTS */}
            <ListSection
              title="Requirements"
              items={job.requirements}
              icon={<FaCheckCircle />}
            />

            {/* EDUCATION */}
            <ListSection
              title="Education"
              items={job.education}
              icon={<FaGraduationCap />}
            />

            {/* BENEFITS */}
            <ListSection
              title="Benefits"
              items={job.benefits}
              icon={<FaCheckCircle />}
            />

            {/* SKILLS */}
            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">

              <h2 className="mb-5 text-lg font-bold text-slate-900">
                Skills
              </h2>

              <div className="flex flex-wrap gap-2">
                {job.skills?.length ? (
                  job.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="rounded-lg bg-blue-50 px-3 py-2 text-sm font-medium text-[#153497]"
                    >
                      {skill}
                    </span>
                  ))
                ) : (
                  <p className="text-sm text-slate-500">
                    No skills specified
                  </p>
                )}
              </div>

            </section>
               <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">

              <h2 className="mb-5 text-lg font-bold text-slate-900">
                Questions 
              </h2>

              <div className="flex flex-wrap gap-2">
                {job.questions?.length ? (
                  job.questions.map((skill, index) => (
                    <span
                      key={index}
                      className="rounded-lg bg-blue-50 px-3 py-2 text-sm font-medium text-[#153497]"
                    >
                      {skill}
                    </span>
                  ))
                ) : (
                  <p className="text-sm text-slate-500">
                    No Questions specified
                  </p>
                )}
              </div>

            </section>

            
          </div>

          {/* RIGHT SIDEBAR */}
          <div className="space-y-6">

            {/* LOCATION */}
            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

              <h2 className="mb-5 flex items-center gap-2 text-lg font-bold text-slate-900">
                <FaLocationDot className="text-[#153497]" />
                Location
              </h2>

              <div className="space-y-3 text-sm">

                <p className="font-semibold text-slate-800">
                  {job.location?.address}
                </p>

                <p className="text-slate-600">
                  {job.location?.city}, {job.location?.state}
                </p>

                <p className="text-slate-600">
                  {job.location?.country}
                </p>

              </div>
            </section>

            {/* APPLICATION */}
            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

              <h2 className="mb-5 flex items-center gap-2 text-lg font-bold text-slate-900">
                <FaCalendarAlt className="text-[#153497]" />
                Application
              </h2>

              <div className="space-y-4">

                <div>
                  <p className="text-xs font-medium text-slate-500">
                    Application Deadline
                  </p>

                  <p className="mt-1 flex items-center gap-2 text-sm font-semibold text-slate-800">
                    <FaClock className="text-[#153497]" />
                    {formatDate(job.applicationDeadline)}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-medium text-slate-500">
                    Application URL
                  </p>

                  <p className="mt-1 break-all text-sm font-medium text-[#153497]">
                    {job.applicationUrl || "Not provided"}
                  </p>
                </div>

              </div>
            </section>

            {/* COMPANY */}
            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

              <h2 className="mb-5 flex items-center gap-2 text-lg font-bold text-slate-900">
                <FaBuilding className="text-[#153497]" />
                Company
              </h2>

              <div className="space-y-4">

                <div>
                  <p className="text-xs font-medium text-slate-500">
                    Company Name
                  </p>

                  <p className="mt-1 font-semibold text-slate-800">
                    {job.companyName}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-medium text-slate-500">
                    Website
                  </p>

                  <p className="mt-1 flex items-start gap-2 break-all text-sm text-[#153497]">
                    <FaGlobe className="mt-1 shrink-0" />
                    {job.companyWebsite || "Not provided"}
                  </p>
                </div>

              </div>
            </section>

            {/* CONTACT */}
            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

              <h2 className="mb-5 text-lg font-bold text-slate-900">
                Contact Information
              </h2>

              <div className="space-y-4">

                <div className="flex items-start gap-3">

                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-[#153497]">
                    <FaEnvelope />
                  </div>

                  <div className="min-w-0">
                    <p className="text-xs text-slate-500">
                      Email
                    </p>

                    <p className="break-all text-sm font-medium text-slate-800">
                      {job.contactEmail || "Not provided"}
                    </p>
                  </div>

                </div>

                <div className="flex items-start gap-3">

                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-[#153497]">
                    <FaPhone />
                  </div>

                  <div>
                    <p className="text-xs text-slate-500">
                      Phone
                    </p>

                    <p className="text-sm font-medium text-slate-800">
                      {job.contactPhone || "Not provided"}
                    </p>
                  </div>

                </div>

              </div>
            </section>

            {/* META */}
            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

              <h2 className="mb-4 text-lg font-bold text-slate-900">
                Job Information
              </h2>

              <div className="space-y-3 text-sm">

                <div className="flex justify-between gap-4">
                  <span className="text-slate-500">
                    Job ID
                  </span>

                  <span className="break-all text-right font-medium text-slate-700">
                    {job._id}
                  </span>
                </div>

                <div className="flex justify-between gap-4">
                  <span className="text-slate-500">
                    Slug
                  </span>

                  <span className="break-all text-right font-medium text-slate-700">
                    {job.slug}
                  </span>
                </div>

                <div className="flex justify-between gap-4">
                  <span className="text-slate-500">
                    Created
                  </span>

                  <span className="font-medium text-slate-700">
                    {formatDate(job.createdAt)}
                  </span>
                </div>

                <div className="flex justify-between gap-4">
                  <span className="text-slate-500">
                    Last Updated
                  </span>

                  <span className="font-medium text-slate-700">
                    {formatDate(job.updatedAt)}
                  </span>
                </div>

              </div>
            </section>
            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

              <h2 className="mb-4 text-lg font-bold text-slate-900">
                Job Applications
              </h2>
             <div className="flex justify-center">
              <Link href={`/jobs/${id}/applications`} className="bg-green-800 hover:bg-green-700 text-white font-medium  py-2 px-4 rounded-2xl">View All Applications</Link>
             </div>
              
            </section>

          </div>
        </div>
      </div>
    </div>
  );
};

interface InfoBoxProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

const InfoBox = ({
  icon,
  label,
  value,
}: InfoBoxProps) => {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">

      <div className="mb-2 flex items-center gap-2 text-[#153497]">
        {icon}

        <span className="text-xs font-medium text-slate-500">
          {label}
        </span>
      </div>

      <p className="text-sm font-bold capitalize text-slate-800">
        {value}
      </p>

    </div>
  );
};

interface ContentSectionProps {
  title: string;
  content?: string;
}

const ContentSection = ({
  title,
  content,
}: ContentSectionProps) => {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">

      <h2 className="mb-4 text-lg font-bold text-slate-900">
        {title}
      </h2>

      <p className="whitespace-pre-line text-sm leading-7 text-slate-600">
        {content || "No description provided."}
      </p>

    </section>
  );
};

interface ListSectionProps {
  title: string;
  items?: string[];
  icon: React.ReactNode;
}

const ListSection = ({
  title,
  items,
  icon,
}: ListSectionProps) => {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">

      <h2 className="mb-5 text-lg font-bold text-slate-900">
        {title}
      </h2>

      {items?.length ? (
        <ul className="space-y-3">

          {items.map((item, index) => (
            <li
              key={index}
              className="flex items-start gap-3 text-sm leading-6 text-slate-600"
            >
              <span className="mt-1.5 shrink-0 text-[#153497]">
                {icon}
              </span>

              <span>{item}</span>
            </li>
          ))}

        </ul>
      ) : (
        <p className="text-sm text-slate-500">
          No information provided.
        </p>
      )}

    </section>
  );
};

export default JobDetailsPage;

