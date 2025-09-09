import { useEffect, useRef, useState } from "react";
import {
  Menu, X, Home, History, BadgeDollarSign, Goal, UserCircle, SlidersVertical
} from "lucide-react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { useAppContext } from "../contexts/AppProvider";
import SkeletonLoader from "../components/SkeletonLoader";

export default function UserLayout() {
  const { setSearch, logout, navigate, user, loading } = useAppContext();
  const location = useLocation();

  const [isOpen, setIsOpen] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  const sidebarRef = useRef(null);
  const toggleRef = useRef(null);
  const userDropdownRef = useRef(null);

  const handleLogout = async () => {
    try {
      const res = await logout();
    } catch (error) {
      return null;
    }
  }

  const menuItems = [
    { name: "Dashboard", icon: <Home size={20} />, href: "/" },
    { name: "Add Transactions", icon: <BadgeDollarSign size={20} />, href: "/add-transactions" },
    { name: "Budgets", icon: <Goal size={20} />, href: "/budgets" },
    { name: "Set Budgets", icon: <SlidersVertical size={20} />, href: "/set-budgets" },
    { name: "Transactions", icon: <History size={20} />, href: "/transactions" },
  ];

  useEffect(() => {
    const handleClickOutside = (e) => {
      const isMobile = window.innerWidth < 768;

      if (isMobile && isOpen &&
        !sidebarRef.current?.contains(e.target) &&
        !toggleRef.current?.contains(e.target)
      ) {
        setIsOpen(false);
      }

      if (showUserDropdown && !userDropdownRef.current?.contains(e.target)) {
        setShowUserDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, showUserDropdown]);

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <aside
        ref={sidebarRef}
        className={`fixed md:static z-40 top-0 left-0 h-full w-64 bg-white dark:bg-gray-900 border-r border-gray-300 dark:border-gray-700
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
      >
        <div className="flex items-center justify-between px-5 py-8">
          <span
            onClick={() => navigate("/")}
            className="text-xl text-indigo-600 font-bold flex items-center gap-2 cursor-pointer"
          >
            <img src="./logo.png" alt="" className="size-8" /> FinSight
          </span>
          <button
            ref={toggleRef}
            className="md:hidden"
            onClick={() => setIsOpen(false)}
          >
            <X size={24} />
          </button>
        </div>

        <nav className="px-5 space-y-4">
          {menuItems.map(({ name, icon, href }) => (
            <Link
              key={href}
              to={href}
              className={`flex items-center gap-3 py-3 px-2.5 font-semibold rounded-lg border
              ${location.pathname === href
                  ? "bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-900/50 dark:text-indigo-300 dark:border-indigo-700"
                  : "border-transparent text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                }`}
            >
              {icon} <span>{name}</span>
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full">
        {/* Header */}
        <header className="sticky top-0 z-30 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-4 py-4 flex items-center justify-between gap-4">
          <button
            ref={toggleRef}
            className="md:hidden text-gray-800 dark:text-gray-200"
            onClick={() => setIsOpen(true)}
          >
            <Menu size={24} />
          </button>

          <div className="flex items-center justify-between md:w-full gap-4">
            {/* Search */}
            <div className="hidden md:flex items-center border pl-3 gap-2 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 h-[46px] rounded-md w-full max-w-md">
              <input
                type="text"
                placeholder="Search transactions..."
                className="w-full h-full text-sm text-gray-600 dark:text-gray-300 bg-transparent outline-none"
                onChange={(e) => {
                  setSearch(e.target.value);
                  navigate("/transactions");
                }}
              />
            </div>

            {/* User Dropdown */}
            <div className="flex items-center gap-4">
              <div className="relative" ref={userDropdownRef}>
                <button onClick={() => setShowUserDropdown(prev => !prev)} className="cursor-pointer">
                  <UserCircle size={30} className="text-gray-700 dark:text-gray-300" />
                </button>

                {showUserDropdown && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 z-50">
                    <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2">{user.email}</p>
                    <button
                      className="text-red-500 cursor-pointer bg-red-50 dark:bg-red-900/50 border w-full px-3 py-2 rounded border-red-500 text-sm font-medium"
                      onClick={handleLogout}
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Scrollable Page Content */}
        <main className="p-6 bg-gray-50 dark:bg-gray-950 flex-1 overflow-y-auto">
          {loading ? <SkeletonLoader /> : <Outlet />}
        </main>
      </div>
    </div>
  );
}
