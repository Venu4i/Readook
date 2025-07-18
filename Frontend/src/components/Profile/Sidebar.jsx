import React from "react";
import { NavLink } from "react-router-dom";
import logout from "../Logout";
import { useSelector } from "react-redux";

const Sidebar = ({ data }) => {
    const role = useSelector((state) => state.auth.role);
    return (
        <div className="md:bg-zinc-800 text-white p-4 rounded-lg shadow-md flex flex-col h-full md:justify-between">
            <div className="flex flex-col items-center justify-center">
                <div className="flex flex-col items-center justify-center mt-4">
                    {/* <img src={data?.profilePicture || "./default-profile.png"} alt="Profile" className="w-16 h-16 rounded-full" /> */}
                    <h2 className="text-xl font-semibold">{data?.username}</h2>
                    <p className="text-sm mt-2 text-gray-400">{data?.email}</p>
                    <div className="w-full mt-2 mb-4 h-[1px] bg-zinc-500 hidden md:block"></div>
                </div>
            </div>
            {role === "user" && (
                <div>
                {/*user nav links */}
                <ul className="space-y-2 flex flex-row md:flex-col items-center justify-center w-full mt-4">
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

            {role === "admin" && (
                <>
                {/*user nav links */}
                <ul className="md:space-y-4 flex flex-row md:flex-col items-center  h-full w-full mt-4">
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
                </ul>
                </>
            )}

            <button
                onClick={logout}
                className="bg-zinc-900 hover:text-white w-full mt-6 transition-all duration-300 px-4 py-2 border rounded"
            >
                LogOut
            </button>
        </div>
    );
};

export default Sidebar;
