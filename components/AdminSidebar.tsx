"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  FaBars, // Added for the mobile menu button
  FaBriefcase,
  FaChartPie,
  FaChevronDown,
  FaChevronRight,
  FaCircleQuestion,
  FaFileLines,
  FaGear,
  FaGraduationCap,
  FaNewspaper,
  FaPeopleGroup,
  FaRegBell,
  FaRightFromBracket,
  FaUserTie,
  FaXmark,
} from "react-icons/fa6";
import { toast } from "react-toastify";
import axios from "axios";
import { base_url } from "./store/config";
import { MdCategory } from "react-icons/md";
import { IoAddCircleSharp } from "react-icons/io5";
import { FcExpired } from "react-icons/fc";

const PRIMARY = "#153497";

const AdminSidebar = () => {
  const pathname = usePathname();

  // State managed internally now
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>("Jobs");
  const route = useRouter()
  const navigation = [
    {
      title: "MAIN",
      items: [
        {
          name: "Dashboard",
          href: "/",
          icon: FaChartPie,
        },
      ],
    },
    {
      title: "JOB MANAGEMENT",
      items: [
         {
          name: "Category section",
          href: "/category",
          icon: MdCategory,
          
        },
        {

          
          name: "Jobs",
          icon: FaBriefcase,
            href: "/jobs",
          // children: [
          //   { name: "All Jobs", href: "/jobs" },
          //   { name: "Add Job", href: "/jobs/create" },
          //   // { name: "Pending Jobs", href: "/jobs/pending", badge: 8 },
          //   { name: "Expired Jobs", href: "/jobs/expired" },
          // ],
        },
        {

          
          name: "Add Job",
          icon: IoAddCircleSharp,
            href: "/jobs/create",
        
        },
          {

          
          name: "Expired Jobs",
          icon: FcExpired ,
            href: "/jobs/expired",},
        {
          name: "Applications",
          href: "/applications",
          icon: FaFileLines,
          // badge: 12,
        },
        {
          name: "Candidates",
          href: "/candidates",
          icon: FaPeopleGroup,
        },
        // {
        //   name: "Recruiters",
        //   href: "/recruiters",
        //   icon: FaUserTie,
        // },
      ],
    },
    {
      title: "CONTENT",
      items: [  
        { name: "News", href: "/news", icon: FaNewspaper },
        { name: "Articles", href: "/learning-articles", icon: FaFileLines },
       
        // { name: "Courses", href: "/courses", icon: FaGraduationCap },
      ],
    },
    {
      title: "SYSTEM",
      items: [
        // {   
        //   name: "Notifications",
        //   href: "/notifications",
        //   icon: FaRegBell,
        //   badge: 4,
        // },
        { name: "Settings", href: "/settings", icon: FaGear },
      ],
    },
  ];

  const isActive = (href?: string) => {
    if (!href) return false;
    return pathname === href 
  };

  const isChildActive = (children?: { href: string }[]) => {
    return children?.some((child) => isActive(child.href));
  };

  const handelLogout = async()=>{
    try {
      const response = await axios.get(`${base_url}/auth/logout`,{
        withCredentials:true
      })
       const data = await response.data;
       if(data.success){
         route.push("/login")
        }
        else{
          toast.error(data.message)
          
       }
    } catch (error : any) {
      toast.error(error?.response?.data?.message)
    }
  }









  return (
    <>
      {/* Mobile Toggle Button - Visible only on small screens to open the sidebar */}
      {!mobileOpen && (
        <button
          onClick={() => setMobileOpen(true)}
          className=" left-4 top-4 z-40 rounded-lg bg-white p-2.5 text-slate-700 shadow-md lg:hidden"
        >
          <FaBars size={20} />
        </button>
      )}

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`h-screen  md:sticky
          fixed md:relative left-0 top-0 z-50 flex  flex-col
          border-r border-slate-200 bg-white
          transition-all duration-300 ease-in-out
          lg:translate-x-0
          ${collapsed ? "w-[82px]" : "w-[250px]"} 
          ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        {/* Header - Fixed Height */}
        <div
          className={`
            flex h-[76px] shrink-0 items-center border-b border-slate-200
            ${collapsed ? "justify-center px-3" : "justify-between px-5"}
          `}
        >
          <Link
            href="/dashboard"
            className="flex items-center gap-3"
            onClick={() => setMobileOpen(false)}
          >
            <div
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-white shadow-lg"
              style={{ backgroundColor: PRIMARY }}
            >
              <FaBriefcase size={19} />
            </div>

            {!collapsed && (
              <div>
                <h1
                  className="text-xl font-extrabold tracking-tight"
                  style={{ color: PRIMARY }}
                >
                  BIMB
                </h1>
                <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-slate-400">
                  Admin Panel
                </p>
              </div>
            )}
          </Link>

          <button
            onClick={() => setMobileOpen(false)}
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 lg:hidden"
          >
            <FaXmark size={20} />
          </button>
        </div>

        {/* Profile Details - Fixed Height */}
        {!collapsed && (
          <div className="shrink-0 px-4 pt-5">
            <div className="flex items-center gap-3 rounded-2xl bg-slate-50 p-3">
              <div
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white"
                style={{ backgroundColor: PRIMARY }}
              >
                AD
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-bold text-slate-800">
                  Admin User
                </p>
                <p className="truncate text-xs text-slate-400">
                  Super Administrator
                </p>
              </div>
              <span className="ml-auto h-2.5 w-2.5 rounded-full bg-emerald-500" />
            </div>
          </div>
        )}

        {/* Scrollable Navigation - Takes Remaining Space */}
        <div className="sidebar-scroll flex-1 overflow-y-auto px-3 py-5 pb-6">
          {navigation.map((section) => (
            <div key={section.title} className="mb-6">
              {!collapsed && (
                <p className="mb-2 px-3 text-[10px] font-bold tracking-[0.15em] text-slate-400">
                  {section.title}
                </p>
              )}

              <div className="space-y-1">
                {section.items.map((item: any) => {
                  const Icon = item.icon;

                  // Render menu with sub-items
                  if (item.children) {
                   ;
                    const menuOpen = openMenu === item.name;

                    return (
                      <div key={item.name}>
                        <button
                          onClick={() => setOpenMenu(menuOpen ? null : item.name)}
                          className={`
                            group flex w-full items-center rounded-xl
                            px-3 py-2.5 text-sm font-semibold
                            transition-all duration-200
                           text-slate-600 hover:bg-slate-100 hover:text-slate-900
                            ${collapsed ? "justify-center" : "gap-3"}
                          `}
                          style={
                           { backgroundColor: PRIMARY }
                          }
                          title={collapsed ? item.name : undefined}
                        >
                          <Icon size={17} className="shrink-0" />

                          {!collapsed && (
                            <>
                              <span className="flex-1 text-left">
                                {item.name}
                              </span>
                              {menuOpen ? (
                                <FaChevronDown size={10} />
                              ) : (
                                <FaChevronRight size={10} />
                              )}
                            </>
                          )}
                        </button>

                       
                      </div>
                    );
                  }

                  // Render single menu item
                  const active = isActive(item.href);

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className={`
                        group relative flex items-center rounded-xl
                        px-3 py-2.5 text-sm font-semibold
                        transition-all duration-200
                        ${
                          active
                            ? "text-white shadow-md"
                            : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                        }
                        ${collapsed ? "justify-center" : "gap-3"}
                      `}
                      style={active ? { backgroundColor: PRIMARY } : undefined}
                      title={collapsed ? item.name : undefined}
                    >
                      <Icon size={17} className="shrink-0" />

                      {!collapsed && (
                        <>
                          <span className="flex-1">{item.name}</span>
                          {item.badge && (
                            <span
                              className={`
                                rounded-full px-2 py-0.5 text-[10px] font-bold
                                ${
                                  active
                                    ? "bg-white/20 text-white"
                                    : "bg-indigo-50"
                                }
                              `}
                              style={
                                !active ? { color: PRIMARY } : undefined
                              }
                            >
                              {item.badge}
                            </span>
                          )}
                        </>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Footer Logout Button - Fixed Height */}
        <div className="shrink-0 border-t border-slate-200 bg-white p-3">
          <button
 onClick={handelLogout}

            className={`
              flex w-full items-center rounded-xl cursor-pointer
              px-3 py-2.5 text-sm font-semibold
              text-red-500 transition-all hover:bg-red-50
              ${collapsed ? "justify-center" : "gap-3"}
            `}
            title={collapsed ? "Logout" : undefined}
          >
            <FaRightFromBracket size={17} />
            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>

      <style jsx global>{`
        .sidebar-scroll::-webkit-scrollbar {
          width: 4px;
        }
        .sidebar-scroll::-webkit-scrollbar-track {
          background: transparent;
        }
        .sidebar-scroll::-webkit-scrollbar-thumb {
          background: #dbe2f0;
          border-radius: 999px;
        }
        .sidebar-scroll::-webkit-scrollbar-thumb:hover {
          background: #c5cee2;
        }
      `}</style>
    </>
  );
};

export default AdminSidebar;