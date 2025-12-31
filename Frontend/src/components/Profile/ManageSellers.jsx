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
      fetchSellers(); // Refresh list
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
        <div className="min-h-screen p-0 md:p-4 text-zinc-100">
          <h1 className="text-3xl md:text-5xl font-semibold text-zinc-500 mb-8">Manage Sellers</h1>

          {/* Table Header */}
          <div className="mt-4 bg-zinc-800 w-full rounded-t py-2 px-4 flex gap-2 border-b border-zinc-700">
            <div className="w-[5%] text-center font-semibold text-zinc-400">#</div>
            <div className="w-[25%] font-semibold">Seller Name</div>
            <div className="w-[35%] font-semibold">Email</div>
            <div className="w-[35%] text-center font-semibold">Actions</div>
          </div>

          {/* Sellers List */}
          {sellers.map((seller, i) => (
            <div key={seller._id} className="bg-zinc-800 w-full py-4 px-4 flex gap-2 mt-1 hover:bg-zinc-850 transition-colors items-center">
              <div className="w-[5%] text-center text-zinc-500">{i + 1}</div>
              <div className="w-[25%] font-medium">{seller.username}</div>
              <div className="w-[35%] text-zinc-400">{seller.email}</div>
              
              <div className="w-[35%] flex gap-2 justify-center">
                {/* Blacklist Toggle Button */}
                <button
                  onClick={() => toggleBlacklist(seller._id)}
                  className={`px-3 py-1 rounded text-xs font-bold transition-all ${
                    seller.isBlacklisted 
                    ? "bg-green-600 hover:bg-green-500 text-white" 
                    : "bg-yellow-600 hover:bg-yellow-500 text-white"
                  }`}
                >
                  {seller.isBlacklisted ? "Un-Blacklist" : "Blacklist"}
                </button>

                {/* Delete Inventory Button */}
                <button
                  onClick={() => deleteBooks(seller._id, seller.username)}
                  className="bg-red-600 hover:bg-red-500 text-white px-3 py-1 rounded text-xs font-bold transition-all"
                >
                  Wipe Books
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default ManageSellers;