import React from "react";
import { Link } from "react-router-dom"; // Import Link from react-router-dom

const Navbar = () => {
  const handleLogout = () => {
    sessionStorage.removeItem("isLogin");
    sessionStorage.removeItem("email");
    window.location.href = "/";
  };
  return (
    <nav className="bg-white text-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="text-2xl font-bold text-indigo-600">
              Idsa Medika
            </div>
            <div className="hidden md:block ml-10">
              {/* <div className="flex space-x-4">
                <button
                  onClick={handleLogout}
                  className="hover:bg-indigo-100 duration-300 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Logout
                </button>
              </div> */}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
