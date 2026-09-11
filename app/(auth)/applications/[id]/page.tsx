"use client";

import { base_url, img_url } from "@/components/store/config";
import axios from "axios";
import Link from "next/link";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import {
  FiArrowLeft,
  FiBriefcase,
  FiCalendar,
  FiCheckCircle,
  FiClock,
  FiEdit3,
  FiExternalLink,
  FiFileText,
  FiGlobe,
  FiMapPin,
  FiMail,
  FiPhone,
  FiSave,
  FiUser,
  FiVideo,
  FiXCircle,
} from "react-icons/fi";
import { toast } from "react-toastify";

axios.defaults.withCredentials = true;

const statuses = [
  "APPLIED",
  "SHORTLISTED",
  "INTERVIEW",
  "SELECTED",
  "REJECTED",
  "WITHDRAWN",
];

type ApplicationData = any;

const Page = () => {
  const { id } = useParams();

  const [application, setApplication] = useState<ApplicationData>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    status: "APPLIED",
    recruiterNote: "",

    shortlistedAt: "",
    interviewedAt: "",
    selectedAt: "",
    rejectedAt: "",
    withdrawnAt: "",

    interviewDate: "",
    interviewMode: "",
    meetingLink: "",
    location: "",
    interviewNote: "",
  });

  const fetchApplication = async () => {
    try {
      setLoading(true);

      const response = await axios.get(
        `${base_url}/job/application/${id}`
      );

      const data = response.data;

      if (data.success) {
        setApplication(data.data);

        const app = data.data;

        setForm({
          status: app.status || "APPLIED",
          recruiterNote: app.recruiterNote || "",

          shortlistedAt: formatDateForInput(app.shortlistedAt),
          interviewedAt: formatDateForInput(app.interviewedAt),
          selectedAt: formatDateForInput(app.selectedAt),
          rejectedAt: formatDateForInput(app.rejectedAt),
          withdrawnAt: formatDateForInput(app.withdrawnAt),

          interviewDate: formatDateForInput(app.interview?.date),
          interviewMode: app.interview?.mode || "",
          meetingLink: app.interview?.meetingLink || "",
          location: app.interview?.location || "",
          interviewNote: app.interview?.note || "",
        });
      }
    } catch (error: any) {
      console.error(error);

      toast.error(
        error?.response?.data?.message ||
          "Failed to fetch application"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchApplication();
    }
  }, [id]);

  const updateForm = (key: string, value: string) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const saveApplication = async () => {
    try {
      setSaving(true);

      const payload = {
        status: form.status,

        recruiterNote: form.recruiterNote,

        shortlistedAt: form.shortlistedAt || null,
        interviewedAt: form.interviewedAt || null,
        selectedAt: form.selectedAt || null,
        rejectedAt: form.rejectedAt || null,
        withdrawnAt: form.withdrawnAt || null,

        interview: {
          date: form.interviewDate || null,
          mode: form.interviewMode || null,
          meetingLink: form.meetingLink || "",
          location: form.location || "",
          note: form.interviewNote || "",
        },
      };

      const response = await axios.put(
        `${base_url}/job/application/${id}`,
        payload
      );

      if (response.data.success) {
        toast.success("Application updated successfully");

        setApplication(response.data.data);
      }
    } catch (error: any) {
      console.error(error);

      toast.error(
        error?.response?.data?.message ||
          "Failed to update application"
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (!application) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <FiXCircle className="mx-auto text-4xl text-red-400" />

          <h2 className="mt-4 text-xl font-semibold text-slate-800">
            Application not found
          </h2>
        </div>
      </div>
    );
  }

  const user = application.userId;
  const job = application.jobId;

  return (
    <div className="h-screen overflow-auto bg-slate-50 p-4 md:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

          <div className="flex items-center gap-3">
            <button
              onClick={() => window.history.back()}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-100"
            >
              <FiArrowLeft />
            </button>

            <div>
              <p className="text-sm text-slate-500">
                Application Details
              </p>

              <h1 className="text-xl font-bold text-slate-900">
                {job?.title}
              </h1>
            </div>
          </div>

          <button
            onClick={saveApplication}
            disabled={saving}
            className="flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <FiSave />

            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">

          {/* LEFT */}
          <div className="space-y-6 xl:col-span-2">

            {/* Candidate */}
            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

              <SectionTitle
                icon={<FiUser />}
                title="Candidate Information"
              />

              <div className="mt-5 flex flex-col gap-5 sm:flex-row">

                <div className="shrink-0">
                  {user?.image ? (
                    <img
                      src={`${img_url}${user.image}`}
                      alt={user.fullname}
                      className="h-24 w-24 rounded-2xl object-cover ring-4 ring-slate-100"
                    />
                  ) : (
                    <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-slate-100 text-3xl font-bold text-slate-400">
                      {user?.fullname?.charAt(0)}
                    </div>
                  )}
                </div>

                <div className="grid flex-1 grid-cols-1 gap-4 sm:grid-cols-2">

                  <InfoItem
                    icon={<FiUser />}
                    label="Full Name"
                    value={user?.fullname}
                  />

                  <InfoItem
                    icon={<FiMail />}
                    label="Email"
                    value={user?.email}
                  />

                  <InfoItem
                    icon={<FiPhone />}
                    label="Phone"
                    value={user?.phone}
                  />

                  <InfoItem
                    icon={<FiUser />}
                    label="Gender"
                    value={user?.gender}
                  />

                  <InfoItem
                    icon={<FiCalendar />}
                    label="Date of Birth"
                    value={
                      user?.dateOfBirth
                        ? formatDate(user.dateOfBirth)
                        : "Not provided"
                    }
                  />

                  <InfoItem
                    icon={<FiMapPin />}
                    label="Address"
                    value={user?.address}
                  />

                </div>
                
              </div>
              <div className="flex justify-center py-2">
                <Link href={`/candidates/${user._id}`} className="bg-green-800  hover:bg-green-700 h-fit px-5 py-1 text-white rounded-lg font-medium ">View </Link>

              </div>
              
            </section>

            {/* Job */}
            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

              <SectionTitle
                icon={<FiBriefcase />}
                title="Job Information"
              />

              <div className="mt-5">
<div className="flex justify-between">
                <div className="flex gap-4">

                  {job?.companyLogo && (
                    <img
                      src={`${img_url}${job.companyLogo}`}
                      alt={job.companyName}
                      className="h-16 w-16 rounded-xl border border-slate-200 object-cover"
                    />
                  )}

                  <div>
                    <h2 className="text-lg font-bold text-slate-900">
                      {job?.title}
                    </h2>

                    <p className="text-sm text-slate-500">
                      {job?.companyName}
                    </p>
                  </div>
                </div>
<Link href={`/jobs/${job._id}/view`} className="bg-green-800  hover:bg-green-700 h-fit px-5 py-1 text-white rounded-lg font-medium ">View </Link>
                </div>

                <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-4">

                  <SmallBox
                    label="Job Type"
                    value={formatLabel(job?.jobType)}
                  />

                  <SmallBox
                    label="Work Mode"
                    value={formatLabel(job?.workMode)}
                  />

                  <SmallBox
                    label="Vacancies"
                    value={job?.vacancies}
                  />

                  <SmallBox
                    label="Applications"
                    value={job?.applicationsCount}
                  />

                </div>

                <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">

                  <SmallBox
                    label="Category"
                    value={
                      job?.category?.name ||
                      job?.category?.slug ||
                      "N/A"
                    }
                  />

                  <SmallBox
                    label="Subcategory"
                    value={
                      job?.subcategory?.name ||
                      job?.subcategory?.slug ||
                      "N/A"
                    }
                  />

                </div>

                {job?.companyWebsite && (
                  <a
                    href={
                      job.companyWebsite.startsWith("http")
                        ? job.companyWebsite
                        : `https://${job.companyWebsite}`
                    }
                    target="_blank"
                    className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:underline"
                  >
                    <FiGlobe />
                    Company Website
                    <FiExternalLink />
                  </a>
                )}
              </div>
            </section>

            {/* Resume / Cover Letter */}
            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

              <SectionTitle
                icon={<FiFileText />}
                title="Application Documents"
              />

              <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">

                <a
                  href={`${base_url}${application.resume}`}
                  target="_blank"
                  className="flex items-center justify-between rounded-xl border border-slate-200 p-4 transition hover:border-slate-400 hover:bg-slate-50"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50 text-red-500">
                      <FiFileText />
                    </div>

                    <div>
                      <p className="font-semibold text-slate-800">
                        Resume
                      </p>

                      <p className="text-xs text-slate-500">
                        View candidate resume
                      </p>
                    </div>
                  </div>

                  <FiExternalLink className="text-slate-400" />
                </a>

                <div className="rounded-xl border border-slate-200 p-4">

                  <p className="mb-2 text-sm font-semibold text-slate-800">
                    Cover Letter
                  </p>

                  <p className="whitespace-pre-wrap text-sm leading-6 text-slate-600">
                    {application.coverLetter ||
                      "No cover letter provided."}
                  </p>

                </div>
              </div>
            </section>

            {/* Interview */}
            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

              <SectionTitle
                icon={<FiVideo />}
                title="Interview Details"
              />

              <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">

                <Input
                  label="Interview Date & Time"
                  type="datetime-local"
                  value={form.interviewDate}
                  onChange={(e) =>
                    updateForm(
                      "interviewDate",
                      e.target.value
                    )
                  }
                />

                <Select
                  label="Interview Mode"
                  value={form.interviewMode}
                  onChange={(e) =>
                    updateForm(
                      "interviewMode",
                      e.target.value
                    )
                  }
                >
                  <option value="">Select mode</option>
                  <option value="ONLINE">Online</option>
                  <option value="OFFLINE">Offline</option>
                </Select>

                <Input
                  label="Meeting Link"
                  placeholder="https://meet.google.com/..."
                  value={form.meetingLink}
                  onChange={(e) =>
                    updateForm(
                      "meetingLink",
                      e.target.value
                    )
                  }
                />

                <Input
                  label="Location"
                  placeholder="Interview location"
                  value={form.location}
                  onChange={(e) =>
                    updateForm(
                      "location",
                      e.target.value
                    )
                  }
                />

                <div className="md:col-span-2">
                  <TextArea
                    label="Interview Note"
                    placeholder="Add interview instructions or notes..."
                    value={form.interviewNote}
                    onChange={(e) =>
                      updateForm(
                        "interviewNote",
                        e.target.value
                      )
                    }
                  />
                </div>

              </div>
            </section>

            {/* Recruiter Note */}
            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

              <SectionTitle
                icon={<FiEdit3 />}
                title="Recruiter Note"
              />

              <div className="mt-5">
                <TextArea
                  label=""
                  placeholder="Write internal recruiter notes..."
                  rows={6}
                  value={form.recruiterNote}
                  onChange={(e) =>
                    updateForm(
                      "recruiterNote",
                      e.target.value
                    )
                  }
                />
              </div>
            </section>

          </div>

          {/* RIGHT */}
          <div className="space-y-6">

            {/* Status */}
            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

              <SectionTitle
                icon={<FiCheckCircle />}
                title="Application Status"
              />

              <div className="mt-5">

                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Current Status
                </label>

                <select
                  value={form.status}
                  onChange={(e) =>
                    updateForm("status", e.target.value)
                  }
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-100"
                >
                  {statuses.map((status) => (
                    <option key={status} value={status}>
                      {formatLabel(status)}
                    </option>
                  ))}
                </select>

                <StatusBadge status={form.status} />

              </div>
            </section>

            {/* Timeline */}
            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

              <SectionTitle
                icon={<FiClock />}
                title="Application Timeline"
              />

              <div className="mt-5 space-y-4">

                <DateInput
                  label="Shortlisted At"
                  value={form.shortlistedAt}
                  onChange={(value) =>
                    updateForm("shortlistedAt", value)
                  }
                />

                <DateInput
                  label="Interviewed At"
                  value={form.interviewedAt}
                  onChange={(value) =>
                    updateForm("interviewedAt", value)
                  }
                />

                <DateInput
                  label="Selected At"
                  value={form.selectedAt}
                  onChange={(value) =>
                    updateForm("selectedAt", value)
                  }
                />

                <DateInput
                  label="Rejected At"
                  value={form.rejectedAt}
                  onChange={(value) =>
                    updateForm("rejectedAt", value)
                  }
                />

                <DateInput
                  label="Withdrawn At"
                  value={form.withdrawnAt}
                  onChange={(value) =>
                    updateForm("withdrawnAt", value)
                  }
                />

              </div>
            </section>

            {/* Application Info */}
            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

              <SectionTitle
                icon={<FiCalendar />}
                title="Application Info"
              />

              <div className="mt-5 space-y-4">

                <InfoRow
                  label="Applied At"
                  value={formatDate(application.appliedAt)}
                />

                <InfoRow
                  label="Created At"
                  value={formatDate(application.createdAt)}
                />

                <InfoRow
                  label="Updated At"
                  value={formatDate(application.updatedAt)}
                />

                <InfoRow
                  label="Application ID"
                  value={application._id}
                />

              </div>
            </section>

          </div>
        </div>
      </div>
    </div>
  );
};

const SectionTitle = ({
  icon,
  title,

}: {
  icon: React.ReactNode;
  title: string;

}) => {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
        {icon}
      </div>

      <h2 className="font-bold text-slate-900">
        {title}
      </h2>
    </div>
  );
};

const InfoItem = ({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: any;
}) => {
  return (
    <div>
      <div className="mb-1 flex items-center gap-2 text-xs text-slate-400">
        {icon}
        {label}
      </div>

      <p className="break-words text-sm font-medium text-slate-800">
        {value || "Not provided"}
      </p>
    </div>
  );
};

const InfoRow = ({
  label,
  value,
}: {
  label: string;
  value: any;
}) => {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-3 last:border-0">
      <span className="text-sm text-slate-500">
        {label}
      </span>

      <span className="max-w-[60%] break-all text-right text-sm font-medium text-slate-800">
        {value || "—"}
      </span>
    </div>
  );
};

const SmallBox = ({
  label,
  value,
}: {
  label: string;
  value: any;
}) => {
  return (
    <div className="rounded-xl bg-slate-50 p-3">
      <p className="text-xs text-slate-400">
        {label}
      </p>

      <p className="mt-1 text-sm font-semibold text-slate-800">
        {value || "—"}
      </p>
    </div>
  );
};

const Input = ({
  label,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
}) => {
  return (
    <div>
      {label && (
        <label className="mb-2 block text-sm font-medium text-slate-700">
          {label}
        </label>
      )}

      <input
        {...props}
        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-slate-500 focus:ring-2 focus:ring-slate-100"
      />
    </div>
  );
};

const Select = ({
  label,
  children,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement> & {
  label: string;
}) => {
  return (
    <div>
      {label && (
        <label className="mb-2 block text-sm font-medium text-slate-700">
          {label}
        </label>
      )}

      <select
        {...props}
        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-100"
      >
        {children}
      </select>
    </div>
  );
};

const TextArea = ({
  label,
  rows = 4,
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label: string;
}) => {
  return (
    <div>
      {label && (
        <label className="mb-2 block text-sm font-medium text-slate-700">
          {label}
        </label>
      )}

      <textarea
        {...props}
        rows={rows}
        className="w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-slate-500 focus:ring-2 focus:ring-slate-100"
      />
    </div>
  );
};

const DateInput = ({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) => {
  return (
    <Input
      label={label}
      type="datetime-local"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  );
};

const StatusBadge = ({ status }: { status: string }) => {
  const classes: Record<string, string> = {
    APPLIED:
      "bg-blue-50 text-blue-700 border-blue-100",

    SHORTLISTED:
      "bg-purple-50 text-purple-700 border-purple-100",

    INTERVIEW:
      "bg-amber-50 text-amber-700 border-amber-100",

    SELECTED:
      "bg-emerald-50 text-emerald-700 border-emerald-100",

    REJECTED:
      "bg-red-50 text-red-700 border-red-100",

    WITHDRAWN:
      "bg-slate-100 text-slate-600 border-slate-200",
  };

  return (
    <div
      className={`mt-4 inline-flex rounded-full border px-3 py-1.5 text-xs font-bold ${
        classes[status] ||
        "bg-slate-100 text-slate-600 border-slate-200"
      }`}
    >
      {formatLabel(status)}
    </div>
  );
};

const Loading = () => {
  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-7xl animate-pulse space-y-6">

        <div className="h-12 w-72 rounded-xl bg-slate-200" />

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">

          <div className="space-y-6 xl:col-span-2">
            <div className="h-64 rounded-2xl bg-white" />
            <div className="h-64 rounded-2xl bg-white" />
            <div className="h-52 rounded-2xl bg-white" />
          </div>

          <div className="space-y-6">
            <div className="h-48 rounded-2xl bg-white" />
            <div className="h-96 rounded-2xl bg-white" />
          </div>

        </div>
      </div>
    </div>
  );
};

const formatLabel = (value?: string) => {
  if (!value) return "N/A";

  return value
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

const formatDate = (date?: string) => {
  if (!date) return "Not provided";

  return new Date(date).toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });
};

const formatDateForInput = (date?: string) => {
  if (!date) return "";

  const d = new Date(date);

  if (Number.isNaN(d.getTime())) return "";

  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const hours = String(d.getHours()).padStart(2, "0");
  const minutes = String(d.getMinutes()).padStart(2, "0");

  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

export default Page;