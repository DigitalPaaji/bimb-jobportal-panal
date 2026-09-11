"use client";

import axios from "axios";
import React, {
  useEffect,
  useState,
  type ChangeEvent,
} from "react";
import {
  FiEye,
  FiEdit2,
  FiFileText,
  FiPlus,
  FiSearch,
} from "react-icons/fi";
import Link from "next/link";
import { base_url, img_url } from "./store/config";

// ==========================================
// TYPES
// ==========================================

interface ArticleCategory {
  _id: string;
  title: string;
}

interface Article {
  _id: string;
  title: string;
  thumbnail?: string;
  category?: string | ArticleCategory;
  status: "PUBLISHED" | "DRAFT" | "REJECTED" | string;
  views: number;
  createdAt?: string;
  updatedAt?: string;
}

interface ArticlesCompoProps {
  setCreateArticle: React.Dispatch<React.SetStateAction<boolean>>;
}

// ==========================================
// COMPONENT
// ==========================================

const ArticlesCompo = ({
  setCreateArticle,
}: ArticlesCompoProps) => {
  const [allArticles, setAllArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>("");

  // ==========================================
  // FETCH ARTICLES
  // ==========================================

  const fetchArticles = async (): Promise<void> => {
    try {
      setLoading(true);

      const response = await axios.get(
        `${base_url}/article/get-all`,
        {
          withCredentials: true,
        }
      );

      const data = response.data;

      if (data.success) {
        setAllArticles(data.data || []);
      } else {
        setAllArticles([]);
      }
    } catch (error: unknown) {
      console.error("Failed to fetch articles:", error);
      setAllArticles([]);
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // INITIAL FETCH
  // ==========================================

  useEffect(() => {
    fetchArticles();
  }, []);

  // ==========================================
  // GET CATEGORY NAME
  // ==========================================

  const getCategoryName = (
    category?: string | ArticleCategory
  ): string => {
    if (!category) return "Uncategorized";

    if (typeof category === "string") {
      return category;
    }

    return category.title;
  };

  // ==========================================
  // SEARCH
  // ==========================================

  const filteredArticles = allArticles.filter(
    (article: Article) => {
      const categoryName = getCategoryName(
        article.category
      );

      return `${article.title} ${categoryName}`
        .toLowerCase()
        .includes(search.toLowerCase());
    }
  );

  // ==========================================
  // STATUS STYLE
  // ==========================================

  const getStatusStyle = (status: string): string => {
    switch (status) {
      case "PUBLISHED":
        return "bg-emerald-100 text-emerald-700  ";

      case "DRAFT":
        return "bg-amber-100 text-amber-700 ";

      case "REJECTED":
        return "bg-red-100 text-red-700 ";

      default:
        return "bg-gray-100 text-gray-700 ";
    }
  };

  // ==========================================
  // SEARCH HANDLER
  // ==========================================

  const handleSearch = (
    e: ChangeEvent<HTMLInputElement>
  ): void => {
    setSearch(e.target.value);
  };

  // ==========================================
  // RENDER
  // ==========================================

  return (
    <div className="w-full min-h-screen bg-gray-50 px-4 py-6 text-gray-900 transition-colors   sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">

        {/* ================= HEADER ================= */}

        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-3">

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-black text-white  ">
                <FiFileText size={21} />
              </div>

              <div>
                <h1 className="text-xl font-semibold sm:text-2xl">
                  My Articles
                </h1>

                <p className="text-sm text-gray-500 ">
                  Manage and monitor your articles
                </p>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setCreateArticle(true)}
            className="flex items-center justify-center gap-2 rounded-xl bg-black px-4 py-2.5 text-sm font-medium text-white transition hover:opacity-90  "
          >
            <FiPlus size={17} />
            Create Article
          </button>
        </div>

        {/* ================= SEARCH ================= */}

        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

          <div className="relative w-full sm:max-w-sm">

            <FiSearch
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              placeholder="Search articles..."
              value={search}
              onChange={handleSearch}
              className="h-11 w-full rounded-xl border border-gray-200 bg-white pl-10 pr-4 text-sm outline-none transition placeholder:text-gray-400 focus:border-gray-400   "
            />

          </div>

          <div className="text-sm text-gray-500 ">
            {filteredArticles.length}{" "}
            {filteredArticles.length === 1
              ? "article"
              : "articles"}
          </div>

        </div>

        {/* ================= TABLE ================= */}

        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm  ">

          <div className="overflow-x-auto">

            <table className="w-full min-w-[800px] text-left">

              {/* ================= TABLE HEADER ================= */}

              <thead>
                <tr className="border-b border-gray-200 bg-gray-50  ">

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500 ">
                    Article
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500 ">
                    Category
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500 ">
                    Status
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500 ">
                    Views
                  </th>

                  <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-gray-500 ">
                    Actions
                  </th>

                </tr>
              </thead>

              {/* ================= TABLE BODY ================= */}

              <tbody className="divide-y divide-gray-100 ">

                {/* ================= LOADING ================= */}

                {loading ? (
                  Array.from({ length: 4 }).map(
                    (_, index) => (
                      <tr key={index}>

                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">

                            <div className="h-12 w-16 animate-pulse rounded-lg bg-gray-200 " />

                            <div className="space-y-2">
                              <div className="h-4 w-40 animate-pulse rounded bg-gray-200 " />

                              <div className="h-3 w-24 animate-pulse rounded bg-gray-200 " />
                            </div>

                          </div>
                        </td>

                        <td className="px-6 py-4">
                          <div className="h-4 w-20 animate-pulse rounded bg-gray-200 " />
                        </td>

                        <td className="px-6 py-4">
                          <div className="h-7 w-20 animate-pulse rounded-full bg-gray-200 " />
                        </td>

                        <td className="px-6 py-4">
                          <div className="h-4 w-12 animate-pulse rounded bg-gray-200 " />
                        </td>

                        <td className="px-6 py-4">
                          <div className="ml-auto h-8 w-20 animate-pulse rounded bg-gray-200 " />
                        </td>

                      </tr>
                    )
                  )
                ) : filteredArticles.length === 0 ? (

                  /* ================= EMPTY ================= */

                  <tr>
                    <td
                      colSpan={5}
                      className="px-6 py-16 text-center"
                    >

                      <div className="flex flex-col items-center justify-center">

                        <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 ">

                          <FiFileText
                            size={24}
                            className="text-gray-400"
                          />

                        </div>

                        <h3 className="font-medium">
                          No articles found
                        </h3>

                        <p className="mt-1 text-sm text-gray-500 ">
                          {search
                            ? "Try a different search term."
                            : "You haven't created any articles yet."}
                        </p>

                      </div>

                    </td>
                  </tr>

                ) : (

                  /* ================= ARTICLES ================= */

                  filteredArticles.map(
                    (article: Article) => (

                      <tr
                        key={article._id}
                        className="group transition hover:bg-gray-50 "
                      >

                        {/* ARTICLE */}

                        <td className="px-6 py-4">

                          <div className="flex items-center gap-4">

                            <div className="h-14 w-20 shrink-0 overflow-hidden rounded-lg bg-gray-100 ">

                              {article.thumbnail ? (
                                <img
                                  src={`${img_url}${article.thumbnail}`}
                                  alt={article.title}
                                  className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                                />
                              ) : (
                                <div className="flex h-full w-full items-center justify-center">
                                  <FiFileText
                                    size={20}
                                    className="text-gray-400"
                                  />
                                </div>
                              )}

                            </div>

                            <div className="min-w-0">

                              <h3 className="max-w-[300px] truncate text-sm font-semibold text-gray-900 ">
                                {article.title}
                              </h3>

                              <p className="mt-1 text-xs text-gray-500 ">
                                ID: {article._id.slice(-8)}
                              </p>

                            </div>

                          </div>

                        </td>

                        {/* CATEGORY */}

                        <td className="px-6 py-4">

                          <span className="rounded-lg bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-700  ">
                            {getCategoryName(article.category)}
                          </span>

                        </td>

                        {/* STATUS */}

                        <td className="px-6 py-4">

                          <span
                            className={`inline-flex rounded-full px-3 py-1.5 text-xs font-semibold ${getStatusStyle(
                              article.status
                            )}`}
                          >
                            {article.status}
                          </span>

                        </td>

                        {/* VIEWS */}

                        <td className="px-6 py-4">

                          <div className="flex items-center gap-2 text-sm text-gray-600 ">

                            <FiEye
                              size={16}
                              className="text-gray-400"
                            />

                            {article.views.toLocaleString()}

                          </div>

                        </td>

                        {/* ACTIONS */}

                        <td className="px-6 py-4">

                          <div className="flex justify-end gap-2">

                            {/* EDIT */}

                            <Link
                              href={`/learning-articles/${article._id}/edit`}
                              className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-600 transition hover:bg-gray-100 hover:text-black  "
                            >
                              <FiEdit2 size={16} />
                            </Link>

                            {/* VIEW */}

                            <Link
                              href={`/learning-articles/${article._id}/view`}
                              className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-600 transition hover:bg-gray-100 hover:text-black  "
                            >
                              <FiEye size={16} />
                            </Link>

                          </div>

                        </td>

                      </tr>
                    )
                  )
                )}

              </tbody>
            </table>

          </div>
        </div>
      </div>
    </div>
  );
};

export default ArticlesCompo;

