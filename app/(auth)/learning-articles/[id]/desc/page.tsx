"use client";

import React, {
  ChangeEvent,
  useEffect,
  useState,
} from "react";

import RichEditor from "@/components/RichEditor";
import { base_url, img_url } from "@/components/store/config";

import axios, {
  AxiosError,
} from "axios";

import { useParams, useRouter } from "next/navigation";

import {
  FaCloudUploadAlt,
  FaEdit,
  FaTrash,
  FaPlus,
  FaSave,
} from "react-icons/fa";

import { MdCancel } from "react-icons/md";

import { toast } from "react-toastify";
import Link from "next/link";
import { BsBack } from "react-icons/bs";
import { BiArrowBack } from "react-icons/bi";

axios.defaults.withCredentials = true;

// ======================================================
// TYPES
// ======================================================

interface ArticleSection {
  _id: string;
  title?: string;
  des?: string;
  color?: string;
  image?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

interface ArticleContentResponse {
  success: boolean;
  message?: string;
  data?: ArticleSection[];
}

interface ApiErrorResponse {
  message?: string;
}

interface ArticleFormData {
  title: string;
  des: string;
  color: string;
  image: File | null;
  existingImage: string | null;
}

// ======================================================
// PAGE
// ======================================================

const Page = () => {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const id = params?.id;

  // ======================================================
  // STATES
  // ======================================================

  const [allArticles, setAllArticles] = useState<ArticleSection[]>(
    []
  );

  const [editingId, setEditingId] = useState<string | null>(
    null
  );

  const [loading, setLoading] = useState<boolean>(false);

  const [newArticleInfo, setNewArticleInfo] =
    useState<ArticleFormData>({
      title: "",
      des: "",
      color: "#000000",
      image: null,
      existingImage: null,
    });

  const [imagePreview, setImagePreview] =
    useState<string | null>(null);

  // ======================================================
  // IMAGE URL
  // ======================================================

  const getImageUrl = (
    image: string | null | undefined
  ): string => {
    if (!image) {
      return "";
    }

    // If backend already returns complete URL
    if (
      image.startsWith("http://") ||
      image.startsWith("https://")
    ) {
      return image;
    }

    return `${img_url}${image}`;
  };

  // ======================================================
  // RESET FORM
  // ======================================================

  const resetForm = (): void => {
    setNewArticleInfo({
      title: "",
      des: "",
      color: "#000000",
      image: null,
      existingImage: null,
    });

    setImagePreview(null);

    setEditingId(null);
  };

  // ======================================================
  // FETCH ARTICLES
  // ======================================================

  const fetchArticles = async (): Promise<void> => {
    if (!id) return;

    try {
      const response =
        await axios.get<ArticleContentResponse>(
          `${base_url}/article/get-content/${id}`
        );

      const data = response.data;

      if (data.success) {
        setAllArticles(data.data || []);
      } else {
        setAllArticles([]);
      }
    } catch (error) {
      console.error("Failed to load article content:", error);

      setAllArticles([]);

      const axiosError =
        error as AxiosError<ApiErrorResponse>;

      toast.error(
        axiosError.response?.data?.message ||
          "Failed to load article content"
      );
    }
  };

  // ======================================================
  // FETCH ON LOAD
  // ======================================================

  useEffect(() => {
    if (id) {
      fetchArticles();
    }
  }, [id]);

  // ======================================================
  // IMAGE CHANGE
  // ======================================================

  const handleImageChange = (
    e: ChangeEvent<HTMLInputElement>
  ): void => {
    const file = e.target.files?.[0];

    if (!file) return;

    // Validate image type
    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image");

      e.target.value = "";

      return;
    }

    // 5MB validation
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size must be less than 5MB");

      e.target.value = "";

      return;
    }

    // Create preview
    const previewUrl = URL.createObjectURL(file);

    // Remove old preview URL
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }

    setImagePreview(previewUrl);

    setNewArticleInfo((prev) => ({
      ...prev,
      image: file,
      existingImage: null,
    }));
  };

  // ======================================================
  // SUBMIT
  // ======================================================

  const handleSubmit = async (): Promise<void> => {
    try {
      const {
        title,
        des,
        color,
        image,
        existingImage,
      } = newArticleInfo;

      // Check at least one field
      if (
        !title.trim() &&
        !des.trim() &&
        !image &&
        !existingImage
      ) {
        toast.error("At least one field is required");
        return;
      }

     

    

      setLoading(true);

      const formData = new FormData();

      formData.append("title", title.trim());
      formData.append("des", des);
      formData.append("color", color);
      formData.append("articleid", id);

      if (image) {
        formData.append("image", image);
      }

      let response;

      // ==================================================
      // UPDATE
      // ==================================================

      if (editingId) {
        response = await axios.put(
          `${base_url}/article/des/update/${editingId}`,
          formData
        );
      }

      // ==================================================
      // CREATE
      // ==================================================

      else {
        response = await axios.post(
          `${base_url}/article/des/add`,
          formData
        );
      }

      const data = response.data;

      if (data.success) {
        toast.success(
          data.message ||
            (editingId
              ? "Section updated successfully"
              : "Section added successfully")
        );

        await fetchArticles();

        resetForm();
      } else {
        toast.error(
          data.message || "Something went wrong"
        );
      }
    } catch (error) {
      console.error("Submit error:", error);

      const axiosError =
        error as AxiosError<ApiErrorResponse>;

      toast.error(
        axiosError.response?.data?.message ||
          "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  // ======================================================
  // EDIT
  // ======================================================

  const handleEdit = (
    article: ArticleSection
  ): void => {
    setEditingId(article._id);

    setNewArticleInfo({
      title: article.title || "",
      des: article.des || "",
      color: article.color || "#000000",
      image: null,
      existingImage: article.image || null,
    });

    // Remove new image preview
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
      setImagePreview(null);
    }

    // Scroll to bottom/form
    window.scrollTo({
      top: document.body.scrollHeight,
      behavior: "smooth",
    });
  };

  // ======================================================
  // DELETE
  // ======================================================

  const handleDelete = async (
    articleDesId: string
  ): Promise<void> => {
    if (!articleDesId) return;

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this section?"
    );

    if (!confirmDelete) return;

    try {
      const response = await axios.delete(
        `${base_url}/article/des/delete/${id}/${articleDesId}`
      );

      if (response.data.success) {
        toast.success(
          response.data.message ||
            "Section deleted successfully"
        );

        setAllArticles((prev) =>
          prev.filter(
            (item) => item._id !== articleDesId
          )
        );

        if (editingId === articleDesId) {
          resetForm();
        }
      } else {
        toast.error(
          response.data.message ||
            "Failed to delete section"
        );
      }
    } catch (error) {
      console.error("Delete error:", error);

      const axiosError =
        error as AxiosError<ApiErrorResponse>;

      toast.error(
        axiosError.response?.data?.message ||
          "Failed to delete section"
      );
    }
  };

  // ======================================================
  // REMOVE IMAGE
  // ======================================================

  const removeImage = (): void => {
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }

    setImagePreview(null);

    setNewArticleInfo((prev) => ({
      ...prev,
      image: null,
      existingImage: null,
    }));

    const input =
      document.getElementById(
        "article-image"
      ) as HTMLInputElement | null;

    if (input) {
      input.value = "";
    }
  };

  // ======================================================
  // CLEANUP IMAGE PREVIEW
  // ======================================================

  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  // ======================================================
  // JSX
  // ======================================================

  return (
    <div className="h-screen w-full overflow-auto bg-gray-50 p-4 text-gray-900 transition-colors   sm:p-6">
      <div className="mx-auto w-full max-w-7xl">

        {/* ==================================================
            HEADER
        ================================================== */}

        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

          <div>
            <div className="flex items-center gap-3">

              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-black text-white  ">
              <BiArrowBack />
              </div>

              <div>
               <button
      onClick={() => router.back()}
      className="text-xl font-bold sm:text-2xl"
    >
      Back
    </button>

                
              </div>

            </div>
          </div>

          <div className="rounded-full bg-gray-100 px-4 py-2 text-sm font-medium text-gray-600  ">
            {allArticles.length}{" "}
            {allArticles.length === 1
              ? "Section"
              : "Sections"}
          </div>

        </div>

        {/* ==================================================
            ARTICLES TABLE
        ================================================== */}

        <div className="mb-8">

          {allArticles.length === 0 ? (

            <div className="flex min-h-[280px] items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-white  ">

              <div className="text-center">

                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 ">
                  <FaPlus
                    size={18}
                    className="text-gray-400"
                  />
                </div>

                <h3 className="font-semibold">
                  No sections yet
                </h3>

                <p className="mt-1 text-sm text-gray-500 ">
                  Create your first article section below.
                </p>

              </div>

            </div>

          ) : (

            <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm  ">

              <div className="overflow-x-auto">

                <table className="w-full min-w-[800px] text-left">

                  {/* TABLE HEADER */}

                  <thead>
                    <tr className="border-b border-gray-200 bg-gray-50  ">

                      <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500 ">
                        #
                      </th>

                      <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500 ">
                        Section
                      </th>

                      <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500 ">
                        Description
                      </th>

                      <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500 ">
                        Color
                      </th>

                      <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wide text-gray-500 ">
                        Actions
                      </th>

                    </tr>
                  </thead>

                  {/* TABLE BODY */}

                  <tbody className="divide-y divide-gray-100 ">

                    {allArticles.map(
                      (item, idx) => (

                        <tr
                          key={item._id || idx}
                          className="transition hover:bg-gray-50 "
                        >

                          {/* NUMBER */}

                          <td className="px-5 py-4">

                            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100 text-xs font-semibold text-gray-600  ">
                              {idx + 1}
                            </span>

                          </td>

                          {/* SECTION */}

                          <td className="px-5 py-4">

                            <div className="flex items-center gap-3">

                              {/* IMAGE */}

                              {item.image ? (

                                <div className="h-14 w-20 shrink-0 overflow-hidden rounded-lg bg-gray-100 ">

                                  <img
                                    src={getImageUrl(
                                      item.image
                                    )}
                                    alt={
                                      item.title ||
                                      "Article image"
                                    }
                                    className="h-full w-full object-cover"
                                  />

                                </div>

                              ) : (

                                <div className="flex h-14 w-20 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-xs text-gray-400 ">
                                  No Image
                                </div>

                              )}

                              {/* TITLE */}

                              <div className="min-w-0">

                                <div className="flex items-center gap-2">

                                  <span
                                    className="h-3.5 w-3.5 shrink-0 rounded-full border border-gray-300 "
                                    style={{
                                      backgroundColor:
                                        item.color ||
                                        "#000000",
                                    }}
                                  />

                                  <h3 className="max-w-[220px] truncate text-sm font-semibold text-gray-900 ">
                                    {item.title ||
                                      "Untitled Section"}
                                  </h3>

                                </div>

                                <p className="mt-1 text-xs text-gray-400">
                                  Section {idx + 1}
                                </p>

                              </div>

                            </div>

                          </td>

                          {/* DESCRIPTION */}

                          <td className="px-5 py-4">

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
                                  item.des || "",
                              }}
                            />

                          </td>

                          {/* COLOR */}

                          <td className="px-5 py-4">

                            <div className="flex items-center gap-2">

                              <span
                                className="h-7 w-7 rounded-lg border border-gray-200 shadow-sm "
                                style={{
                                  backgroundColor:
                                    item.color ||
                                    "#000000",
                                }}
                              />

                              <span className="text-xs font-medium uppercase text-gray-500 ">
                                {item.color ||
                                  "#000000"}
                              </span>

                            </div>

                          </td>

                          {/* ACTIONS */}

                          <td className="px-5 py-4">

                            <div className="flex justify-end gap-2">

                              {/* EDIT */}

                              <button
                                type="button"
                                onClick={() =>
                                  handleEdit(item)
                                }
                                title="Edit"
                                className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-600 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600   "
                              >
                                <FaEdit size={14} />
                              </button>

                              {/* DELETE */}

                              <button
                                type="button"
                                onClick={() =>
                                  handleDelete(
                                    item._id
                                  )
                                }
                                title="Delete"
                                className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600  "
                              >
                                <FaTrash size={14} />
                              </button>

                            </div>

                          </td>

                        </tr>

                      )
                    )}

                  </tbody>

                </table>

              </div>

            </div>

          )}

        </div>

        {/* ==================================================
            ADD / EDIT FORM
        ================================================== */}

        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm  ">

          {/* FORM HEADER */}

          <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4 ">

            <div className="flex items-center gap-3">

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-black text-white  ">
                {editingId ? (
                  <FaEdit size={16} />
                ) : (
                  <FaPlus size={16} />
                )}
              </div>

              <div>

                <h2 className="font-semibold">
                  {editingId
                    ? "Edit Section"
                    : "Add New Section"}
                </h2>

                <p className="text-xs text-gray-500 ">
                  {editingId
                    ? "Update your article section"
                    : "Create a new article section"}
                </p>

              </div>

            </div>

            {/* CANCEL */}

            {editingId && (

              <button
                type="button"
                onClick={resetForm}
                className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm text-gray-500 transition hover:bg-gray-100 hover:text-gray-900   "
              >
                <MdCancel size={18} />
                Cancel
              </button>

            )}

          </div>

          {/* FORM BODY */}

          <div className="grid grid-cols-1 gap-6 p-5 lg:grid-cols-2">

            {/* =================================================
                LEFT SIDE
            ================================================= */}

            <div className="flex flex-col gap-4">

              {/* TITLE */}

              <div>

                <label className="mb-2 block text-sm font-medium">
                  Section Title
                </label>

                <input
                  type="text"
                  placeholder="Enter section title..."
                  value={
                    newArticleInfo.title
                  }
                  onChange={(
                    e: ChangeEvent<HTMLInputElement>
                  ) =>
                    setNewArticleInfo(
                      (prev) => ({
                        ...prev,
                        title: e.target.value,
                      })
                    )
                  }
                  className="h-11 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 text-sm outline-none transition placeholder:text-gray-400 focus:border-gray-400 focus:ring-2 focus:ring-gray-100     "
                />

              </div>

              {/* RICH EDITOR */}

              <div>

                <label className="mb-2 block text-sm font-medium">
                  Description
                </label>

                <div className="min-h-[280px] overflow-hidden rounded-xl border border-gray-200 ">

                  <RichEditor
                    content={
                      newArticleInfo.des
                    }
                    setContent={(
                      data: string
                    ) =>
                      setNewArticleInfo(
                        (prev) => ({
                          ...prev,
                          des: data,
                        })
                      )
                    }
                  />

                </div>

              </div>

            </div>

            {/* =================================================
                RIGHT SIDE
            ================================================= */}

            <div className="flex flex-col gap-5">

              {/* COLOR */}

              <div>

                <label className="mb-2 block text-sm font-medium">
                  Theme Color
                </label>

                <div className="flex h-12 items-center gap-3 rounded-xl border border-gray-200 bg-gray-50 px-3  ">

                  <input
                    type="color"
                    value={
                      newArticleInfo.color
                    }
                    onChange={(
                      e: ChangeEvent<HTMLInputElement>
                    ) =>
                      setNewArticleInfo(
                        (prev) => ({
                          ...prev,
                          color: e.target.value,
                        })
                      )
                    }
                    className="h-8 w-10 cursor-pointer overflow-hidden rounded-lg border-0 bg-transparent p-0"
                  />

                  <span className="text-sm font-medium uppercase text-gray-500 ">
                    {newArticleInfo.color}
                  </span>

                  <div
                    className="ml-auto h-7 w-7 rounded-full border border-gray-200 shadow-sm "
                    style={{
                      backgroundColor:
                        newArticleInfo.color,
                    }}
                  />

                </div>

              </div>

              {/* IMAGE */}

              <div>

                <label className="mb-2 block text-sm font-medium">
                  Section Image
                </label>

                <input
                  type="file"
                  accept="image/*"
                  hidden
                  id="article-image"
                  onChange={
                    handleImageChange
                  }
                />

                {/* ============================================
                    NEW IMAGE PREVIEW
                ============================================ */}

                {newArticleInfo.image &&
                imagePreview ? (

                  <div className="relative aspect-[16/9] w-full overflow-hidden rounded-xl border border-gray-200 bg-gray-100  ">

                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="h-full w-full object-cover"
                    />

                    <div className="absolute left-3 top-3 rounded-full bg-black/70 px-3 py-1 text-xs font-medium text-white backdrop-blur">
                      New Image
                    </div>

                    <button
                      type="button"
                      onClick={
                        removeImage
                      }
                      className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-red-500 shadow-md transition hover:bg-red-500 hover:text-white"
                    >
                      <MdCancel
                        size={20}
                      />
                    </button>

                  </div>

                ) : newArticleInfo.existingImage ? (

                  /* ==========================================
                      EXISTING IMAGE
                  ========================================== */

                  <div className="relative aspect-[16/9] w-full overflow-hidden rounded-xl border border-gray-200 bg-gray-100  ">

                    <img
                      src={getImageUrl(
                        newArticleInfo.existingImage
                      )}
                      alt="Current"
                      className="h-full w-full object-cover"
                    />

                    <div className="absolute left-3 top-3 rounded-full bg-black/70 px-3 py-1 text-xs font-medium text-white backdrop-blur">
                      Current Image
                    </div>

                    <div className="absolute inset-x-3 bottom-3 flex justify-end gap-2">

                      {/* CHANGE */}

                      <label
                        htmlFor="article-image"
                        className="flex cursor-pointer items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-semibold text-gray-900 shadow-lg transition hover:bg-gray-100"
                      >
                        <FaEdit size={13} />
                        Change
                      </label>

                      {/* REMOVE */}

                      <button
                        type="button"
                        onClick={
                          removeImage
                        }
                        className="flex items-center gap-2 rounded-lg bg-red-500 px-4 py-2 text-sm font-semibold text-white shadow-lg transition hover:bg-red-600"
                      >
                        <MdCancel
                          size={17}
                        />
                        Remove
                      </button>

                    </div>

                  </div>

                ) : (

                  /* ==========================================
                      UPLOAD BOX
                  ========================================== */

                  <label
                    htmlFor="article-image"
                    className="flex aspect-[16/9] w-full cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 transition hover:border-gray-500 hover:bg-gray-100   "
                  >

                    <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-sm ">

                      <FaCloudUploadAlt
                        size={25}
                        className="text-gray-400"
                      />

                    </div>

                    <p className="text-sm font-semibold">
                      Upload Image
                    </p>

                    <p className="mt-1 text-xs text-gray-400">
                      JPG, PNG or WEBP • Max 5MB
                    </p>

                  </label>

                )}

              </div>

            </div>

          </div>

          {/* ==================================================
              SUBMIT
          ================================================== */}

          <div className="border-t border-gray-100 px-5 py-4 ">

            <button
              type="button"
              disabled={loading}
              onClick={handleSubmit}
              className={`flex w-full items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-50 ${
                editingId
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "bg-black hover:bg-gray-800   "
              }`}
            >

              {loading ? (

                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent " />
                  Saving...
                </>

              ) : editingId ? (

                <>
                  <FaSave size={15} />
                  Update Section
                </>

              ) : (

                <>
                  <FaPlus size={15} />
                  Add Section
                </>

              )}

            </button>

          </div>

        </div>

      </div>
    </div>
  );
};

export default Page;

