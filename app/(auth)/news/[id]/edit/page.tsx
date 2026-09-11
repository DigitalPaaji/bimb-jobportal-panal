"use client";

import LoadingCompo from "@/components/LoadingCompo";
import RichEditor from "@/components/RichEditor";
import { base_url, img_url } from "@/components/store/config";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import React, {
  ChangeEvent,
  FormEvent,
  useEffect,
  useState,
} from "react";
import {
  FiArrowLeft,
  FiCalendar,
  FiImage,
  FiSave,
  FiTag,
  FiUploadCloud,
  FiTrash2,
  FiX,
} from "react-icons/fi";
import { toast } from "react-toastify";


const categorySelect: string[] = [
  "CSSD Technician",
  "CSSD Supervisor",
  "CSSD Manager",
  "Infection Control Professional",
];

interface NewsData {
  title: string;
  description: string;
  publicationDate: string;
  category: string;
  image: File | null;
}

interface NewsResponse {
  success?: boolean;
  message?: string;
  news?: {
    title?: string;
    description?: string;
    publicationDate?: string;
    category?: string;
    featuredImage?: string;
  };
}

interface AxiosErrorResponse {
  message?: string;
}

const Page = () => {
  const params = useParams<{ id: string }>();
  const id = params?.id;

  const router = useRouter();

  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);

  const [newsData, setNewsData] = useState<NewsData | null>({
    title: "",
    description: "",
    publicationDate: "",
    category: "",
    image: null,
  });

  const [imagePreview, setImagePreview] =
    useState<string | null>(null);

  // -----------------------------------------
  // Fetch News
  // -----------------------------------------

  const fetchNews = async (): Promise<void> => {
    if (!id) return;

    try {
      setLoading(true);

      const response = await axios.get<NewsResponse>(
        `${base_url}/news/get/${id}`,
        {
          withCredentials: true,
        }
      );

      const data = response.data;

      if (!data?.success || !data?.news) {
        toast.error(
          data?.message || "News not found"
        );

        setNewsData(null);
        return;
      }

      const news = data.news;

      setNewsData({
        title: news?.title || "",
        description: news?.description || "",
        publicationDate: news?.publicationDate
          ? new Date(news.publicationDate)
              .toISOString()
              .split("T")[0]
          : "",
        category: news?.category || "",
        image: null,
      });

      if (news?.featuredImage) {
        setImagePreview(
          news.featuredImage.startsWith("http")
            ? news.featuredImage
            : `${img_url}${news.featuredImage}`
        );
      } else {
        setImagePreview(null);
      }
    } catch (error: unknown) {
      console.error(
        "Fetch news error:",
        error
      );

      if (axios.isAxiosError<AxiosErrorResponse>(error)) {
        toast.error(
          error.response?.data?.message ||
            "Unable to fetch news"
        );
      } else {
        toast.error("Unable to fetch news");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchNews();
    }
  }, [id]);

  // -----------------------------------------
  // Handle Input
  // -----------------------------------------

  const handleChange = (
    e: ChangeEvent<
      HTMLInputElement | HTMLSelectElement
    >
  ): void => {
    const { name, value } = e.target;

    setNewsData((prev) => {
      if (!prev) return prev;

      return {
        ...prev,
        [name]: value,
      };
    });
  };

  // -----------------------------------------
  // Image Change
  // -----------------------------------------

  const handleImageChange = (
    e: ChangeEvent<HTMLInputElement>
  ): void => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error(
        "Please select a valid image"
      );
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error(
        "Image must be less than 5MB"
      );
      return;
    }

    setNewsData((prev) => {
      if (!prev) return prev;

      return {
        ...prev,
        image: file,
      };
    });

    setImagePreview(
      URL.createObjectURL(file)
    );
  };

  // -----------------------------------------
  // Remove Image
  // -----------------------------------------

  const removeImage = (): void => {
    setNewsData((prev) => {
      if (!prev) return prev;

      return {
        ...prev,
        image: null,
      };
    });

    setImagePreview(null);
  };

  // -----------------------------------------
  // Update News
  // -----------------------------------------

  const handleSubmit = async (
    e: FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();

    if (!newsData) return;

    if (!newsData.title.trim()) {
      toast.error(
        "Please enter news title"
      );
      return;
    }

    if (!newsData.description.trim()) {
      toast.error(
        "Please enter description"
      );
      return;
    }

    if (!newsData.publicationDate) {
      toast.error(
        "Please select publication date"
      );
      return;
    }

    if (!newsData.category) {
      toast.error(
        "Please select category"
      );
      return;
    }

    if (!id) {
      toast.error("Invalid news ID");
      return;
    }

    try {
      setSaving(true);

      const formData = new FormData();

      formData.append(
        "title",
        newsData.title
      );

      formData.append(
        "description",
        newsData.description
      );

      formData.append(
        "publicationDate",
        newsData.publicationDate
      );

      formData.append(
        "category",
        newsData.category
      );

      // Only send image if a new image was selected
      if (newsData.image) {
        formData.append(
          "image",
          newsData.image
        );
      }

      const response = await axios.put<NewsResponse>(
        `${base_url}/news/update/${id}`,
        formData,
        {
          withCredentials: true,
        }
      );

      const data = response.data;

      if (data?.success) {
        toast.success(
          data?.message ||
            "News updated successfully"
        );

        router.push(
          `/news/${id}/view`
        );
      } else {
        toast.error(
          data?.message ||
            "Unable to update news"
        );
      }
    } catch (error: unknown) {
      console.error(
        "Update news error:",
        error
      );

      if (axios.isAxiosError<AxiosErrorResponse>(error)) {
        toast.error(
          error.response?.data?.message ||
            "Unable to update news"
        );
      } else {
        toast.error(
          "Unable to update news"
        );
      }
    } finally {
      setSaving(false);
    }
  };

  // -----------------------------------------
  // Loading
  // -----------------------------------------

  if (loading) {
    return <LoadingCompo />;
  }

  // -----------------------------------------
  // Not Found
  // -----------------------------------------

  if (!newsData) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white p-6">

        <div className="text-center">

          <h2 className="mb-3 text-2xl font-bold text-black">
            News Not Found
          </h2>

          <button
            type="button"
            onClick={() => router.back()}
            className="
              inline-flex
              items-center
              gap-2
              rounded-xl
              bg-black
              px-5
              py-3
              font-semibold
              text-white
              transition
              hover:bg-gray-800
            "
          >
            <FiArrowLeft />
            Go Back
          </button>

        </div>

      </div>
    );
  }

  // -----------------------------------------
  // Classes
  // -----------------------------------------

  const inputClass =
    "w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-black focus:ring-1 focus:ring-black";

  const selectClass =
    "w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-black focus:ring-1 focus:ring-black";

  const labelClass =
    "mb-2 block text-sm font-medium text-gray-700";

  return (
    <div className="
      h-screen
      overflow-auto
      bg-gray-50
      p-4
      text-black
      sm:p-6
    ">

      <div className="mx-auto max-w-4xl">

        {/* =====================================
            HEADER
        ====================================== */}

        <div className="
          mb-6
          flex
          items-center
          justify-between
          gap-4
        ">

          <div className="flex items-center gap-3">

            <button
              type="button"
              onClick={() => router.back()}
              className="
                flex
                h-10
                w-10
                items-center
                justify-center
                rounded-xl
                border
                border-gray-200
                bg-white
                text-gray-700
                transition
                hover:bg-gray-100
              "
            >
              <FiArrowLeft size={18} />
            </button>

            <div>

              <h1 className="
                text-xl
                font-bold
                text-gray-900
                sm:text-2xl
              ">
                Edit News
              </h1>

              <p className="
                text-sm
                text-gray-500
              ">
                Update your news article
              </p>

            </div>

          </div>

        </div>

        {/* =====================================
            FORM
        ====================================== */}

        <form onSubmit={handleSubmit}>

          <div className="
            rounded-2xl
            border
            border-gray-200
            bg-white
          ">

            <div className="
              space-y-7
              p-5
              sm:p-7
            ">

              {/* =================================
                  FEATURED IMAGE
              ================================== */}

              <div>

                <div className="
                  mb-4
                  flex
                  items-center
                  gap-3
                ">

                  <div className="
                    flex
                    h-10
                    w-10
                    items-center
                    justify-center
                    rounded-xl
                    bg-gray-100
                    text-gray-700
                  ">
                    <FiImage size={19} />
                  </div>

                  <div>

                    <h2 className="
                      font-semibold
                      text-gray-900
                    ">
                      Featured Image
                    </h2>

                    <p className="
                      text-xs
                      text-gray-500
                    ">
                      Upload a new image or keep
                      the existing one
                    </p>

                  </div>

                </div>

                {imagePreview ? (

                  <div className="
                    relative
                    overflow-hidden
                    rounded-2xl
                    border
                    border-gray-200
                  ">

                    <img
                      src={imagePreview}
                      alt={
                        newsData.title ||
                        "News image"
                      }
                      className="
                        h-64
                        w-full
                        object-cover
                        sm:h-80
                      "
                    />

                    <div className="
                      absolute
                      bottom-0
                      left-0
                      right-0
                      flex
                      items-center
                      justify-between
                      bg-gradient-to-t
                      from-black/80
                      to-transparent
                      p-4
                      pt-10
                    ">

                      <span className="
                        text-xs
                        text-white
                      ">
                        Featured Image
                      </span>

                      <button
                        type="button"
                        onClick={removeImage}
                        className="
                          flex
                          items-center
                          gap-2
                          rounded-lg
                          bg-white/10
                          px-3
                          py-2
                          text-xs
                          font-medium
                          text-white
                          backdrop-blur
                          transition
                          hover:bg-white/20
                        "
                      >
                        <FiTrash2 size={14} />
                        Remove
                      </button>

                    </div>

                  </div>

                ) : (

                  <label className="
                    flex
                    cursor-pointer
                    flex-col
                    items-center
                    justify-center
                    rounded-2xl
                    border-2
                    border-dashed
                    border-gray-300
                    bg-gray-50
                    px-5
                    py-12
                    transition
                    hover:border-black
                  ">

                    <FiUploadCloud
                      size={28}
                      className="
                        mb-3
                        text-gray-400
                      "
                    />

                    <p className="
                      text-sm
                      font-medium
                      text-gray-700
                    ">
                      Upload featured image
                    </p>

                    <p className="
                      mt-1
                      text-xs
                      text-gray-400
                    ">
                      PNG, JPG or WEBP • Max 5MB
                    </p>

                    <input
                      type="file"
                      accept="
                        image/png,
                        image/jpeg,
                        image/webp
                      "
                      onChange={handleImageChange}
                      className="hidden"
                    />

                  </label>

                )}

                {imagePreview && (
                  <label className="
                    mt-3
                    inline-flex
                    cursor-pointer
                    items-center
                    gap-2
                    rounded-xl
                    border
                    border-gray-200
                    bg-white
                    px-4
                    py-2.5
                    text-sm
                    font-medium
                    text-gray-700
                    transition
                    hover:bg-gray-100
                  ">

                    <FiUploadCloud size={16} />
                    Change Image

                    <input
                      type="file"
                      accept="
                        image/png,
                        image/jpeg,
                        image/webp
                      "
                      onChange={handleImageChange}
                      className="hidden"
                    />

                  </label>
                )}

              </div>

              {/* =================================
                  TITLE
              ================================== */}

              <div>

                <label className={labelClass}>
                  News Title
                </label>

                <input
                  type="text"
                  name="title"
                  value={newsData.title}
                  onChange={handleChange}
                  placeholder="Enter news title"
                  className={inputClass}
                />

              </div>

              {/* =================================
                  DESCRIPTION
              ================================== */}

              <div>

                <div className="
                  mb-2
                  flex
                  items-center
                  gap-2
                ">

                  <label className="
                    text-sm
                    font-medium
                    text-gray-700
                  ">
                    Description
                  </label>

                </div>

                <RichEditor
                  content={newsData.description}
                  setContent={(info: string) =>
                    setNewsData((prev) => {
                      if (!prev) return prev;

                      return {
                        ...prev,
                        description: info,
                      };
                    })
                  }
                />

                <p className="
                  mt-2
                  text-xs
                  text-gray-400
                ">
                  HTML content is supported.
                </p>

              </div>

              {/* =================================
                  DATE + CATEGORY
              ================================== */}

              <div className="
                grid
                grid-cols-1
                gap-5
                md:grid-cols-2
              ">

                {/* Date */}

                <div>

                  <label className={labelClass}>
                    Publication Date
                  </label>

                  <div className="relative">

                    <FiCalendar
                      size={17}
                      className="
                        absolute
                        left-4
                        top-1/2
                        -translate-y-1/2
                        text-gray-400
                      "
                    />

                    <input
                      type="date"
                      name="publicationDate"
                      value={
                        newsData.publicationDate
                      }
                      onChange={handleChange}
                      className={`${inputClass} pl-11`}
                    />

                  </div>

                </div>

                {/* Category */}

                <div>

                  <label className={labelClass}>
                    Category
                  </label>

                  <div className="relative">

                    <FiTag
                      size={17}
                      className="
                        pointer-events-none
                        absolute
                        left-4
                        top-1/2
                        -translate-y-1/2
                        text-gray-400
                      "
                    />

                    <select
                      name="category"
                      value={newsData.category}
                      onChange={handleChange}
                      className={`${selectClass} pl-11`}
                    >

                      <option value="">
                        Select category
                      </option>

                      {categorySelect.map(
                        (category) => (
                          <option
                            key={category}
                            value={category}
                          >
                            {category}
                          </option>
                        )
                      )}

                    </select>

                  </div>

                </div>

              </div>

            </div>

            {/* =====================================
                FOOTER
            ====================================== */}

            <div className="
              flex
              flex-col-reverse
              gap-3
              border-t
              border-gray-200
              bg-gray-50
              p-5
              sm:flex-row
              sm:justify-end
              sm:px-7
            ">

              <button
                type="button"
                onClick={() =>
                  router.push(
                    `/news/${id}/view`
                  )
                }
                disabled={saving}
                className="
                  inline-flex
                  items-center
                  justify-center
                  gap-2
                  rounded-xl
                  border
                  border-gray-300
                  px-5
                  py-3
                  text-sm
                  font-medium
                  text-gray-700
                  transition
                  hover:bg-gray-100
                  disabled:opacity-50
                "
              >
                <FiX size={16} />
                Cancel
              </button>

              <button
                type="submit"
                disabled={saving}
                className="
                  inline-flex
                  items-center
                  justify-center
                  gap-2
                  rounded-xl
                  bg-black
                  px-6
                  py-3
                  text-sm
                  font-semibold
                  text-white
                  transition
                  hover:bg-gray-800
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                "
              >

                {saving ? (
                  <>
                    <span className="
                      h-4
                      w-4
                      animate-spin
                      rounded-full
                      border-2
                      border-white/30
                      border-t-white
                    " />

                    Updating...
                  </>
                ) : (
                  <>
                    <FiSave size={17} />
                    Update News
                  </>
                )}

              </button>

            </div>

          </div>

        </form>

      </div>

    </div>
  );
};

export default Page;
