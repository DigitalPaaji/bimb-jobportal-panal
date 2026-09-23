"use client";

import axios, { AxiosError } from "axios";
import React, {
  ChangeEvent,
  FormEvent,
  KeyboardEvent,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import {
  FiBookOpen,
  FiFileText,
  FiHash,
  FiImage,
  FiLoader,
  FiPlus,
  FiSave,
  FiX,
} from "react-icons/fi";
import { base_url } from "./store/config";

/* =========================
   Types
========================= */

type ArticleStatus = "PUBLISHED" | "DRAFT";

type ArticleCategory =
  "Information Technology" |
  "Software Development" |
  "Data Science & Analytics"|
  "Engineering"|
  "Sales"|
  "Marketing"|
  "Finance & Accounting"|
  "Human Resources"|
  "Customer Support"|
  "Operations"|
  "Business Development"|
  "Project Management"|
  "Product Management"|
  "Design & Creative"|
  "Healthcare"|
  "Education & Teaching"|
  "Legal"|
  "Manufacturing"|
  "Construction"|
  "Architecture"|
  "Banking & Insurance"|
  "Retail"|
  "Hospitality & Travel"|
  "Logistics & Supply Chain"|
  "Media & Entertainment"|
  "Real Estate"|
  "Government & Public Sector"|
  "Research & Development"|
  "Administration"|
  "Other"


interface ArticleData {
  title: string;
  shortDescription: string;
  category: ArticleCategory;
  status: ArticleStatus;
  tags: string[];
  image: File | null;
}

interface CreateArticleProps {
  setCreateArticle: React.Dispatch<React.SetStateAction<boolean>>;
}

interface CreateArticleResponse {
  success: boolean;
  message?: string;
  article?:
    | string
    | {
        _id: string;
        [key: string]: unknown;
      };
}

interface ErrorResponse {
  message?: string;
}

/* =========================
   Constants
========================= */

const categories: ArticleCategory[] = [
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

const initialArticleData: ArticleData = {
  title: "",
  shortDescription: "",
  category: "Hospitality & Travel",
  status: "PUBLISHED",
  tags: [],
  image: null,
};

/* =========================
   Component
========================= */

const CrearteArticle: React.FC<CreateArticleProps> = ({
  setCreateArticle,
}) => {
  const router = useRouter();

  const [articleData, setArticleData] =
    useState<ArticleData>(initialArticleData);

  const [tag, setTag] = useState<string>("");
  const [imagePreview, setImagePreview] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  /* =========================
     Input Change
  ========================= */

  const inputChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ): void => {
    const { name, value } = event.target;

    setArticleData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  /* =========================
     Image Change
  ========================= */

  const handleImageChange = (
    event: ChangeEvent<HTMLInputElement>
  ): void => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image.");
      event.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size must be less than 5 MB.");
      event.target.value = "";
      return;
    }

    setArticleData((previous) => ({
      ...previous,
      image: file,
    }));

    // Remove previous object URL if required later
    setImagePreview(URL.createObjectURL(file));
  };

  /* =========================
     Add Tag
  ========================= */

  const addTag = (): void => {
    const value = tag.trim();

    if (!value) return;

    const alreadyExists = articleData.tags.some(
      (item: string) =>
        item.toLowerCase() === value.toLowerCase()
    );

    if (alreadyExists) {
      toast.info("This tag is already added.");
      return;
    }

    setArticleData((previous) => ({
      ...previous,
      tags: [...previous.tags, value],
    }));

    setTag("");
  };

  /* =========================
     Tag Keyboard
  ========================= */

  const handleTagKeyDown = (
    event: KeyboardEvent<HTMLInputElement>
  ): void => {
    if (event.key === "Enter" || event.key === ",") {
      event.preventDefault();
      addTag();
    }
  };

  /* =========================
     Remove Tag
  ========================= */

  const removeTag = (tagToRemove: string): void => {
    setArticleData((previous) => ({
      ...previous,
      tags: previous.tags.filter(
        (item: string) => item !== tagToRemove
      ),
    }));
  };

  /* =========================
     Submit Article
  ========================= */

  const submitArticle = async (
    event: FormEvent<HTMLFormElement>
  ): Promise<void> => {
    event.preventDefault();

    if (!articleData.title.trim()) {
      toast.error("Article title is required.");
      return;
    }

    if (!articleData.shortDescription.trim()) {
      toast.error("Short description is required.");
      return;
    }

    if (!articleData.category.trim()) {
      toast.error("Category is required.");
      return;
    }

    if (!articleData.image) {
      toast.error("Please select a thumbnail.");
      return;
    }

    try {
      setIsSubmitting(true);

      const formData = new FormData();

      formData.append(
        "title",
        articleData.title.trim()
      );

      formData.append(
        "shortDescription",
        articleData.shortDescription.trim()
      );

      formData.append(
        "category",
        articleData.category
      );

      formData.append(
        "status",
        articleData.status
      );

      formData.append(
        "tags",
        JSON.stringify(articleData.tags)
      );

      formData.append(
        "image",
        articleData.image
      );

      const response = await axios.post<CreateArticleResponse>(
        `${base_url}/article/create`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );

      const data = response.data;

      if (!data.success) {
        toast.error(
          data.message || "Unable to create article."
        );
        return;
      }

      toast.success(
        data.message || "Article created successfully."
      );

      /* =========================
         Get Article ID
      ========================= */

      let articleId: string | undefined;

      if (typeof data.article === "string") {
        articleId = data.article;
      } else if (
        data.article &&
        typeof data.article === "object" &&
        "_id" in data.article
      ) {
        articleId = data.article._id;
      }

      if (!articleId) {
        toast.error("Article created, but article ID was not returned.");
        setCreateArticle(false);
        return;
      }

      setCreateArticle(false);

      router.push(
        `/learning-articles/${articleId}/desc`
      );
    } catch (error: unknown) {
      const axiosError =
        error as AxiosError<ErrorResponse>;

      toast.error(
        axiosError.response?.data?.message ||
          "Unable to create article."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  /* =========================
     JSX
  ========================= */

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 p-4 backdrop-blur-sm">
      <div className="flex min-h-full items-center justify-center">
        <div className="w-full max-w-3xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl  ">

          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4  sm:px-7">
            <div className="flex items-center gap-3">
              <div className="flex size-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600  ">
                <FiBookOpen size={21} />
              </div>

              <div>
                <h2 className="text-lg font-semibold text-slate-900 ">
                  Create learning article
                </h2>

                <p className="text-sm text-slate-500 ">
                  Add the basic information for your new article.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setCreateArticle(false)}
              className="flex size-9 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-slate-900   "
              aria-label="Close"
            >
              <FiX size={20} />
            </button>
          </div>

          {/* Form */}
          <form
            onSubmit={submitArticle}
            className="p-5 sm:p-7"
          >
            <div className="space-y-6">

              {/* Title */}
              <div>
                <label
                  htmlFor="title"
                  className="mb-2 block text-sm font-medium text-slate-700 "
                >
                  Article title{" "}
                  <span className="text-red-500">*</span>
                </label>

                <div className="relative">
                  <FiFileText className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />

                  <input
                    type="text"
                    name="title"
                    id="title"
                    value={articleData.title}
                    onChange={inputChange}
                    placeholder="Enter article title"
                    className="h-12 w-full rounded-xl border border-slate-300 bg-white pl-11 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10    "
                  />
                </div>
              </div>

              {/* Short Description */}
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label
                    htmlFor="shortDescription"
                    className="text-sm font-medium text-slate-700 "
                  >
                    Short description{" "}
                    <span className="text-red-500">*</span>
                  </label>

                  <span className="text-xs text-slate-400">
                    {articleData.shortDescription.length}/300
                  </span>
                </div>

                <textarea
                  name="shortDescription"
                  id="shortDescription"
                  value={articleData.shortDescription}
                  onChange={inputChange}
                  maxLength={300}
                  rows={4}
                  placeholder="Write a short summary of this article..."
                  className="w-full resize-none rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10    "
                />
              </div>

              {/* Category + Status */}
              <div className="grid gap-5 sm:grid-cols-2">

                {/* Category */}
                <div>
                  <label
                    htmlFor="category"
                    className="mb-2 block text-sm font-medium text-slate-700 "
                  >
                    Category{" "}
                    <span className="text-red-500">*</span>
                  </label>

                  <select
                    name="category"
                    id="category"
                    value={articleData.category}
                    onChange={inputChange}
                    className="h-12 w-full rounded-xl border border-slate-300 bg-white px-4 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10   "
                  >
                    {categories.map(
                      (item: ArticleCategory) => (
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
                    className="mb-2 block text-sm font-medium text-slate-700 "
                  >
                    Publication status
                  </label>

                  <select
                    name="status"
                    id="status"
                    value={articleData.status}
                    onChange={inputChange}
                    className="h-12 w-full rounded-xl border border-slate-300 bg-white px-4 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10   "
                  >
                    <option value="PUBLISHED">
                      Published
                    </option>

                    <option value="DRAFT">
                      Draft
                    </option>
                  </select>
                </div>
              </div>

              {/* Tags */}
              <div>
                <label
                  htmlFor="tag"
                  className="mb-2 block text-sm font-medium text-slate-700 "
                >
                  Tags
                </label>

                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <FiHash className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />

                    <input
                      type="text"
                      id="tag"
                      value={tag}
                      onChange={(
                        event: ChangeEvent<HTMLInputElement>
                      ) =>
                        setTag(event.target.value)
                      }
                      onKeyDown={handleTagKeyDown}
                      placeholder="Type a tag and press Enter"
                      className="h-12 w-full rounded-xl border border-slate-300 bg-white pl-11 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10   "
                    />
                  </div>

                  <button
                    type="button"
                    onClick={addTag}
                    className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-slate-900 text-white transition hover:bg-indigo-600  "
                  >
                    <FiPlus size={20} />
                  </button>
                </div>

                {articleData.tags.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {articleData.tags.map(
                      (item: string) => (
                        <span
                          key={item}
                          className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 px-3 py-1.5 text-xs font-medium text-indigo-700  "
                        >
                          #{item}

                          <button
                            type="button"
                            onClick={() =>
                              removeTag(item)
                            }
                            className="text-indigo-400 hover:text-red-500"
                            aria-label={`Remove ${item}`}
                          >
                            <FiX size={14} />
                          </button>
                        </span>
                      )
                    )}
                  </div>
                )}
              </div>

              {/* Thumbnail */}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700 ">
                  Article thumbnail{" "}
                  <span className="text-red-500">*</span>
                </label>

                <label className="flex min-h-40 cursor-pointer flex-col items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 transition hover:border-indigo-400 hover:bg-indigo-50/50  /60 ">

                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Article thumbnail preview"
                      className="h-52 w-full object-cover"
                    />
                  ) : (
                    <div className="flex flex-col items-center px-5 py-8 text-center">
                      <div className="mb-3 flex size-12 items-center justify-center rounded-full bg-white text-indigo-600 shadow-sm  ">
                        <FiImage size={21} />
                      </div>

                      <p className="text-sm font-medium text-slate-700 ">
                        Click to upload a thumbnail
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        PNG, JPG or WEBP up to 5 MB
                      </p>
                    </div>
                  )}

                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-7 flex flex-col-reverse gap-3 border-t border-slate-200 pt-5  sm:flex-row sm:justify-end">

              <button
                type="button"
                onClick={() =>
                  setCreateArticle(false)
                }
                disabled={isSubmitting}
                className="h-11 rounded-xl border border-slate-300 px-5 text-sm font-medium text-slate-700 transition hover:bg-slate-100 disabled:opacity-60   "
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="flex h-11 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60 "
              >
                {isSubmitting ? (
                  <>
                    <FiLoader className="animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <FiSave />
                    Create article
                  </>
                )}
              </button>

            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CrearteArticle;
