import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { FiMenu } from "react-icons/fi";
import { IoClose } from "react-icons/io5";
import useLogout from "../Logout.jsx"; 

import {useSelector} from "react-redux";


const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const logout = useLogout();

  const Links = [
    { name: "Home", link: "/" },
    { name: "Books", link: "/books" },
    { name: "Cart", link: "/cart" },
    { name: "Profile", link: "/profile" },
    { name: "Admin Profile", link: "/profile"}
  ];

  const isLoggedIn =useSelector ( (state) => state.auth.isLoggedIn );
  const role = useSelector((state) => state.auth.role);
  // console.log(isLoggedIn);
 if(isLoggedIn === false){
  Links.splice(2,3); //from 2nd indx and quantity = 2 links 
 }
 if(isLoggedIn === true && (role === "admin" || role === "seller")){
  Links.splice(3,1); 
 }
 if(isLoggedIn === true && (role === "user" )){
  Links.splice(4,1); 
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
          {Links.map((item, index) => (
              <NavLink
                key={index}
                to={item.link}
                className={({ isActive }) =>
                  `transition-all duration-300 px-3 py-2 rounded ${
                    isActive ? "bg-zinc-700 text-zinc-900 font-semibold" : "hover:text-yellow-100"
                  }`
                }
              >
                {item.name}
              </NavLink>
            ))}

        </div>

        {isLoggedIn === false && (
          <div className="hidden md:flex gap-4">
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
          </div>
          )}
          {isLoggedIn === true && (
          <div className="hidden md:flex gap-4">
          <button 
            onClick={ logout }
            className="hover:text-white hover:bg-blue-500 transition-all duration-300 px-4 py-2 border rounded"
          >
            LogOut
          </button>
          </div>
          )}
        </div>

        <button
          className="text-white text-2xl md:hidden"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <IoClose /> : <FiMenu />}
        </button>
      </nav>

      {menuOpen && (
        <div className="bg-zinc-900 w-full absolute top-25 left-0 flex flex-col items-center px-6 py-6 space-y-8 md:hidden z-40">
          {Links.map((item, index) => (
              <NavLink
                key={index}
                to={item.link}
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  `text-white text-lg px-4 py-2 rounded transition-all duration-300 ${
                    isActive ? "bg-zinc-700 text-zinc-900 font-semibold" : "hover:text-yellow-100"
                  }`
                }
              >
                {item.name}
              </NavLink>
            ))}

          {!isLoggedIn && (
            <div>
            <NavLink
            to="/login"
            className="text-white border border-blue-400 px-4 py-2 rounded hover:bg-blue-500 transition-all duration-300"
          >
            Log In
          </NavLink>
          <NavLink
            to="/signup"
            className="text-white border border-blue-400 px-4 py-2 rounded hover:bg-blue-500 transition-all duration-300"
          >
            Sign Up
          </NavLink>
          </div>
          )}
          {isLoggedIn && (
            <div>
            <button
            onClick= {logout}
            className="text-white border border-blue-400 px-4 py-2 rounded hover:bg-blue-500 transition-all duration-300"
          >
            LogOut
          </button>
          </div>
          )}
        </div>
      )}
    </>
  );
};

export default Navbar;
