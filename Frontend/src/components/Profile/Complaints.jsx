import React, { useEffect, useState } from "react";
import axiosInstance from "../../store/axios.js";
import Loader from "../Loader/loader.jsx";

const Complaints = () => {

  const [complaints, setComplaints] = useState(null);

  const headers = {
    authorization: `Bearer ${localStorage.getItem("token")}`,
  };

  const fetchComplaints = async () => {
    try {

      const res = await axiosInstance.get(
        "/complaint/getAllComplaints",
        { headers }
      );

      setComplaints(res.data.data);

    } catch (error) {

      console.error("Error fetching complaints:", error);

      setComplaints([]);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  const blacklistSeller = async (sellerId) => {
    try {

      const res = await axiosInstance.patch(
        `/admin/toggle-blacklist/${sellerId}`,
        {},
        { headers }
      );

      alert(res.data.message);

      fetchComplaints();

    } catch (error) {

      console.error(error);

      alert("Failed to blacklist seller");
    }
  };

  const toggleComplaintStatus = async (complaintId) => {

    try {

        const res = await axiosInstance.patch(
        `/complaint/updateComplaintStatus/${complaintId}`,
        {},
        { headers }
        );

        alert(res.data.message);

        fetchComplaints();

    } catch (error) {

        console.error(error);

        alert("Failed to update complaint status");
    }
    };

  return (
    <>
      {!complaints && <Loader />}

      {complaints && (
        <div className="min-h-screen p-2 md:p-4 text-zinc-100">

          <h1 className="text-3xl md:text-5xl font-semibold text-zinc-500 mb-8">
            Seller Complaints
          </h1>

          {/* Desktop Header */}
          <div className="hidden md:flex mt-4 bg-zinc-800 w-full rounded-t py-2 px-4 gap-2 border-b border-zinc-700">

            <div className="w-[5%] text-center font-semibold text-zinc-400">
              #
            </div>

            <div className="w-[18%] font-semibold">
              Seller
            </div>

            <div className="w-[15%] font-semibold">
              Seller ID
            </div>

            <div className="w-[15%] font-semibold">
              Reported By
            </div>

            <div className="w-[27%] font-semibold">
              Complaint
            </div>

            <div className="w-[10%] text-center font-semibold">
              Status
            </div>

            <div className="w-[10%] text-center font-semibold">
              Actions
            </div>
          </div>

          {/* Complaint List */}
          <div className="flex flex-col gap-1">

            {complaints.length === 0 && (
              <div className="text-zinc-500 text-center py-10">
                No complaints found
              </div>
            )}

            {complaints.map((item, i) => (

              <div
                key={item._id}
                className="bg-zinc-800 w-full py-4 px-4 flex flex-col md:flex-row gap-3 md:gap-2 hover:bg-zinc-850 transition-colors items-start md:items-center rounded md:rounded-none border border-zinc-700 md:border-none"
              >

                {/* Index */}
                <div className="md:w-[5%] text-zinc-500 font-mono text-sm">
                  #{i + 1}
                </div>

                {/* Seller */}
                <div className="w-full md:w-[18%]">

                  <p className="font-semibold">
                    {item.reportedSeller?.username || "Unknown"}
                  </p>

                  <p className="text-[11px] text-zinc-500 break-all">
                    {item.reportedSeller?.email}
                  </p>

                </div>

                
                <div className="w-full md:w-[15%] break-all text-[11px] text-indigo-400 font-mono">
                  {item.reportedSeller?._id}
                </div>

                
                <div className="w-full md:w-[15%]">

                  <p className="text-sm">
                    {item.reportedBy?.username}
                  </p>

                  <p className="text-[11px] text-zinc-500 break-all">
                    {item.reportedBy?.email}
                  </p>

                </div>

                
                <div className="w-full md:w-[27%] text-zinc-300 text-sm">
                  {item.reason}
                </div>

                
                <div className="w-full md:w-[10%] flex justify-start md:justify-center">

                  <span
                    className={`px-2 py-1 rounded text-xs font-bold ${
                      item.status === "resolved"
                        ? "bg-green-500/10 text-green-400"
                        : item.status === "reviewed"
                        ? "bg-yellow-500/10 text-yellow-400"
                        : "bg-red-500/10 text-red-400"
                    }`}
                  >
                    {item.status}
                  </span>

                </div>

               
                <div className="w-full md:w-[10%] flex flex-col gap-2 justify-start md:justify-center">

                    <button
                    onClick={() => toggleComplaintStatus(item._id)}
                    className="bg-blue-600 hover:bg-blue-500 text-white px-3 py-2 md:py-1 rounded text-xs font-bold transition-all"
                    >
                    Update Status
                    </button>
                  <button
                    onClick={() =>
                      blacklistSeller(item.reportedSeller?._id)
                    }
                    className="bg-red-600 hover:bg-red-500 text-white px-3 py-2 md:py-1 rounded text-xs font-bold transition-all"
                  >
                    Blacklist
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

export default Complaints;