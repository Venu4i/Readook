import React, { useEffect, useState } from "react";
import axiosInstance from "../../store/axios.js";
import Loader from "../Loader/loader.jsx";

const ManageSellers = () => {
  const [sellers, setSellers] = useState(null);

  const headers = {
    authorization: `Bearer ${localStorage.getItem("token")}`,
  };

  const fetchSellers = async () => {
    try {
      const res = await axiosInstance.get("/admin/get-sellers", { headers });
      setSellers(res.data.data);
    } catch (error) {
      console.error("Error fetching sellers:", error);
      setSellers([]);
    }
  };

  useEffect(() => {
    fetchSellers();
  }, []);

  const toggleBlacklist = async (userId) => {
    try {
      const res = await axiosInstance.patch(`/admin/toggle-blacklist/${userId}`, {}, { headers });
      alert(res.data.message);
      fetchSellers(); 
    } catch (error) {
      alert("Failed to update status");
    }
  };

  const deleteBooks = async (sellerId, username) => {
    if (window.confirm(`Are you sure you want to delete ALL books by ${username}? This cannot be undone.`)) {
      try {
        const res = await axiosInstance.delete(`/admin/delete-sellerbooks/${sellerId}`, { headers });
        alert(res.data.message);
      } catch (error) {
        alert("Failed to delete books");
      }
    }
  };

  return (
    <>
      {!sellers && <Loader />}
      {sellers && (
        <div className="min-h-screen p-2 md:p-4 text-zinc-100">
          <h1 className="text-3xl md:text-5xl font-semibold text-zinc-500 mb-8">Manage Sellers</h1>

          {/* Table Header - Hidden on Mobile */}
          <div className="hidden md:flex mt-4 bg-zinc-800 w-full rounded-t py-2 px-4 gap-2 border-b border-zinc-700">
            <div className="w-[5%] text-center font-semibold text-zinc-400">#</div>
            <div className="w-[25%] font-semibold">Seller Name</div>
            <div className="w-[35%] font-semibold">Email</div>
            <div className="w-[35%] text-center font-semibold">Actions</div>
          </div>

          {/* Sellers List */}
          <div className="flex flex-col gap-1">
            {sellers.map((seller, i) => (
              <div 
                key={seller._id} 
                className="bg-zinc-800 w-full py-4 px-4 flex flex-col md:flex-row gap-3 md:gap-2 hover:bg-zinc-850 transition-colors items-start md:items-center rounded md:rounded-none border border-zinc-700 md:border-none"
              >
                {/* Index & Name */}
                <div className="flex items-center w-full md:w-[30%] gap-4">
                  <div className="text-zinc-500 font-mono text-sm md:w-[15%] md:text-center">
                    #{i + 1}
                  </div>

                  <div>
                    <div className="font-medium text-lg md:text-base">
                      {seller.username}
                    </div>

                    <div className="text-xs text-zinc-500 font-mono break-all">
                      {seller._id}
                    </div>
                  </div>
                </div>

                {/* Email */}
                <div className="w-full md:w-[35%] text-zinc-400 text-sm md:text-base break-all">
                  <span className="md:hidden text-zinc-500 mr-2">Email:</span>
                  {seller.email}
                </div>
                
                {/* Actions */}
                <div className="w-full md:w-[35%] flex gap-2 justify-start md:justify-center border-t border-zinc-700 pt-3 md:pt-0 md:border-none">
                  <button
                    onClick={() => toggleBlacklist(seller._id)}
                    className={`flex-1 md:flex-none px-3 py-2 md:py-1 rounded text-xs font-bold transition-all ${
                      seller.isBlacklisted 
                      ? "bg-green-600 hover:bg-green-500 text-white" 
                      : "bg-yellow-600 hover:bg-yellow-500 text-white"
                    }`}
                  >
                    {seller.isBlacklisted ? "Un-Blacklist" : "Blacklist"}
                  </button>

                  <button
                    onClick={() => deleteBooks(seller._id, seller.username)}
                    className="flex-1 md:flex-none bg-red-600 hover:bg-red-500 text-white px-3 py-2 md:py-1 rounded text-xs font-bold transition-all"
                  >
                    Wipe Books
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default ManageSellers;