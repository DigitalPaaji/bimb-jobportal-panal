"use client";

import axios from "axios";
import React, {
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  FiEye,
  FiEdit2,
  FiTrash2,
  FiSearch,
  FiPlus,
} from "react-icons/fi";
import { MdWorkOutline } from "react-icons/md";
import Link from "next/link";
import { FcApproval, FcCancel } from "react-icons/fc";
import { base_url ,img_url} from "./store/config";

interface GetNewsProps {
  setShowCreate: React.Dispatch<React.SetStateAction<boolean>>;
}

interface News {
  _id: string;
  title?: string;
  featuredImage?: string;
  publicationDate?: string;
  category?: string;
  rejected?: boolean;
}

interface NewsResponse {
  success?: boolean;
  message?: string;
  news?: News[];
}

const GetNews = ({
  setShowCreate,
}: GetNewsProps) => {
  const [jobs, setJobs] = useState<News[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>("");

  const fetchJobs = async (): Promise<void> => {
    try {
      setLoading(true);

      const response = await axios.get<NewsResponse>(
        `${base_url}/news/get`,
        {
          withCredentials: true,
        }
      );

      const data = response.data;

      setJobs(data?.news || []);
    } catch (error: unknown) {
      console.error("Failed to fetch news:", error);
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const filteredJobs = useMemo(() => {
    if (!search.trim()) {
      return jobs;
    }

    const searchText = search.toLowerCase().trim();

    return jobs.filter((job) => {
      const title = job?.title?.toLowerCase() || "";
      const category = job?.category?.toLowerCase() || "";

      return (
        title.includes(searchText) ||
        category.includes(searchText)
      );
    });
  }, [jobs, search]);

  const handleDelete = async (
    id: string
  ): Promise<void> => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this news?"
    );

    if (!confirmDelete) return;

    try {
      await axios.delete(
        `${base_url}/news/delete/${id}`,
        {
          withCredentials: true,
        }
      );

      setJobs((prev) =>
        prev.filter((job) => job._id !== id)
      );
    } catch (error: unknown) {
      console.error("Delete news error:", error);
    }
  };

  return (
    <div className="w-full min-h-screen bg-white text-black p-4 sm:p-6">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">

        <div>
          <div className="flex items-center gap-3">

            <div className="w-10 h-10 rounded-xl border border-black flex items-center justify-center">
              <MdWorkOutline size={22} />
            </div>

            <div>
              <h1 className="text-2xl sm:text-3xl font-bold">
                News
              </h1>

              <p className="text-sm text-gray-500 mt-1">
                Manage all your news postings
              </p>
            </div>
          </div>
        </div>

        {/* Add News */}
        <button
          type="button"
          onClick={() => setShowCreate(true)}
          className="
            inline-flex items-center justify-center gap-2
            px-5 py-3 rounded-xl
            bg-black text-white
            font-semibold
            hover:opacity-80
            transition
          "
        >
          <FiPlus size={18} />
          Add News
        </button>
      </div>

      {/* Search */}
      <div className="mb-5">
        <div className="relative max-w-md">

          <FiSearch
            size={18}
            className="
              absolute left-4 top-1/2
              -translate-y-1/2
              text-gray-500
            "
          />

          <input
            type="text"
            placeholder="Search news..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            className="
              w-full
              h-12
              pl-11 pr-4
              rounded-xl
              border border-gray-200
              bg-white
              text-black
              placeholder:text-gray-400
              outline-none
              focus:border-black
              transition
            "
          />

        </div>
      </div>

      {/* Table */}
      <div
        className="
          w-full
          overflow-hidden
          rounded-2xl
          border border-gray-200
          bg-white
        "
      >
        <div className="overflow-x-auto">

          <table className="w-full min-w-[850px] text-sm">

            <thead>
              <tr
                className="
                  border-b border-gray-200
                  bg-gray-50
                "
              >
                <th className="px-5 py-4 text-left font-semibold">
                  #
                </th>

                <th className="px-5 py-4 text-left font-semibold">
                  Image
                </th>

                <th className="px-5 py-4 text-left font-semibold">
                  News Title
                </th>

                <th className="px-5 py-4 text-left font-semibold">
                  Publication Date
                </th>

                <th className="px-5 py-4 text-center font-semibold">
                  Category
                </th>

                <th className="px-5 py-4 text-center font-semibold">
                  Status
                </th>

                <th className="px-5 py-4 text-center font-semibold">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>

              {/* Loading */}
              {loading ? (
                <tr>
                  <td
                    colSpan={7}
                    className="
                      px-5 py-12
                      text-center
                      text-gray-500
                    "
                  >
                    Loading news...
                  </td>
                </tr>
              ) : filteredJobs.length === 0 ? (
                /* Empty */
                <tr>
                  <td
                    colSpan={7}
                    className="
                      px-5 py-12
                      text-center
                      text-gray-500
                    "
                  >
                    No news found
                  </td>
                </tr>
              ) : (
                /* News List */
                filteredJobs.map((job, index) => (
                  <tr
                    key={job._id}
                    className="
                      border-b
                      last:border-b-0
                      border-gray-100
                      hover:bg-gray-50
                      transition
                    "
                  >

                    {/* Number */}
                    <td className="px-5 py-4 text-gray-500">
                      {index + 1}
                    </td>

                    {/* Image */}
                    <td className="px-5 py-4">

                      {job.featuredImage ? (
                        <img
                          src={`${img_url}${job.featuredImage}`}
                          alt={job.title || "News"}
                          className="
                            h-20
                            w-28
                            object-cover
                            rounded-lg
                            border
                            border-gray-200
                          "
                        />
                      ) : (
                        <div
                          className="
                            h-20
                            w-28
                            rounded-lg
                            border
                            border-gray-200
                            flex
                            items-center
                            justify-center
                            text-xs
                            text-gray-400
                          "
                        >
                          No Image
                        </div>
                      )}

                    </td>

                    {/* Title */}
                    <td className="px-5 py-4">

                      <div className="font-semibold">
                        {job?.title || "Untitled News"}
                      </div>

                      <div className="text-xs text-gray-400 mt-1">
                        ID: {job?._id}
                      </div>

                    </td>

                    {/* Publication Date */}
                    <td className="px-5 py-4">

                      <span className="text-gray-700">
                        {job?.publicationDate
                          ? new Date(
                              job.publicationDate
                            ).toLocaleString("en-IN", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })
                          : "-"}
                      </span>

                    </td>

                    {/* Category */}
                    <td className="px-5 py-4 text-center">
                      {job?.category || "-"}
                    </td>

                    {/* Status */}
                    <td className="px-5 py-4 text-center">

                      <div className="flex justify-center">
                        {job?.rejected ? (
                          <FcCancel size={28} />
                        ) : (
                          <FcApproval size={28} />
                        )}
                      </div>

                    </td>

                    {/* Actions */}
                    <td className="px-5 py-4">

                      <div className="flex items-center justify-center gap-2">

                        {/* View */}
                        <Link
                          href={`/news/${job._id}/view`}
                          title="View News"
                          className="
                            w-9 h-9
                            flex items-center justify-center
                            rounded-lg
                            border border-gray-200
                            bg-white
                            hover:bg-black
                            hover:text-white
                            transition
                          "
                        >
                          <FiEye size={16} />
                        </Link>

                        {/* Edit */}
                        <Link
                          href={`/news/${job._id}/edit`}
                          title="Edit News"
                          className="
                            w-9 h-9
                            flex items-center justify-center
                            rounded-lg
                            border border-gray-200
                            bg-white
                            hover:bg-black
                            hover:text-white
                            transition
                          "
                        >
                          <FiEdit2 size={16} />
                        </Link>

                        {/* Delete */}
                        <button
                          type="button"
                          title="Delete News"
                          onClick={() =>
                            handleDelete(job._id)
                          }
                          className="
                            w-9 h-9
                            flex items-center justify-center
                            rounded-lg
                            border border-gray-200
                            bg-white
                            hover:bg-black
                            hover:text-white
                            transition
                          "
                        >
                          <FiTrash2 size={16} />
                        </button>

                      </div>

                    </td>

                  </tr>
                ))
              )}

            </tbody>

          </table>

        </div>
      </div>

      {/* Footer */}
      {!loading && filteredJobs.length > 0 && (
        <div className="
          flex
          justify-between
          items-center
          mt-4
          text-sm
          text-gray-500
        ">
          <span>
            Showing {filteredJobs.length} of{" "}
            {jobs.length} news
          </span>
        </div>
      )}

    </div>
  );
};

export default GetNews;
