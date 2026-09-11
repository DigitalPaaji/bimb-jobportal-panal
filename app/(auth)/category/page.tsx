"use client";

import { base_url } from "@/components/store/config";
import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  PiArrowRight,
  PiCheck,
  PiPencilSimple,
  PiPlus,
  PiX,
} from "react-icons/pi";
import {
  RiDeleteBin6Line,
  RiFolder3Line,
  RiListCheck2,
} from "react-icons/ri";
import { toast } from "react-toastify";

axios.defaults.withCredentials = true;

/* =========================
   TYPES
========================= */

interface Category {
  _id: string;
  title: string;
  slug: string;
  subcat: string[];
  jobs: string[];
  createdAt: string;
  updatedAt: string;
}

interface SubCategory {
  _id: string;
  title: string;
  slug: string;
  category:
    | string
    | {
        _id: string;
        title: string;
      };
  jobs: string[];
  createdAt: string;
  updatedAt: string;
}

/* =========================
   PAGE
========================= */

const Page = () => {
  /* =========================
     CATEGORY STATES
  ========================= */

  const [inputCategory, setInputCategory] = useState("");
  const [allCategory, setAllCategory] = useState<Category[]>([]);

  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(
    null
  );

  const [editingCategoryTitle, setEditingCategoryTitle] = useState("");

  const [categoryLoading, setCategoryLoading] = useState(false);

  /* =========================
     SUBCATEGORY STATES
  ========================= */

  const [allSubCategory, setAllSubCategory] = useState<SubCategory[]>([]);

  const [subCatData, setSubCatData] = useState({
    title: "",
    categoryId: "",
  });

  const [editingSubCategoryId, setEditingSubCategoryId] = useState<
    string | null
  >(null);

  const [editingSubCategoryTitle, setEditingSubCategoryTitle] = useState("");

  const [subCategoryLoading, setSubCategoryLoading] = useState(false);

  /* =========================
     FETCH CATEGORY
  ========================= */

  const fetchAllCate = async () => {
    try {
      const response = await axios.get(`${base_url}/category/get`);

      const data = response.data;

      if (data.success) {
        setAllCategory(data.allCategory || []);
      } else {
        setAllCategory([]);
        toast.error(data.message);
      }
    } catch (error: any) {
      setAllCategory([]);

      toast.error(
        error?.response?.data?.message || "Failed to fetch categories"
      );
    }
  };


  const fetchAllSubCate = async () => {
    try {
      const response = await axios.get(`${base_url}/category/sub/get`);

      const data = response.data;

      if (data.success) {
        setAllSubCategory(data.subCategory || []);
      } else {
        setAllSubCategory([]);
        toast.error(data.message);
      }
    } catch (error: any) {
      setAllSubCategory([]);

      toast.error(
        error?.response?.data?.message || "Failed to fetch subcategories"
      );
    }
  };




  const handelAddCategory = async () => {
    if (!inputCategory.trim()) {
      toast.warn("Category title is required");
      return;
    }

    setCategoryLoading(true);

    try {
      const response = await axios.post(`${base_url}/category/create`, {
        title: inputCategory.trim(),
      });

      const data = response.data;

      if (data.success) {
        toast.success(data.message || "Category created");

        if (data.category) {
          setAllCategory((prev) => [data.category, ...prev]);
        } else {
          await fetchAllCate();
        }

        setInputCategory("");
      } else {
        toast.error(data.message);
      }
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || "Failed to create category"
      );
    } finally {
      setCategoryLoading(false);
    }
  };

  /* =========================
     EDIT CATEGORY
  ========================= */

  const startEditCategory = (category: Category) => {
    setEditingCategoryId(category._id);
    setEditingCategoryTitle(category.title);
  };

  const cancelEditCategory = () => {
    setEditingCategoryId(null);
    setEditingCategoryTitle("");
  };

  const updateCategory = async (id: string) => {
    if (!editingCategoryTitle.trim()) {
      toast.warn("Category title is required");
      return;
    }

    setCategoryLoading(true);

    try {
      const response = await axios.put(
        `${base_url}/category/update/${id}`,
        {
          title: editingCategoryTitle.trim(),
        }
      );

      const data = response.data;

      if (data.success) {
        toast.success(data.message || "Category updated");

        if (data.category) {
          setAllCategory((prev) =>
            prev.map((item) =>
              item._id === id ? data.category : item
            )
          );
        } else {
          await fetchAllCate();
        }

        cancelEditCategory();
      } else {
        toast.error(data.message);
      }
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || "Failed to update category"
      );
    } finally {
      setCategoryLoading(false);
    }
  };



  const deleteCategory = async (id: string) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this category?"
    );

    if (!confirmDelete) return;

    setCategoryLoading(true);

    try {
      const response = await axios.delete(
        `${base_url}/category/delete/${id}`
      );

      const data = response.data;

      if (data.success) {
        toast.success(data.message || "Category deleted");

        setAllCategory((prev) =>
          prev.filter((item) => item._id !== id)
        );

        // Remove related subcategories from UI
        setAllSubCategory((prev) =>
          prev.filter((item) => {
            const categoryId =
              typeof item.category === "string"
                ? item.category
                : item.category?._id;

            return categoryId !== id;
          })
        );
      } else {
        toast.error(data.message);
      }
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message
      );
    } finally {
      setCategoryLoading(false);
    }
  };

  /* =========================
     ADD SUBCATEGORY
  ========================= */

  const handelAddSubcat = async () => {
    if (!subCatData.title.trim()) {
      toast.warn("Subcategory title is required");
      return;
    }

    if (!subCatData.categoryId) {
      toast.warn("Please select a category");
      return;
    }

    setSubCategoryLoading(true);

    try {
      const response = await axios.post(
        `${base_url}/category/sub/create`,
        {
          title: subCatData.title.trim(),
          categoryId: subCatData.categoryId,
        }
      );

      const data = response.data;

      if (data.success) {
        toast.success(data.message || "Subcategory created");

        if (data.subcategory) {
          setAllSubCategory((prev) => [
            data.subcategory,
            ...prev,
          ]);

          // Update category count immediately
          setAllCategory((prev) =>
            prev.map((category) =>
              category._id === subCatData.categoryId
                ? {
                    ...category,
                    subcat: [
                      data.subcategory._id,
                      ...category.subcat,
                    ],
                  }
                : category
            )
          );
        } else {
          await Promise.all([
            fetchAllCate(),
            fetchAllSubCate(),
          ]);
        }

        setSubCatData({
          title: "",
          categoryId: "",
        });
      } else {
        toast.error(data.message);
      }
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ||
          "Failed to create subcategory"
      );
    } finally {
      setSubCategoryLoading(false);
    }
  };

  /* =========================
     EDIT SUBCATEGORY
  ========================= */

  const startEditSubCategory = (item: SubCategory) => {
    setEditingSubCategoryId(item._id);
    setEditingSubCategoryTitle(item.title);
  };

  const cancelEditSubCategory = () => {
    setEditingSubCategoryId(null);
    setEditingSubCategoryTitle("");
  };

  const updateSubCategory = async (id: string) => {
    if (!editingSubCategoryTitle.trim()) {
      toast.warn("Subcategory title is required");
      return;
    }

    setSubCategoryLoading(true);

    try {
      const response = await axios.put(
        `${base_url}/category/sub/update/${id}`,
        {
          title: editingSubCategoryTitle.trim(),
        }
      );

      const data = response.data;

      if (data.success) {
        toast.success(data.message || "Subcategory updated");

        if (data.subcategory) {
          setAllSubCategory((prev) =>
            prev.map((item) =>
              item._id === id ? data.subcategory : item
            )
          );
        } else {
          await fetchAllSubCate();
        }

        cancelEditSubCategory();
      } else {
        toast.error(data.message);
      }
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ||
          "Failed to update subcategory"
      );
    } finally {
      setSubCategoryLoading(false);
    }
  };

  /* =========================
     DELETE SUBCATEGORY
  ========================= */

  const deleteSubCategory = async (
    id: string,
    categoryId: string
  ) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this subcategory?"
    );

    if (!confirmDelete) return;

    setSubCategoryLoading(true);

    try {
      const response = await axios.delete(
        `${base_url}/category/sub/delete/${id}`
      );

      const data = response.data;

      if (data.success) {
        toast.success(data.message || "Subcategory deleted");

        // Remove from subcategory list
        setAllSubCategory((prev) =>
          prev.filter((item) => item._id !== id)
        );

        // Remove subcategory ID from category
        setAllCategory((prev) =>
          prev.map((category) =>
            category._id === categoryId
              ? {
                  ...category,
                  subcat: category.subcat.filter(
                    (subId) => subId !== id
                  ),
                }
              : category
          )
        );
      } else {
        toast.error(data.message);
      }
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ||
          "Failed to delete subcategory"
      );
    } finally {
      setSubCategoryLoading(false);
    }
  };

  /* =========================
     CATEGORY ID HELPER
  ========================= */

  const getCategoryId = (category: SubCategory["category"]) => {
    if (typeof category === "string") {
      return category;
    }

    return category?._id || "";
  };

  /* =========================
     CATEGORY TITLE HELPER
  ========================= */

  const getCategoryTitle = (category: SubCategory["category"]) => {
    if (typeof category === "string") {
      const found = allCategory.find(
        (item) => item._id === category
      );

      return found?.title || "Unknown Category";
    }

    return category?.title || "Unknown Category";
  };

  /* =========================
     INITIAL FETCH
  ========================= */

  useEffect(() => {
    fetchAllCate();
    fetchAllSubCate();
  }, []);

  /* =========================
     UI
  ========================= */

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">

        {/* ================= HEADER ================= */}

        <div className="mb-8">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-200">
              <RiFolder3Line size={24} />
            </div>

            <div>
              <h1 className="text-2xl font-bold text-slate-900">
                Categories
              </h1>

              <p className="text-sm text-slate-500">
                Manage job categories and subcategories
              </p>
            </div>
          </div>
        </div>

        {/* ================= STATS ================= */}

        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-slate-500">
              Total Categories
            </p>

            <p className="mt-1 text-3xl font-bold text-slate-900">
              {allCategory.length}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-slate-500">
              Total Subcategories
            </p>

            <p className="mt-1 text-3xl font-bold text-slate-900">
              {allSubCategory.length}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-slate-500">
              Total Jobs
            </p>

            <p className="mt-1 text-3xl font-bold text-slate-900">
              {allCategory.reduce(
                (total, item) =>
                  total + (item.jobs?.length || 0),
                0
              )}
            </p>
          </div>

        </div>

        {/* ================= MAIN GRID ================= */}

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">

          {/* =================================================
              CATEGORY SECTION
          ================================================= */}

          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

            {/* Header */}

            <div className="border-b border-slate-200 p-5">
              <div className="mb-4 flex items-center justify-between">

                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                    <RiFolder3Line size={21} />
                  </div>

                  <div>
                    <h2 className="font-semibold text-slate-900">
                      Categories
                    </h2>

                    <p className="text-xs text-slate-500">
                      {allCategory.length} categories
                    </p>
                  </div>
                </div>

                <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-600">
                  {allCategory.length}
                </span>

              </div>

              {/* Add Category */}

              <div className="flex gap-2">

                <input
                  type="text"
                  placeholder="Enter category name..."
                  value={inputCategory}
                  disabled={categoryLoading}
                  onChange={(e) =>
                    setInputCategory(e.target.value)
                  }
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handelAddCategory();
                    }
                  }}
                  className="h-11 flex-1 rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-50 disabled:cursor-not-allowed disabled:opacity-60"
                />

                <button
                  type="button"
                  onClick={handelAddCategory}
                  disabled={categoryLoading}
                  className="flex h-11 items-center gap-2 rounded-xl bg-indigo-600 px-4 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <PiPlus size={18} />

                  <span className="hidden sm:inline">
                    Add
                  </span>
                </button>

              </div>
            </div>

            {/* Category List */}

            <div className="max-h-[600px] overflow-y-auto p-3">

              {allCategory.length === 0 ? (

                <div className="flex min-h-[300px] flex-col items-center justify-center text-center">
                  <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                    <RiFolder3Line size={28} />
                  </div>

                  <p className="font-medium text-slate-700">
                    No categories found
                  </p>

                  <p className="mt-1 text-sm text-slate-400">
                    Create your first job category
                  </p>
                </div>

              ) : (

                <div className="space-y-2">

                  {allCategory.map((item, index) => {

                    const isEditing =
                      editingCategoryId === item._id;

                    return (
                      <div
                        key={item._id}
                        className="group rounded-xl border border-slate-100 bg-slate-50 p-4 transition hover:border-slate-200 hover:bg-white hover:shadow-sm"
                      >

                        {isEditing ? (

                          <div className="flex items-center gap-2">

                            <input
                              autoFocus
                              type="text"
                              value={editingCategoryTitle}
                              onChange={(e) =>
                                setEditingCategoryTitle(
                                  e.target.value
                                )
                              }
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  updateCategory(item._id);
                                }

                                if (e.key === "Escape") {
                                  cancelEditCategory();
                                }
                              }}
                              className="h-10 flex-1 rounded-lg border border-indigo-300 bg-white px-3 text-sm outline-none ring-4 ring-indigo-50"
                            />

                            <button
                              onClick={() =>
                                updateCategory(item._id)
                              }
                              disabled={categoryLoading}
                              className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500 text-white hover:bg-emerald-600 disabled:opacity-50"
                            >
                              <PiCheck size={19} />
                            </button>

                            <button
                              onClick={cancelEditCategory}
                              className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-200 text-slate-600 hover:bg-slate-300"
                            >
                              <PiX size={19} />
                            </button>

                          </div>

                        ) : (

                          <div className="flex items-center gap-3">

                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-sm font-bold text-indigo-600 shadow-sm">
                              {String(index + 1).padStart(
                                2,
                                "0"
                              )}
                            </div>

                            <div className="min-w-0 flex-1">

                              <h3 className="truncate text-sm font-semibold text-slate-800">
                                {item.title}
                              </h3>

                              <p className="mt-1 truncate text-xs text-slate-400">
                                /{item.slug}
                              </p>

                            </div>

                            <div className="hidden items-center gap-2 sm:flex">

                              <span className="rounded-lg bg-blue-50 px-2.5 py-1.5 text-xs font-medium text-blue-600">
                                {item.jobs?.length || 0} Jobs
                              </span>

                              <span className="rounded-lg bg-purple-50 px-2.5 py-1.5 text-xs font-medium text-purple-600">
                                {item.subcat?.length || 0} Sub
                              </span>

                            </div>

                            <div className="flex items-center gap-1">

                              <button
                                type="button"
                                title="Edit category"
                                onClick={() =>
                                  startEditCategory(item)
                                }
                                className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition hover:bg-indigo-50 hover:text-indigo-600"
                              >
                                <PiPencilSimple size={18} />
                              </button>

                              <button
                                type="button"
                                title="Delete category"
                                onClick={() =>
                                  deleteCategory(item._id)
                                }
                                className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition hover:bg-red-50 hover:text-red-500"
                              >
                                <RiDeleteBin6Line size={18} />
                              </button>

                            </div>

                          </div>

                        )}

                      </div>
                    );
                  })}

                </div>

              )}

            </div>
          </section>

          {/* =================================================
              SUBCATEGORY SECTION
          ================================================= */}

          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

            {/* Header */}

            <div className="border-b border-slate-200 p-5">

              <div className="mb-4 flex items-center justify-between">

                <div className="flex items-center gap-3">

                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
                    <RiListCheck2 size={21} />
                  </div>

                  <div>
                    <h2 className="font-semibold text-slate-900">
                      Subcategories
                    </h2>

                    <p className="text-xs text-slate-500">
                      {allSubCategory.length} subcategories
                    </p>
                  </div>

                </div>

                <span className="rounded-full bg-purple-50 px-3 py-1 text-xs font-semibold text-purple-600">
                  {allSubCategory.length}
                </span>

              </div>

              {/* Add Subcategory */}

              <div className="space-y-2">

                <input
                  type="text"
                  placeholder="Enter subcategory name..."
                  value={subCatData.title}
                  disabled={subCategoryLoading}
                  onChange={(e) =>
                    setSubCatData((prev) => ({
                      ...prev,
                      title: e.target.value,
                    }))
                  }
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handelAddSubcat();
                    }
                  }}
                  className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-purple-500 focus:bg-white focus:ring-4 focus:ring-purple-50 disabled:opacity-60"
                />

                <div className="flex gap-2">

                  <select
                    value={subCatData.categoryId}
                    disabled={subCategoryLoading}
                    onChange={(e) =>
                      setSubCatData((prev) => ({
                        ...prev,
                        categoryId: e.target.value,
                      }))
                    }
                    className="h-11 flex-1 rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-600 outline-none transition focus:border-purple-500 focus:bg-white focus:ring-4 focus:ring-purple-50 disabled:opacity-60"
                  >

                    <option value="">
                      -- Select Category --
                    </option>

                    {allCategory.map((item) => (
                      <option
                        value={item._id}
                        key={item._id}
                      >
                        {item.title}
                      </option>
                    ))}

                  </select>

                  <button
                    type="button"
                    onClick={handelAddSubcat}
                    disabled={subCategoryLoading}
                    className="flex h-11 items-center gap-2 rounded-xl bg-purple-600 px-4 text-sm font-semibold text-white transition hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <PiPlus size={18} />

                    <span className="hidden sm:inline">
                      Add
                    </span>
                  </button>

                </div>

              </div>
            </div>

            {/* Subcategory List */}

            <div className="max-h-[600px] overflow-y-auto p-3">

              {allSubCategory.length === 0 ? (

                <div className="flex min-h-[300px] flex-col items-center justify-center text-center">

                  <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                    <RiListCheck2 size={28} />
                  </div>

                  <p className="font-medium text-slate-700">
                    No subcategories found
                  </p>

                  <p className="mt-1 text-sm text-slate-400">
                    Add a subcategory to organize jobs
                  </p>

                </div>

              ) : (

                <div className="space-y-2">

                  {allSubCategory.map((item) => {

                    const isEditing =
                      editingSubCategoryId === item._id;

                    const categoryId = getCategoryId(
                      item.category
                    );

                    return (
                      <div
                        key={item._id}
                        className="group rounded-xl border border-slate-100 bg-slate-50 p-4 transition hover:border-slate-200 hover:bg-white hover:shadow-sm"
                      >

                        {isEditing ? (

                          <div className="flex items-center gap-2">

                            <input
                              autoFocus
                              type="text"
                              value={editingSubCategoryTitle}
                              onChange={(e) =>
                                setEditingSubCategoryTitle(
                                  e.target.value
                                )
                              }
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  updateSubCategory(
                                    item._id
                                  );
                                }

                                if (e.key === "Escape") {
                                  cancelEditSubCategory();
                                }
                              }}
                              className="h-10 flex-1 rounded-lg border border-purple-300 bg-white px-3 text-sm outline-none ring-4 ring-purple-50"
                            />

                            <button
                              onClick={() =>
                                updateSubCategory(
                                  item._id
                                )
                              }
                              disabled={subCategoryLoading}
                              className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500 text-white hover:bg-emerald-600 disabled:opacity-50"
                            >
                              <PiCheck size={19} />
                            </button>

                            <button
                              onClick={cancelEditSubCategory}
                              className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-200 text-slate-600 hover:bg-slate-300"
                            >
                              <PiX size={19} />
                            </button>

                          </div>

                        ) : (

                          <div className="flex items-center gap-3">

                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-purple-600 shadow-sm">
                              <RiListCheck2 size={19} />
                            </div>

                            <div className="min-w-0 flex-1">

                              <h3 className="truncate text-sm font-semibold text-slate-800">
                                {item.title}
                              </h3>

                              <p className="mt-1 truncate text-xs text-slate-400">
                                /{item.slug}
                              </p>

                              <div className="mt-2 flex items-center gap-2">

                                <span className="rounded-md bg-purple-50 px-2 py-1 text-[11px] font-medium text-purple-600">
                                  {getCategoryTitle(
                                    item.category
                                  )}
                                </span>

                                <span className="rounded-md bg-blue-50 px-2 py-1 text-[11px] font-medium text-blue-600">
                                  {item.jobs?.length || 0} Jobs
                                </span>

                              </div>

                            </div>

                            <div className="flex items-center gap-1">

                              <button
                                type="button"
                                title="Edit subcategory"
                                onClick={() =>
                                  startEditSubCategory(
                                    item
                                  )
                                }
                                className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition hover:bg-purple-50 hover:text-purple-600"
                              >
                                <PiPencilSimple size={18} />
                              </button>

                              <button
                                type="button"
                                title="Delete subcategory"
                                onClick={() =>
                                  deleteSubCategory(
                                    item._id,
                                    categoryId
                                  )
                                }
                                className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition hover:bg-red-50 hover:text-red-500"
                              >
                                <RiDeleteBin6Line size={18} />
                              </button>

                            </div>

                          </div>

                        )}

                      </div>
                    );
                  })}

                </div>

              )}

            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Page;

