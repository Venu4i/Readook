import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FiMenu } from "react-icons/fi";
import { IoClose } from "react-icons/io5";

import {useSelector} from "react-redux";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const Links = [
    { name: "Home", link: "/" },
    { name: "Books", link: "/books" },
    { name: "Cart", link: "/cart" },
    { name: "Profile", link: "/profile" },
  ];

  const isLoggedIn =useSelector ( (state) => state.auth.isLoggedIn );
  // console.log(isLoggedIn);
 if(isLoggedIn === false){
  Links.splice(2,2); //from 2nd indx and quantity = 2 links 
 }

  return (
    <>
      <nav className="w-full relative flex bg-zinc-900 px-6 py-4 text-white items-center justify-between z-50">
        <Link 
        to="/"
        className="flex gap-4 items-center border-none">
          <img className="h-10 mx-4" src="./logo.png" alt="logo" />
          <h1 className="text-xl font-semibold">Readook</h1>
        </Link>

       <div className="flex gap-4">
        <div className="hidden md:flex items-center gap-6">
          {Links.map((item, index) => (
            <Link
              key={index}
              to={item.link}
              className="hover:text-blue-400 transition-all duration-300"
            >
              {item.name}
            </Link>
          ))}
        </div>

        <div className="hidden md:flex gap-4">
          <Link
            to="/login"
            className="hover:text-white hover:bg-blue-500 transition-all duration-300 px-4 py-2 border rounded"
          >
            Log In
          </Link>
          <Link
            to="/signup"
            className="hover:text-white hover:bg-blue-500 transition-all duration-300 px-4 py-2 border rounded border-blue-400"
          >
            Sign Up
          </Link>
          </div>
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
            <Link
              key={index}
              to={item.link}
              onClick={() => setMenuOpen(false)}
              className="text-white text-lg hover:text-blue-400 transition-all duration-300"
            >
              {item.name}
            </Link>
          ))}
          <Link
            to="/login"
            className="text-white border border-blue-400 px-4 py-2 rounded hover:bg-blue-500 transition-all duration-300"
          >
            Log In
          </Link>
          <Link
            to="/signup"
            className="text-white border border-blue-400 px-4 py-2 rounded hover:bg-blue-500 transition-all duration-300"
          >
            Sign Up
          </Link>
        </div>
      )}
    </>
  );
};

export default Navbar;
