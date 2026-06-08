import React, {useEffect, useState} from "react";
import axios from "axios";
import { Outlet } from "react-router-dom";


import Sidebar from "../components/Profile/Sidebar.jsx";
import Loader from "../components/Loader/loader.jsx"
import axiosInstance from "../store/axios.js";

const Profile = () => {
  
    const [Profile, setProfile] =  useState();
    const headers ={
        id: localStorage.getItem('id'),
        Authorization: `Bearer ${localStorage.getItem('token')}`
    }
   useEffect(() => {
  const fetchUser = async () => {
    try {
      const response = await axiosInstance.get("/user/getuser", {
        headers,
        withCredentials: true, // as backend uses cookies
      });

      const userData = response.data?.data || {};
      console.log("User data:", userData);
      setProfile(userData)

    } catch (error) {
      console.error("Error fetching user data:", error.message);

      if (error.response?.status === 401 || error.response?.status === 403) {
        console.warn("Token might be expired or invalid");
      }
    }
  };

  fetchUser();
}, []);

    return (
        <div className="bg-zinc-900 text-white flex flex-col min-h-screen md:flex-row w-full px-2 md: px-12 py-8 gap-4">
            { !Profile && (
               <div className="w-full h-[100%] flex items-center justify-center">
                  <Loader /> {" "}
                </div>
           )}
            {Profile && (
                <>
                <div className="w-full md:w-1/6 md:h-screen">
                < Sidebar data= {Profile} />
            </div>
            <div className="w-full md:w-5/6">
                < Outlet />
            </div>
            </>
            )}
        </div>
    )
}

export default Profile