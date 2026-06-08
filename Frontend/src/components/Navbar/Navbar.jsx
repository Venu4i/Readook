import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { FiMenu } from "react-icons/fi";
import { IoClose } from "react-icons/io5";
import useLogout from "../Logout.jsx"; 
import { useSelector } from "react-redux";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const logout = useLogout();

  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const role = useSelector((state) => state.auth.role);

  let links = [
    { name: "Home", link: "/" },
    { name: "Books", link: "/books" },
  ];

  if (isLoggedIn) {
    if (role === "user") {
      links.push({ name: "Cart", link: "/cart" });
    }
    if (role === "admin") {
      links.push({ name: "Dashboard", link: "/admin-stats" });
    }
    links.push({ name: "Activity", link: "/profile" });
  }

  return (
    <div className="relative z-[100]"> {/* Wrapper - Navbar stays above Sidebar */}
      <nav className="w-full flex bg-zinc-900 px-6 py-4 text-white items-center justify-between border-b border-zinc-800">
        <NavLink to="/" className="flex gap-4 items-center border-none">
          <img className="h-10" src="./logo.png" alt="logo" />
          <h1 className="text-xl font-semibold">Readook</h1>
        </NavLink>

        <div className="flex items-center gap-4">
          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-6">
            {links.map((item, index) => (
              <NavLink
                key={index}
                to={item.link}
                className={({ isActive }) =>
                  `transition-all duration-300 px-3 py-2 rounded ${
                    isActive ? "bg-zinc-700 text-yellow-100 font-semibold" : "hover:text-yellow-100 text-zinc-300"
                  }`
                }
              >
                {item.name}
              </NavLink>
            ))}
          </div>

          {/* Desktop */}
          <div className="hidden md:flex gap-4 items-center">
            {!isLoggedIn ? (
              <>
                <NavLink to="/login" className="hover:bg-white hover:text-zinc-900 transition-all duration-300 px-4 py-2 border rounded border-zinc-700">
                  Log In
                </NavLink>
                <NavLink to="/signup" className="bg-blue-600 text-white hover:bg-blue-700 transition-all duration-300 px-4 py-2 rounded">
                  Sign Up
                </NavLink>
              </>
            ) : (
              <button onClick={logout} className="hover:bg-red-600 hover:text-white transition-all duration-300 px-4 py-2 border border-red-500 text-red-500 rounded">
                LogOut
              </button>
            )}
          </div>

          {/* Mobile */}
          <button
            className="text-white text-3xl md:hidden focus:outline-none"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <IoClose /> : <FiMenu />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="fixed inset-0 top-[72px] bg-zinc-950/95 backdrop-blur-sm w-full flex flex-col items-center px-6 py-10 space-y-8 md:hidden z-[100]">
          {links.map((item, index) => (
            <NavLink
              key={index}
              to={item.link}
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) =>
                `text-2xl transition-all duration-300 ${
                  isActive ? "text-yellow-100 font-bold" : "text-white hover:text-yellow-100"
                }`
              }
            >
              {item.name}
            </NavLink>
          ))}

          <div className="w-full h-[1px] bg-zinc-800 my-4"></div>

          {!isLoggedIn ? (
            <div className="flex flex-col gap-4 w-full items-center">
              <NavLink
                to="/login"
                onClick={() => setMenuOpen(false)}
                className="text-white border border-zinc-700 px-8 py-3 rounded-lg w-full text-center text-lg"
              >
                Log In
              </NavLink>
              <NavLink
                to="/signup"
                onClick={() => setMenuOpen(false)}
                className="bg-blue-600 text-white px-8 py-3 rounded-lg w-full text-center text-lg font-semibold"
              >
                Sign Up
              </NavLink>
            </div>
          ) : (
            <button
              onClick={() => { logout(); setMenuOpen(false); }}
              className="text-red-500 border border-red-500 px-8 py-3 rounded-lg w-full text-center text-lg font-semibold"
            >
              LogOut
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default Navbar;