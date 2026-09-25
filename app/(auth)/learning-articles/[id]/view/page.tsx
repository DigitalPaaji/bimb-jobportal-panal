"use client";

import { base_url, img_url } from "@/components/store/config";
import axios, { AxiosError } from "axios";
import { useParams } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";
import {
  FaCalendarAlt,
  FaEye,
  FaFolderOpen,
  FaTags,
} from "react-icons/fa";
import { MdOutlineArticle } from "react-icons/md";

axios.defaults.withCredentials = true;

// ============================================================
// TYPES
// ============================================================

interface ArticleSection {
  _id?: string;
  title?: string;
  des?: string;
  color?: string;
  image?: string | null;
}

interface Article {
  _id: string;
  title?: string;
  shortDescription?: string;
  category?: string;
  status?: string;
  thumbnail?: string | null;
  tags?: string[];
  views?: number;
  createdAt?: string;
  updatedAt?: string;
  content?: ArticleSection[];
}

interface ArticleResponse {
  success: boolean;
  message?: string;
  data?: Article;
}

interface ErrorResponse {
  message?: string;
}

// ============================================================
// COMPONENT
// ============================================================

const ArticleViewPage = () => {
  const params = useParams<{ id: string }>();
  const id = params?.id;

  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // ============================================================
  // FETCH ARTICLE
  // ============================================================

  const fetchData = useCallback(async (): Promise<void> => {
    if (!id) return;

    try {
      setLoading(true);

      const response = await axios.get<ArticleResponse>(
        `${base_url}/article/get-article/${id}`,
        {
          withCredentials: true,
        }
      );

      const data = response.data;

      if (data.success && data.data) {
        setArticle(data.data);
      } else {
        setArticle(null);
      }
    } catch (error: unknown) {
      const axiosError = error as AxiosError<ErrorResponse>;

      console.error(
        "Failed to fetch article:",
        axiosError.response?.data?.message || error
      );

      setArticle(null);
    } finally {
      setLoading(false);
    }
  }, [id]);

  // ============================================================
  // EFFECT
  // ============================================================

  useEffect(() => {
    if (id) {
      fetchData();
    }
  }, [id, fetchData]);

  // ============================================================
  // IMAGE URL
  // ============================================================

  const getImageUrl = (url?: string | null): string => {
    if (!url) return "";

    if (url.startsWith("http://") || url.startsWith("https://")) {
      return url;
    }

    return `${img_url}${url}`;
  };

  // ============================================================
  // LOADING
  // ============================================================

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 transition-colors duration-300 ">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-blue-500  " />

          <p className="text-sm font-medium text-gray-600 ">
            Loading article...
          </p>
        </div>
      </div>
    );
  }

  // ============================================================
  // ARTICLE NOT FOUND
  // ============================================================

  if (!article) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 transition-colors duration-300 ">
        <MdOutlineArticle className="mb-4 text-6xl text-gray-400 " />

        <h2 className="text-2xl font-bold text-gray-700 ">
          Article not found
        </h2>

        <p className="mt-2 text-sm text-gray-500 ">
          The article you are looking for does not exist.
        </p>
      </div>
    );
  }

  // ============================================================
  // MAIN
  // ============================================================

  return (
    <div className="h-screen overflow-auto bg-gray-50 p-4 transition-colors duration-300  md:p-8">
      {/* ========================================================
          MAIN PANEL
      ========================================================= */}

      <div className="mx-auto max-w-5xl overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-lg transition-colors duration-300  ">
        {/* ======================================================
            THUMBNAIL
        ======================================================= */}

        {article.thumbnail && (
          <div className="relative h-64 w-full overflow-hidden md:h-96">
            <img
              src={getImageUrl(article.thumbnail)}
              alt={article.title || "Article"}
              className="h-full w-full object-cover"
            />

            {/* Status */}
            {article.status && (
              <div className="absolute right-4 top-4 rounded-full border border-white/20 bg-black/60 px-3 py-1 text-sm font-semibold text-white shadow-lg backdrop-blur-sm">
                {article.status}
              </div>
            )}
          </div>
        )}

        {/* ======================================================
            CONTENT BODY
        ======================================================= */}

        <div className="p-6 md:p-10">
          {/* ====================================================
              META INFORMATION
          ===================================================== */}

          <div className="mb-5 flex flex-wrap items-center gap-3 text-sm text-gray-600 ">
            {/* Category */}
            <div className="flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1.5 ">
              <FaFolderOpen className="text-blue-500" />

              <span>
                {article.category || "Uncategorized"}
              </span>
            </div>

            {/* Date */}
            {article.createdAt && (
              <div className="flex items-center gap-1.5">
                <FaCalendarAlt className="text-gray-400" />

                <span>
                  {new Date(article.createdAt).toLocaleDateString(
                    "en-US",
                    {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    }
                  )}
                </span>
              </div>
            )}

            {/* Views */}
            <div className="flex items-center gap-1.5">
              <FaEye className="text-gray-400" />

              <span>
                {(article.views ?? 0).toLocaleString()} Views
              </span>
            </div>
          </div>

          {/* ====================================================
              TITLE
          ===================================================== */}

          <h1 className="mb-6 text-3xl font-extrabold leading-tight text-gray-900 md:text-5xl">
            {article.title || "Untitled Article"}
          </h1>

          {/* ====================================================
              SHORT DESCRIPTION
          ===================================================== */}

          {article.shortDescription && (
            <div className="mb-10 rounded-r-lg border-l-4 border-blue-500 bg-gray-50 py-2 pl-4 text-lg italic text-gray-700  ">
              {article.shortDescription}
            </div>
          )}

          <hr className="mb-10 border-gray-200 " />

          {/* ====================================================
              ARTICLE CONTENT
          ===================================================== */}

          <div className="space-y-12">
            {article.content && article.content.length > 0 ? (
              article.content.map(
                (section: ArticleSection, index: number) => (
                  <article
                    key={section._id || index}
                    className="flex flex-col gap-6"
                  >
                    {/* ==========================================
                        SECTION HEADER
                    =========================================== */}

                    <div className="flex items-center gap-3">
                      <div
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white shadow-sm"
                        style={{
                          backgroundColor:
                            section.color || "#3b82f6",
                        }}
                      >
                        {index + 1}
                      </div>

                      <h2 className="text-2xl font-bold text-gray-800 ">
                        {section.title || "Untitled Section"}
                      </h2>
                    </div>

                    {/* ==========================================
                        SECTION BODY
                    =========================================== */}

                    <div
                      className={`grid grid-cols-1 items-start gap-8 ${
                        section.image
                          ? "lg:grid-cols-2"
                          : "grid-cols-1"
                      }`}
                    >
                      {/* Rich Text */}
                      <div
                        className=" text-gray-700 text-base leading-7 break-words
  [&_h1]:text-3xl [&_h1]:font-bold [&_h1]:text-gray-900 [&_h1]:mb-4
  [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:text-gray-900 [&_h2]:mt-8 [&_h2]:mb-3
  [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:text-gray-800 [&_h3]:mt-6 [&_h3]:mb-2
  [&_p]:mb-4
  [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-4 [&_ul]:space-y-1
  [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-4 [&_ol]:space-y-1
  [&_a]:text-blue-600 [&_a]:underline
  [&_img]:max-w-full [&_img]:rounded-lg [&_img]:my-4
  [&_table]:w-full [&_table]:border [&_th]:border [&_td]:border [&_th]:p-2 [&_td]:p-2"
                        dangerouslySetInnerHTML={{
                          __html: section.des || "",
                        }}
                      />

                      {/* Section Image */}
                      {section.image && (
                        <div className="overflow-hidden rounded-xl border border-gray-100 shadow-md ">
                          <img
                            src={getImageUrl(section.image)}
                            alt={
                              section.title ||
                              "Article section"
                            }
                            className="h-auto w-full object-cover transition-transform duration-500 hover:scale-105"
                          />
                        </div>
                      )}
                    </div>
                  </article>
                )
              )
            ) : (
              <div className="py-12 text-center">
                <MdOutlineArticle className="mx-auto mb-4 text-5xl text-gray-300 " />

                <h3 className="text-lg font-bold text-gray-700 ">
                  No content available
                </h3>

                <p className="mt-2 text-sm text-gray-500 ">
                  This article does not have any content sections yet.
                </p>
              </div>
            )}
          </div>

          {/* ====================================================
              TAGS
          ===================================================== */}

          {article.tags && article.tags.length > 0 && (
            <div className="mt-12 border-t border-gray-200 pt-6 ">
              <div className="mb-3 flex items-center gap-2 font-semibold text-gray-800 ">
                <FaTags />

                <h3>Tags</h3>
              </div>

              <div className="flex flex-wrap gap-2">
                {article.tags.map(
                  (tag: string, index: number) => (
                    <span
                      key={`${tag}-${index}`}
                      className="cursor-pointer rounded-md border border-gray-200 bg-gray-100 px-3 py-1 text-sm text-gray-700 transition-colors hover:bg-gray-200 "
                    >
                      #{tag}
                    </span>
                  )
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ArticleViewPage;
