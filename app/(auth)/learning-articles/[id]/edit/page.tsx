
"use client";

import { base_url, img_url } from "@/components/store/config";
import axios, { AxiosError } from "axios";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import React, {
  ChangeEvent,
  KeyboardEvent,
  useEffect,
  useState,
} from "react";

import {
  FaCalendarAlt,
  FaEye,
  FaTags,
  FaCameraRetro,
  FaPlus,
  FaArrowLeft,
  FaSave,
  FaPen,
  FaImage,
} from "react-icons/fa";

import {
  FiFileText,
  FiFolder,
  FiX,
  FiEdit3,
} from "react-icons/fi";

import { MdOutlineArticle } from "react-icons/md";
import { RiChatDeleteLine } from "react-icons/ri";
import { toast } from "react-toastify";

axios.defaults.withCredentials = true;





type ArticleStatus = "PUBLISHED" | "DRAFT" | "REJECTED" | string;

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
  status?: ArticleStatus;
  tags?: string[];
  thumbnail?: string | null;
  views?: number;
  createdAt?: string;
  updatedAt?: string;
  content?: ArticleSection[];
}

interface ArticleResponse {
  success: boolean;
  message?: string;
  data?: Article;
  article?: Article;
}

interface ApiErrorResponse {
  message?: string;
}

const categories: string[] = [
  "Information Technology",
  "Software Development",
  "Data Science & Analytics",
  "Engineering",
  "Sales",
  "Marketing",
  "Finance & Accounting",
  "Human Resources",
  "Customer Support",
  "Operations",
  "Business Development",
  "Project Management",
  "Product Management",
  "Design & Creative",
  "Healthcare",
  "Education & Teaching",
  "Legal",
  "Manufacturing",
  "Construction",
  "Architecture",
  "Banking & Insurance",
  "Retail",
  "Hospitality & Travel",
  "Logistics & Supply Chain",
  "Media & Entertainment",
  "Real Estate",
  "Government & Public Sector",
  "Research & Development",
  "Administration",
  "Other"
];



const ArticleViewPage = () => {
  const params = useParams<{ id: string }>();
  const router = useRouter();

  const id = params?.id;



  const [article, setArticle] = useState<Article | null>(null);

  const [loading, setLoading] = useState<boolean>(true);

  const [saving, setSaving] = useState<boolean>(false);

  const [newImage, setNewImage] = useState<File | null>(null);

  const [imagePreview, setImagePreview] =
    useState<string>("");

  const [tagInput, setTagInput] = useState<string>("");



  const fetchData = async (): Promise<void> => {
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

      if (data.success) {
        setArticle(data.data || null);
      } else {
        setArticle(null);

        toast.error(
          data.message || "Failed to load article"
        );
      }
    } catch (error: unknown) {
      console.error(
        "Failed to fetch article:",
        error
      );

      const axiosError =
        error as AxiosError<ApiErrorResponse>;

      toast.error(
        axiosError.response?.data?.message ||
          "Failed to load article"
      );

      setArticle(null);
    } finally {
      setLoading(false);
    }
  };



  useEffect(() => {
    if (id) {
      fetchData();
    }
  }, [id]);



  const getImageUrl = (
    url?: string | null
  ): string => {
    if (!url) return "";

    if (
      url.startsWith("http://") ||
      url.startsWith("https://")
    ) {
      return url;
    }

    return `${img_url}${url}`;
  };

  /* =========================================================
     INPUT CHANGE
  ========================================================= */

  const inputChange = (
    event: ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ): void => {
    const { name, value } = event.target;

    setArticle((previous) => {
      if (!previous) return previous;

      return {
        ...previous,
        [name]: value,
      };
    });
  };

  /* =========================================================
     IMAGE CHANGE
  ========================================================= */

  const handleImageChange = (
    event: ChangeEvent<HTMLInputElement>
  ): void => {
    const file = event.target.files?.[0];

    if (!file) return;

    /* Image validation */

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image.");

      event.target.value = "";

      return;
    }

    /* 5 MB validation */

    if (file.size > 5 * 1024 * 1024) {
      toast.error(
        "Image size must be less than 5MB"
      );

      event.target.value = "";

      return;
    }

    /* Revoke previous preview */

    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }

    const preview = URL.createObjectURL(file);

    setNewImage(file);

    setImagePreview(preview);
  };

  /* =========================================================
     REMOVE NEW IMAGE
  ========================================================= */

  const removeNewImage = (): void => {
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }

    setNewImage(null);

    setImagePreview("");

    const input =
      document.getElementById(
        "article-image"
      ) as HTMLInputElement | null;

    if (input) {
      input.value = "";
    }
  };

  /* =========================================================
     ADD TAG
  ========================================================= */

  const addTag = (): void => {
    if (!article) return;

    const value = tagInput.trim();

    if (!value) return;

    const normalizedTag = value.replace(/^#/, "");

    const currentTags: string[] = Array.isArray(
      article.tags
    )
      ? article.tags
      : [];

    const alreadyExists = currentTags.some(
      (tag: string) =>
        String(tag).toLowerCase() ===
        normalizedTag.toLowerCase()
    );

    if (alreadyExists) {
      toast.info("This tag already exists.");

      setTagInput("");

      return;
    }

    setArticle((previous) => {
      if (!previous) return previous;

      return {
        ...previous,
        tags: [
          ...(previous.tags || []),
          normalizedTag,
        ],
      };
    });

    setTagInput("");
  };

  /* =========================================================
     TAG KEY DOWN
  ========================================================= */

  const handleTagKeyDown = (
    event: KeyboardEvent<HTMLInputElement>
  ): void => {
    if (event.key === "Enter") {
      event.preventDefault();

      addTag();
    }
  };

  /* =========================================================
     REMOVE TAG
  ========================================================= */

  const removeTag = (
    indexToRemove: number
  ): void => {
    setArticle((previous) => {
      if (!previous) return previous;

      return {
        ...previous,
        tags: (previous.tags || []).filter(
          (_tag: string, index: number) =>
            index !== indexToRemove
        ),
      };
    });
  };

  /* =========================================================
     SAVE ARTICLE
  ========================================================= */

  const handelSaveArticle =
    async (): Promise<void> => {
      if (!article || !id) return;

      try {
        setSaving(true);

        const formData = new FormData();

        formData.append(
          "title",
          article.title || ""
        );

        formData.append(
          "shortDescription",
          article.shortDescription || ""
        );

        formData.append(
          "category",
          article.category || ""
        );

        formData.append(
          "status",
          article.status || ""
        );

        formData.append(
          "tags",
          JSON.stringify(article.tags || [])
        );

        /*
         * Only send thumbnail when a new image
         * has actually been selected.
         */

        if (newImage) {
          formData.append(
            "thumbnail",
            newImage
          );
        }

        const response =
          await axios.put<ArticleResponse>(
            `${base_url}/article/update-article/${id}`,
            formData,
            {
              withCredentials: true,
            }
          );

        const data = response.data;

        if (data.success) {
          toast.success(
            data.message ||
              "Article updated successfully"
          );

          setNewImage(null);

          if (imagePreview) {
            URL.revokeObjectURL(imagePreview);
          }

          setImagePreview("");

          /*
           * Backend may return article
           * directly or inside data.
           */

          if (data.article) {
            setArticle(data.article);
          } else if (data.data) {
            setArticle(data.data);
          } else {
            await fetchData();
          }
        } else {
          toast.error(
            data.message ||
              "Failed to update article"
          );
        }
      } catch (error: unknown) {
        console.error(
          "Failed to update article:",
          error
        );

        const axiosError =
          error as AxiosError<ApiErrorResponse>;

        toast.error(
          axiosError.response?.data?.message ||
            "Something went wrong while saving article"
        );
      } finally {
        setSaving(false);
      }
    };

  /* =========================================================
     DELETE ARTICLE
  ========================================================= */

  const handelDeletArticle =
    async (): Promise<void> => {
      if (!id) return;

      const confirmDelete = window.confirm(
        "Are you sure you want to delete this article? This action cannot be undone."
      );

      if (!confirmDelete) return;

      try {
        setSaving(true);

        const response =
          await axios.delete<ArticleResponse>(
            `${base_url}/article/delete/${id}`,
            {
              withCredentials: true,
            }
          );

        const data = response.data;

        if (data.success) {
          toast.success(
            data.message ||
              "Article deleted successfully"
          );

          router.back();
        } else {
          toast.error(
            data.message ||
              "Failed to delete article"
          );
        }
      } catch (error: unknown) {
        console.error(
          "Failed to delete article:",
          error
        );

        const axiosError =
          error as AxiosError<ApiErrorResponse>;

        toast.error(
          axiosError.response?.data?.message ||
            "Failed to delete article"
        );
      } finally {
        setSaving(false);
      }
    };

  /* =========================================================
     LOADING
  ========================================================= */

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white ">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-black border-t-transparent  " />

          <p className="text-sm font-medium text-black ">
            Loading article...
          </p>
        </div>
      </div>
    );
  }

  /* =========================================================
     ARTICLE NOT FOUND
  ========================================================= */

  if (!article) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-white px-4 ">
        <MdOutlineArticle className="mb-5 text-7xl text-black " />

        <h2 className="text-2xl font-bold text-black ">
          Article not found
        </h2>

        <button
          type="button"
          onClick={() => router.back()}
          className="mt-6 inline-flex items-center gap-2 rounded-lg bg-black px-5 py-3 text-sm font-semibold text-white transition hover:bg-gray-800   "
        >
          <FaArrowLeft />
          Go Back
        </button>
      </div>
    );
  }

  /* =========================================================
     CURRENT IMAGE
  ========================================================= */

  const currentImage =
    imagePreview ||
    getImageUrl(article.thumbnail);

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <div className="h-screen overflow-auto bg-white text-black  ">
      {/* =====================================================
          HEADER
      ====================================================== */}

      <div className="sticky top-0 z-30 border-b border-gray-200 bg-white/95 backdrop-blur  /95">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 md:px-8">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => router.back()}
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-300 text-black transition hover:bg-black hover:text-white    "
            >
              <FaArrowLeft />
            </button>

            <div>
              <h1 className="text-lg font-bold md:text-xl">
                Edit Article
              </h1>

              <p className="hidden text-xs text-gray-500 sm:block">
                Manage article information
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handelSaveArticle}
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-lg bg-black px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50   "
          >
            {saving ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent  " />
                Saving...
              </>
            ) : (
              <>
                <FaSave />
                Save Changes
              </>
            )}
          </button>
        </div>
      </div>

      {/* =====================================================
          MAIN
      ====================================================== */}

      <main className="mx-auto max-w-7xl px-4 py-6 md:px-8 md:py-10">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_340px]">
          {/* =================================================
              LEFT
          ================================================== */}

          <div className="space-y-8">
            {/* ===============================================
                THUMBNAIL
            ================================================ */}

            <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white  ">
              <div className="border-b border-gray-200 px-5 py-4  md:px-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-base font-bold">
                      Article Image
                    </h2>

                    <p className="mt-1 text-xs text-gray-500">
                      Upload a new thumbnail image
                    </p>
                  </div>

                  <FaImage className="text-xl text-gray-400 " />
                </div>
              </div>

              <div className="p-4 md:p-6">
                <div className="group relative overflow-hidden rounded-xl border border-gray-200 bg-gray-100  ">
                  {currentImage ? (
                    <img
                      src={currentImage}
                      alt={
                        article.title ||
                        "Article"
                      }
                      className="h-[250px] w-full object-cover md:h-[400px]"
                    />
                  ) : (
                    <div className="flex h-[250px] items-center justify-center md:h-[400px]">
                      <div className="text-center">
                        <FaImage className="mx-auto mb-3 text-5xl text-gray-300" />

                        <p className="text-sm text-gray-500">
                          No article image
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Upload overlay */}

                  <label
                    htmlFor="article-image"
                    className="absolute inset-0 flex cursor-pointer items-center justify-center bg-black/0 opacity-0 transition duration-300 group-hover:bg-black/50 group-hover:opacity-100"
                  >
                    <div className="flex flex-col items-center text-white">
                      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white text-black shadow-xl">
                        <FaCameraRetro className="text-xl" />
                      </div>

                      <span className="mt-3 text-sm font-semibold">
                        Change Image
                      </span>
                    </div>
                  </label>

                  <input
                    id="article-image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />

                  {/* Status */}

                  <div className="absolute right-4 top-4">
                    <span className="rounded-full bg-black px-3 py-1.5 text-xs font-semibold text-white shadow-lg">
                      {article.status ||
                        "DRAFT"}
                    </span>
                  </div>
                </div>

                {/* New image information */}

                {newImage && (
                  <div className="mt-4 flex items-center justify-between gap-3 rounded-lg border border-black bg-gray-50 p-3  ">
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-black ">
                        New image selected
                      </p>

                      <p className="truncate text-xs text-gray-500">
                        {newImage.name}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={removeNewImage}
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-black text-white transition hover:bg-gray-800   "
                    >
                      <FiX />
                    </button>
                  </div>
                )}

                <p className="mt-3 text-xs text-gray-400">
                  Recommended: JPG, JPEG, PNG or
                  WEBP • Max 5MB
                </p>
              </div>
            </section>

            {/* ===============================================
                BASIC INFORMATION
            ================================================ */}

            <section className="rounded-2xl border border-gray-200 bg-white  ">
              <div className="border-b border-gray-200 px-5 py-4  md:px-6">
                <h2 className="text-base font-bold">
                  Basic Information
                </h2>

                <p className="mt-1 text-xs text-gray-500">
                  Update the main article details
                </p>
              </div>

              <div className="space-y-6 p-5 md:p-6">
                {/* Title */}

                <div>
                  <label
                    htmlFor="title"
                    className="mb-2 block text-sm font-semibold"
                  >
                    Article Title
                  </label>

                  <div className="relative">
                    <FiFileText className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 " />

                    <input
                      type="text"
                      name="title"
                      id="title"
                      value={
                        article.title || ""
                      }
                      onChange={inputChange}
                      placeholder="Enter article title"
                      className="h-12 w-full rounded-xl border border-gray-300 bg-white pl-11 pr-4 text-sm text-black outline-none transition placeholder:text-gray-400 focus:border-black focus:ring-2 focus:ring-black/10      "
                    />
                  </div>
                </div>

                {/* Category + Status */}

                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                  {/* Category */}

                  <div>
                    <label
                      htmlFor="category"
                      className="mb-2 block text-sm font-semibold"
                    >
                      Category
                    </label>

                    <select
                      name="category"
                      id="category"
                      value={
                        article.category || ""
                      }
                      onChange={inputChange}
                      className="h-12 w-full rounded-xl border border-gray-300 bg-white px-4 text-sm text-black outline-none transition focus:border-black focus:ring-2 focus:ring-black/10     "
                    >
                      {categories.map(
                        (item: string) => (
                          <option
                            value={item}
                            key={item}
                          >
                            {item}
                          </option>
                        )
                      )}
                    </select>
                  </div>

                  {/* Status */}

                  <div>
                    <label
                      htmlFor="status"
                      className="mb-2 block text-sm font-semibold"
                    >
                      Publication Status
                    </label>

                    <select
                      name="status"
                      id="status"
                      value={
                        article.status ||
                        "DRAFT"
                      }
                      onChange={inputChange}
                      disabled={
                        article.status ===
                        "REJECTED"
                      }
                      className="h-12 w-full rounded-xl border border-gray-300 bg-white px-4 text-sm text-black outline-none transition focus:border-black focus:ring-2 focus:ring-black/10 disabled:cursor-not-allowed disabled:opacity-60     "
                    >
                      <option value="PUBLISHED">
                        Published
                      </option>

                      <option
                        value="REJECTED"
                        disabled
                      >
                        Rejected
                      </option>

                      <option value="DRAFT">
                        Draft
                      </option>
                    </select>
                  </div>
                </div>

                {/* Short description */}

                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <label
                      htmlFor="shortDescription"
                      className="text-sm font-semibold"
                    >
                      Short Description
                    </label>

                    <span className="text-xs text-gray-400 ">
                      {
                        (
                          article.shortDescription ||
                          ""
                        ).length
                      }
                      /300
                    </span>
                  </div>

                  <textarea
                    name="shortDescription"
                    id="shortDescription"
                    value={
                      article.shortDescription ||
                      ""
                    }
                    onChange={inputChange}
                    maxLength={300}
                    rows={5}
                    placeholder="Write a short summary of this article..."
                    className="w-full resize-none rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm leading-6 text-black outline-none transition placeholder:text-gray-400 focus:border-black focus:ring-2 focus:ring-black/10      "
                  />
                </div>
              </div>
            </section>

            {/* ===============================================
                TAGS
            ================================================ */}

            <section className="rounded-2xl border border-gray-200 bg-white  ">
              <div className="border-b border-gray-200 px-5 py-4  md:px-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-black text-white  ">
                    <FaTags />
                  </div>

                  <div>
                    <h2 className="text-base font-bold">
                      Article Tags
                    </h2>

                    <p className="mt-1 text-xs text-gray-500">
                      Add or remove tags for this
                      article
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-5 md:p-6">
                {/* Add tag */}

                <div className="flex flex-col gap-3 sm:flex-row">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(
                      event: ChangeEvent<HTMLInputElement>
                    ) =>
                      setTagInput(
                        event.target.value
                      )
                    }
                    onKeyDown={handleTagKeyDown}
                    placeholder="Enter tag and press Enter"
                    className="h-11 flex-1 rounded-xl border border-gray-300 bg-white px-4 text-sm text-black outline-none placeholder:text-gray-400 focus:border-black focus:ring-2 focus:ring-black/10      "
                  />

                  <button
                    type="button"
                    onClick={addTag}
                    className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-black px-5 text-sm font-semibold text-white transition hover:bg-gray-800   "
                  >
                    <FaPlus />
                    Add Tag
                  </button>
                </div>

                {/* Tags */}

                <div className="mt-5 flex flex-wrap gap-2">
                  {article.tags &&
                  article.tags.length > 0 ? (
                    article.tags.map(
                      (
                        tag: string,
                        index: number
                      ) => (
                        <div
                          key={`${tag}-${index}`}
                          className="group flex items-center gap-2 rounded-lg border border-gray-300 bg-gray-50 px-3 py-2  "
                        >
                          <span className="text-sm font-medium text-black ">
                            #{tag}
                          </span>

                          <button
                            type="button"
                            onClick={() =>
                              removeTag(index)
                            }
                            className="text-gray-400 transition hover:text-black  "
                          >
                            <FiX />
                          </button>
                        </div>
                      )
                    )
                  ) : (
                    <div className="w-full rounded-xl border border-dashed border-gray-300 px-4 py-8 text-center ">
                      <FaTags className="mx-auto mb-2 text-2xl text-gray-300 " />

                      <p className="text-sm text-gray-500">
                        No tags added yet
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </section>

            {/* ===============================================
                BOTTOM ACTIONS
            ================================================ */}

            <div className="flex flex-col-reverse justify-between gap-3 border-t border-gray-200 pt-6  sm:flex-row">
              <button
                type="button"
                onClick={handelDeletArticle}
                disabled={saving}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-700 px-7 py-3 text-sm font-bold text-white transition hover:bg-red-900 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <RiChatDeleteLine />
                Delete Article
              </button>

              <button
                type="button"
                onClick={handelSaveArticle}
                disabled={saving}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-black px-7 py-3 text-sm font-bold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50   "
              >
                {saving ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent  " />
                    Saving...
                  </>
                ) : (
                  <>
                    <FaSave />
                    Save Article
                  </>
                )}
              </button>
            </div>
          </div>

          {/* =================================================
              RIGHT SIDEBAR
          ================================================== */}

          <aside className="space-y-6 lg:sticky lg:top-24 lg:h-fit">
            {/* Article info */}

            <div className="rounded-2xl border border-gray-200 bg-white  ">
              <div className="border-b border-gray-200 px-5 py-4 ">
                <h2 className="text-base font-bold">
                  Article Information
                </h2>
              </div>

              <div className="divide-y divide-gray-100 ">
                {/* Date */}

                <div className="flex items-center gap-4 px-5 py-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gray-100 ">
                    <FaCalendarAlt />
                  </div>

                  <div>
                    <p className="text-xs text-gray-500">
                      Created
                    </p>

                    <p className="mt-1 text-sm font-semibold">
                      {article.createdAt
                        ? new Date(
                            article.createdAt
                          ).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            }
                          )
                        : "—"}
                    </p>
                  </div>
                </div>

                {/* Views */}

                <div className="flex items-center gap-4 px-5 py-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gray-100 ">
                    <FaEye />
                  </div>

                  <div>
                    <p className="text-xs text-gray-500">
                      Views
                    </p>

                    <p className="mt-1 text-sm font-semibold">
                      {(
                        article.views || 0
                      ).toLocaleString()}
                    </p>
                  </div>
                </div>

                {/* Category */}

                <div className="flex items-center gap-4 px-5 py-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gray-100 ">
                    <FiFolder />
                  </div>

                  <div className="min-w-0">
                    <p className="text-xs text-gray-500">
                      Category
                    </p>

                    <p className="mt-1 truncate text-sm font-semibold">
                      {article.category ||
                        "No category"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Content edit */}

            <div className="rounded-2xl border border-black bg-black p-5 text-white   ">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-black  ">
                <FiEdit3 className="text-xl" />
              </div>

              <h2 className="mt-5 text-lg font-bold">
                Article Content
              </h2>

              <p className="mt-2 text-sm leading-6 text-gray-300 ">
                Edit your article sections, rich
                text content, section colors and
                images from the dedicated content
                editor.
              </p>

              <Link
                href={`/learning-articles/${id}/desc`}
                className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-bold text-black transition hover:bg-gray-200   "
              >
                <FaPen />
                Edit Content
              </Link>
            </div>

            {/* Content count */}

            <div className="rounded-2xl border border-gray-200 bg-gray-50 p-5  ">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-500">
                    Content Sections
                  </p>

                  <p className="mt-1 text-3xl font-bold">
                    {article.content?.length ||
                      0}
                  </p>
                </div>

                <MdOutlineArticle className="text-4xl text-gray-300 " />
              </div>

              <Link
                href={`/learning-articles/${id}/desc`}
                className="mt-4 inline-flex items-center gap-2 text-sm font-semibold underline underline-offset-4 hover:no-underline"
              >
                Manage sections
                <span>→</span>
              </Link>
            </div>
          </aside>
        </div>

        {/* =====================================================
            CONTENT PREVIEW
        ====================================================== */}

        <section className="mt-10 rounded-2xl border border-gray-200 bg-white  ">
          <div className="flex flex-col gap-3 border-b border-gray-200 px-5 py-5  sm:flex-row sm:items-center sm:justify-between md:px-6">
            <div>
              <h2 className="text-lg font-bold">
                Content Preview
              </h2>

              <p className="mt-1 text-xs text-gray-500">
                Preview only. Use Edit Content to
                modify sections.
              </p>
            </div>

            <Link
              href={`/learning-articles/${id}/desc`}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-black px-4 py-2 text-sm font-semibold transition "
            >
              <FiEdit3 />
              Edit Content
            </Link>
          </div>

          <div className="space-y-12 p-5 md:p-8">
            {article.content &&
            article.content.length > 0 ? (
              article.content.map(
                (
                  section: ArticleSection,
                  index: number
                ) => (
                  <article
                    key={
                      section._id ||
                      `section-${index}`
                    }
                    className="border-b border-gray-100 pb-10  last:border-0 last:pb-0"
                  >
                    {/* Section title */}

                    <div className="mb-6 flex items-center gap-4">
                      <div
                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white "
                        style={{
                          backgroundColor:
                            section.color ||
                            "#000000",
                        }}
                      >
                        {index + 1}
                      </div>

                      <h3 className="text-xl font-bold md:text-2xl">
                        {section.title ||
                          "Untitled Section"}
                      </h3>
                    </div>

                    <div
                      className={`grid grid-cols-1 gap-8 ${
                        section.image
                          ? "lg:grid-cols-2"
                          : "grid-cols-1"
                      }`}
                    >
                      {/* Description */}

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
                          __html:
                            section.des || "",
                        }}
                      />

                      {/* Section image */}

                      {section.image && (
                        <div className="overflow-hidden rounded-xl border border-gray-200  ">
                          <img
                            src={getImageUrl(
                              section.image
                            )}
                            alt={
                              section.title ||
                              "Article section"
                            }
                            className="h-auto max-h-[450px] w-full object-cover transition duration-500 hover:scale-105"
                          />
                        </div>
                      )}
                    </div>
                  </article>
                )
              )
            ) : (
              <div className="py-16 text-center">
                <MdOutlineArticle className="mx-auto mb-4 text-5xl text-gray-300 " />

                <h3 className="text-lg font-bold">
                  No content sections
                </h3>

                <p className="mt-2 text-sm text-gray-500">
                  Add content from the content
                  editor.
                </p>

                <Link
                  href={`/learning-articles/${id}/desc`}
                  className="mt-5 inline-flex items-center gap-2 rounded-lg bg-black px-5 py-3 text-sm font-semibold text-white  "
                >
                  <FaPlus />
                  Add Content
                </Link>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

export default ArticleViewPage;

