import { useState } from "react";
import { Route, Routes, useLocation, Navigate } from "react-router-dom";
import "./App.css";
import Sidebar from "./Admin/sidebar";
import Tag from "./Components/tag";
import Category from "./Components/category";
import News from "./Components/news";
import Dashboard from "./Components/dashboard";
import Login from "./Register/login";
import Blog from "./Components/blog";
import User from "./Components/user";

function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

function RedirectRoute() {
  const token = localStorage.getItem("token");
  return token ? <Navigate to="/home" replace /> : <Navigate to="/login" replace />;
}

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();
  const isLoginPage = location.pathname === "/login";

  return (
    <div className="h-screen w-full">
      {/* Show sidebar only if not on login page */}
      {!isLoginPage && (
        <div
          className={`fixed top-0 left-0 h-full transition-all duration-300 z-10 ${
            sidebarOpen ? "w-[240px]" : "w-0 overflow-hidden"
          }`}
        >
          <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
        </div>
      )}

      {/* Main content */}
      <div
        className={`flex flex-col overflow-y-auto transition-all duration-300 pt-20 pr-2 `}
        style={{
          marginLeft: !isLoginPage && sidebarOpen ? "240px" : "0",
          width: !isLoginPage && sidebarOpen ? "calc(100% - 240px)" : "100%",
        }}
      >
        <Routes>
          {/* Auto redirect from `/` based on token */}
          <Route path="/" element={<RedirectRoute />} />

          <Route path="/login" element={<Login />} />

          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/tag"
            element={
              <ProtectedRoute>
                <Tag />
              </ProtectedRoute>
            }
          />
          <Route
            path="/category"
            element={
              <ProtectedRoute>
                <Category />
              </ProtectedRoute>
            }
          />
          <Route
            path="/news"
            element={
              <ProtectedRoute>
                <News />
              </ProtectedRoute>
            }
          />
          <Route
            path="/blog"
            element={
              <ProtectedRoute>
                <Blog />
              </ProtectedRoute>
            }
          />
            {/* <Route
            path="/campaign"
            element={
              <ProtectedRoute>
                < Campaign/>
              </ProtectedRoute>
            }
          /> */}
          <Route
            path="/user"
            element={
              <ProtectedRoute>
                <User />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </div>
  );
}

export default App;
