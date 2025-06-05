import React, { useState } from "react";
import { AiFillTags } from "react-icons/ai";
import { FaBlog, FaSignInAlt, FaUser , RiAdvertisementFill } from "react-icons/fa";
import { IoMdLogOut } from "react-icons/io";
import { IoMenu } from "react-icons/io5";
import { RxDashboard } from "react-icons/rx";
import { SiGooglenews } from "react-icons/si";
import { TbCategoryPlus } from "react-icons/tb";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../Context/authContext";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  Button,
} from "@mui/material";

const Sidebar = ({ isOpen, setIsOpen }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, updateUser } = useAuth();

  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogoutClick = () => {
    setLogoutDialogOpen(true);
  };

  const handleLogoutConfirm = () => {
    setIsLoggingOut(true);
    setTimeout(() => {
      localStorage.removeItem("user");
      updateUser(null);
      navigate("/login");
      setLogoutDialogOpen(false);
      setIsLoggingOut(false);
    }, 1000);
  };

  const handleLogoutCancel = () => {
    setLogoutDialogOpen(false);
  };

  const getLinkClass = (path) =>
    `flex items-center p-2 rounded-lg transition-all duration-200 ${
      location.pathname === path
        ? "bg-gray-200 dark:bg-gray-700 text-white font-semibold"
        : "text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700"
    }`;

  return (
    <>
      {/* Top Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 w-full bg-white border-b h-20 border-gray-200 dark:bg-gray-800 dark:border-gray-700">
        <div className="px-3 py-4 lg:px-1 lg:pl-3">
          <div className="flex items-center justify-between sm:px-10 px-2">
            <div className="flex items-center">
              <button
                onClick={() => setIsOpen((prev) => !prev)}
                className="inline-flex items-center text-sm text-gray-500 rounded-lg hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
              >
                <IoMenu className="w-10 h-10 text-gray-500 dark:text-gray-400" />
              </button>
            </div>
            <div className="flex items-center">
              <div className="flex pl-2 items-center gap-3">
                <div className="bg-gradient-to-r from-gray-300 to-gray-400 text-black rounded-full h-12 w-12 flex items-center justify-center text-xl font-semibold">
                  {user?.firstName?.charAt(0).toUpperCase()}
                  {user?.lastName?.charAt(0).toUpperCase()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-40 w-64 h-full pt-24 pl-7 transition-transform bg-white border-r border-gray-200 dark:bg-gray-800 dark:border-gray-700 transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="h-full px-2 pb-4 overflow-y-auto">
          <ul className="space-y-2 font-medium">
            <li>
              <a href="/home" className={getLinkClass("/home")}>
                <RxDashboard className="w-5 h-5 text-inherit" />
                <span className="ml-3">Dashboard</span>
              </a>
            </li>
            <li>
              <a href="/tag" className={getLinkClass("/tag")}>
                <AiFillTags className="w-5 h-5 text-inherit" />
                <span className="ml-3">Tags</span>
              </a>
            </li>
            <li>
              <a href="/category" className={getLinkClass("/category")}>
                <TbCategoryPlus className="w-5 h-5 text-inherit" />
                <span className="ml-3">Category</span>
              </a>
            </li>
            <li>
              <a href="/news" className={getLinkClass("/news")}>
                <SiGooglenews className="w-5 h-5 text-inherit" />
                <span className="ml-3">News</span>
              </a>
            </li>
            <li>
              <a href="/blog" className={getLinkClass("/blog")}>
                <FaBlog className="w-5 h-5 text-inherit" />
                <span className="ml-3">Blog</span>
              </a>
            </li>
             {/* <li>
              <a href="/campaign" className={getLinkClass("/campaign")}>
                <FaBlog className="w-5 h-5 text-inherit" />
                <span className="ml-3">Campaign</span>
              </a>
            </li> */}
            <li>
              <a href="/user" className={getLinkClass("/user")}>
                <FaUser className="w-5 h-5 text-inherit" />
                <span className="ml-3">User</span>
              </a>
            </li>
            <li>
              {user ? (
                <div
                  onClick={handleLogoutClick}
                  className="cursor-pointer flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <IoMdLogOut className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                  <span className="ml-3">Logout</span>
                </div>
              ) : (
                <div className="flex items-center p-2 rounded-lg text-gray-400 cursor-not-allowed dark:text-gray-400">
                  <IoMdLogOut className="w-5 h-5" />
                  <span className="ml-3">Logout</span>
                </div>
              )}
            </li>
          </ul>
        </div>
      </aside>

      {/* Logout Confirmation Dialog */}
      <Dialog
        open={logoutDialogOpen}
        onClose={handleLogoutCancel}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Confirm Logout</DialogTitle>
        <DialogContent>
          <p>Are you sure you want to logout?</p>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleLogoutCancel} color="secondary">
            Cancel
          </Button>
          <Button
            onClick={handleLogoutConfirm}
            variant="contained"
            color="error"
            disabled={isLoggingOut}
          >
            Logout
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Sidebar;
