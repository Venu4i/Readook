import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { FiMenu } from "react-icons/fi";
import { IoClose } from "react-icons/io5";
import useLogout from "../Logout.jsx"; 
import { useSelector } from "react-redux";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const logout = useLogout();

  // Get auth state from Redux
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const role = useSelector((state) => state.auth.role);

  // Define base links available to everyone
  let links = [
    { name: "Home", link: "/" },
    { name: "Books", link: "/books" },
  ];

  // Logic to push links based on role and login status
  if (isLoggedIn) {
    // Only 'user' role sees the Cart
    if (role === "user") {
      links.push({ name: "Cart", link: "/cart" });
    }

    // Only 'admin' or 'seller' roles see the Stats/Dashboard
    if (role === "admin") {
      links.push({ name: "Dashboard", link: "/admin-stats" });
    }

    // Everyone logged in sees their Profile
    links.push({ name: "Activity", link: "/profile" });
  }

  return (
    <>
      <nav className="w-full relative flex bg-zinc-900 px-6 py-4 text-white items-center justify-between z-50">
        <NavLink 
          to="/"
          className="flex gap-4 items-center border-none">
          <img className="h-10 mx-4" src="./logo.png" alt="logo" />
          <h1 className="text-xl font-semibold">Readook</h1>
        </NavLink>

        <div className="flex gap-4">
          <div className="hidden md:flex items-center gap-6">
            {links.map((item, index) => (
              <NavLink
                key={index}
                to={item.link}
                className={({ isActive }) =>
                  `transition-all duration-300 px-3 py-2 rounded ${
                    isActive ? "bg-zinc-700 text-yellow-100 font-semibold" : "hover:text-yellow-100"
                  }`
                }
              >
                {item.name}
              </NavLink>
            ))}
          </div>

          <div className="hidden md:flex gap-4">
            {!isLoggedIn ? (
              <>
                <NavLink
                  to="/login"
                  className="hover:text-white hover:bg-blue-500 transition-all duration-300 px-4 py-2 border rounded"
                >
                  Log In
                </NavLink>
                <NavLink
                  to="/signup"
                  className="hover:text-white hover:bg-blue-500 transition-all duration-300 px-4 py-2 border rounded border-blue-400"
                >
                  Sign Up
                </NavLink>
              </>
            ) : (
              <button 
                onClick={logout}
                className="hover:text-white hover:bg-red-500 transition-all duration-300 px-4 py-2 border border-red-500 rounded"
              >
                LogOut
              </button>
            )}
          </div>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="text-white text-2xl md:hidden"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <IoClose /> : <FiMenu />}
        </button>
      </nav>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="bg-zinc-900 w-full absolute top-full left-0 flex flex-col items-center px-6 py-6 space-y-8 md:hidden z-40 border-t border-zinc-800">
          {links.map((item, index) => (
            <NavLink
              key={index}
              to={item.link}
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) =>
                `text-white text-lg px-4 py-2 rounded transition-all duration-300 ${
                  isActive ? "bg-zinc-700 text-yellow-100 font-semibold" : "hover:text-yellow-100"
                }`
              }
            >
              {item.name}
            </NavLink>
          ))}

          {!isLoggedIn ? (
            <div className="flex flex-col gap-4 w-full items-center">
              <NavLink
                to="/login"
                onClick={() => setMenuOpen(false)}
                className="text-white border border-blue-400 px-8 py-2 rounded hover:bg-blue-500 transition-all duration-300 w-2/3 text-center"
              >
                Log In
              </NavLink>
              <NavLink
                to="/signup"
                onClick={() => setMenuOpen(false)}
                className="text-white border border-blue-400 px-8 py-2 rounded hover:bg-blue-500 transition-all duration-300 w-2/3 text-center"
              >
                Sign Up
              </NavLink>
            </div>
          ) : (
            <button
              onClick={() => { logout(); setMenuOpen(false); }}
              className="text-white border border-red-500 px-8 py-2 rounded hover:bg-red-500 transition-all duration-300 w-2/3 text-center"
            >
              LogOut
            </button>
          )}
        </div>
      )}
    </>
  );
};

export default Navbar;