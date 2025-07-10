import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

import logout from "../Logout.jsx";

const Sidebar = ({data}) => {
    return(
        <div className="bg-zinc-800 text-white p-4 rounded-lg shadow-md flex flex-col h-[100%] items-between justify-between">
            <div className="flex flex-col items-center justify-center">
                <div className="flex flex-col items-center justify-center mt-4">
                    {/* <img src={data?.profilePicture || "./default-profile.png"} alt="Profile" className="w-16 h-16 rounded-full" /> */}
                    <h2 className="text-xl font-semibold">{data?.username}</h2>
                    <p className="text-sm mt-2 text-gray-400">{data?.email}</p>
                    <div className="w-full mt-2 mb-4 h-[1px] bg-zinc-500 hidden lg:block"></div>
                </div>

            <ul className="space-y-4 hidden lg:flex  flex-row md:flex-col items-center justify-center w-full">
                <Link to ="/profile" className=" text-zinc-100 font-semibold w-full py-3 text-center hover:bg-zinc-900 rounded transition-all duration-300"> Favourites</Link>
                <Link to ="/profile/orders" className=" text-zinc-100 font-semibold w-full py-2 px-5 text-center hover:bg-zinc-900 rounded transition-all duration-300">Orders</Link>
                <Link to ="/profile/settings" className="text-zinc-100 font-semibold w-full py-2 px-5 text-center hover:bg-zinc-900 rounded transition-all duration-300">Settings</Link>
            </ul>
            </div>
            <button 
                onClick={ logout }
                className="bg-zinc-900 hover:text-white w-full hover: mt-4 lg:mt-0 transition-all duration-300 px-4 py-2 border rounded" >
                LogOut
            </button>
        </div>
    )
}

export default Sidebar