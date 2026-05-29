import React from "react";
import { NavLink } from "react-router-dom";
import useLogout from "../Logout.jsx";
import { useSelector } from "react-redux";

const Sidebar = ({ data }) => {
    const logout = useLogout();
    const role = useSelector((state) => state.auth.role);

    return (
        <div className="md:bg-zinc-800 text-white p-4 rounded-lg shadow-md flex flex-col h-full md:justify-between">
            <div className="flex flex-col items-center justify-center">
                <div className="flex flex-col items-center justify-center mt-4 text-center">
                    <h2 className="text-xl font-semibold">{data?.username}</h2>
                    <p className="text-sm mt-2 text-gray-400">{data?.email}</p>
                    <div className="w-full mt-2 mb-4 h-[1px] bg-zinc-500 hidden md:block"></div>
                </div>
            </div>

            {/* User Links */}
            {role === "user" && (
                <div className="w-full">
                    <ul className="space-y-2 flex flex-row md:flex-col items-center justify-center w-full mt-4 gap-2 md:gap-0">
                        <NavLink
                            to="/profile"
                            end
                            className={({ isActive }) =>
                                `text-zinc-100 font-semibold w-full py-2 px-4 text-center rounded transition-all duration-300 ${
                                    isActive ? "bg-white text-zinc-900" : "hover:bg-zinc-900"
                                }`
                            }
                        >
                            Favourites
                        </NavLink>
                        <NavLink
                            to="/profile/orders"
                            className={({ isActive }) =>
                                `text-zinc-100 font-semibold w-full py-2 px-4 text-center rounded transition-all duration-300 ${
                                    isActive ? "bg-white text-zinc-900" : "hover:bg-zinc-900"
                                }`
                            }
                        >
                            Orders
                        </NavLink>
                        <NavLink
                            to="/profile/settings"
                            className={({ isActive }) =>
                                `text-zinc-100 font-semibold w-full py-2 px-4 text-center rounded transition-all duration-300 ${
                                    isActive ? "bg-white text-zinc-900" : "hover:bg-zinc-900"
                                }`
                            }
                        >
                            Settings
                        </NavLink>
                    </ul>
                </div>
            )}

            {/* Admin / Seller Links */}
            {(role === "admin" || role === "seller") && (
                <div className="w-full">
                    <ul className="md:space-y-4 flex flex-row md:flex-col items-center justify-center w-full mt-4 gap-2 md:gap-0">
                        <NavLink
                            to="/profile"
                            end
                            className={({ isActive }) =>
                                `text-zinc-100 font-semibold w-full py-2 px-4 text-center rounded transition-all duration-300 ${
                                    isActive ? "bg-white text-zinc-900" : "hover:bg-zinc-900"
                                }`
                            }
                        >
                            All orders
                        </NavLink>
                        <NavLink
                            to="/profile/addBooks"
                            className={({ isActive }) =>
                                `text-zinc-100 font-semibold w-full py-2 px-4 text-center rounded transition-all duration-300 ${
                                    isActive ? "bg-white text-zinc-900" : "hover:bg-zinc-900"
                                }`
                            }
                        >
                            Add Book
                        </NavLink>
                        <NavLink
                            to="/profile/addedBooks"
                            className={({ isActive }) =>
                                `text-zinc-100 font-semibold w-full py-2 px-4 text-center rounded transition-all duration-300 ${
                                    isActive ? "bg-white text-zinc-900" : "hover:bg-zinc-900"
                                }`
                            }
                        >
                            Added Books
                        </NavLink>

                        {/* Integrated Manage Sellers for Admin */}
                        {role === "admin" && (
                            <>
                                <NavLink
                                    to="/profile/manage-sellers"
                                    className={({ isActive }) =>
                                        `text-zinc-100 font-semibold w-full py-2 px-4 text-center rounded transition-all duration-300 ${
                                            isActive ? "bg-white text-zinc-900" : "hover:bg-zinc-900"
                                        }`
                                    }
                                >
                                    Manage Sellers
                                </NavLink>

                                <NavLink
                                    to="/profile/complaints"
                                    className={({ isActive }) =>
                                        `text-zinc-100 font-semibold w-full py-2 px-4 text-center rounded transition-all duration-300 ${
                                            isActive ? "bg-white text-zinc-900" : "hover:bg-zinc-900"
                                        }`
                                    }
                                >
                                    Complaints
                                </NavLink>
                            </>
                        )}
                    </ul>
                </div>
            )}

            <button
                onClick={logout}
                className="bg-zinc-900 hover:text-white w-full mt-6 transition-all duration-300 px-4 py-2 border rounded font-semibold"
            >
                LogOut
            </button>
        </div>
    );
};

export default Sidebar;