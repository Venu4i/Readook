import React, { useEffect, useState } from "react";
import axiosInstance from "../../store/axios";
import Loader from "../Loader/loader";
import { Link } from "react-router-dom";

const AllOrders = () => {
  const [orders, setOrders] = useState(null);
  const [role, setRole] = useState(null);
  const [userId, setUserId] = useState("");
  const [updating, setUpdating] = useState(false);

  const headers = {
    id: localStorage.getItem("id"),
    authorization: `Bearer ${localStorage.getItem("token")}`,
  };

  const fetchOrders = async () => {
    try {
      const res = await axiosInstance.get("/order/get-all-orders", { headers });
      const validOrders = res.data.data
        .filter((order) => order.user)
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setOrders(validOrders);
    } catch (error) {
      console.error("Error fetching orders:", error);
      setOrders([]);
    }
  };

  useEffect(() => {
    setRole(localStorage.getItem("role"));
    setUserId(localStorage.getItem("id"));
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      let verificationCode = "";
      if (newStatus === "delivered") {
        verificationCode = window.prompt("Enter the 6-digit Delivery Code provided by the customer:");
        if (!verificationCode) {
          alert("Action cancelled. Delivery code is required to mark as delivered.");
          return;
        }
      }
      setUpdating(true);
      await axiosInstance.patch(
        "/order/update-status",
        { orderId, status: newStatus, deliveryCode: verificationCode },
        { headers }
      );
      await fetchOrders();
    } catch (err) {
      console.error("Failed to update status", err);
      alert(err.response?.data?.message || "Error updating status");
    } finally {
      setUpdating(false);
    }
  };

  return (
    <>
      {!orders && <Loader />}

      {orders && orders.length === 0 && (
        <div className="min-h-screen p-4 text-zinc-100">
          <div className="h-full flex flex-col items-center justify-center">
            <h2 className="text-4xl font-semibold text-zinc-500 mb-6 text-center">No orders found!</h2>
            <img src="/no-orders.png" alt="No orders" className="w-32 h-32" />
          </div>
        </div>
      )}

      {orders && orders.length > 0 && (
        <div className="min-h-screen p-2 md:p-4 text-zinc-100">
          <h1 className="text-2xl md:text-3xl font-bold mb-6 text-yellow-300">All Orders</h1>

          {/* Desktop Header Row - Hidden on Mobile */}
          <div className="hidden md:flex bg-zinc-800 rounded py-2 px-4 font-semibold text-zinc-300 border-b border-zinc-700">
            <div className="w-[3%] text-center">#</div>
            <div className="w-[20%] text-center">Book</div>
            <div className="w-[20%] text-center">User</div>
            <div className="w-[10%] text-center">Price</div>
            <div className="w-[15%] text-center">Status</div>
            {role === "admin" && <div className="w-[20%] text-center">Seller</div>}
            <div className="w-[12%] text-center">Change</div>
          </div>

          {/* Orders List */}
          <div className="flex flex-col gap-3">
            {orders.map((order, i) => {
              const bookData = order.book || order.bookSnapshot || {};
              const isDeleted = !order.book;
              const sellerId = order.book?.seller?._id || order.seller;
              const canEditStatus = role === "admin" || (sellerId === userId);

              return (
                <div
                  key={order._id}
                  className="bg-zinc-800 rounded py-3 px-4 flex flex-col md:flex-row md:items-center gap-4 md:gap-2 hover:bg-zinc-850 transition-colors border border-zinc-700 md:border-none"
                >
                  {/* Index & Book Info */}
                  <div className="flex items-center justify-between md:w-[23%]">
                    <div className="md:w-[15%] text-zinc-500 font-mono">#{i + 1}</div>
                    <div className="flex-1 text-right md:text-center overflow-hidden text-ellipsis whitespace-nowrap px-2">
                      {!isDeleted ? (
                        <Link to={`/get-book-details/${order.book._id}`} className="text-blue-400 hover:underline">
                          {bookData.title}
                        </Link>
                      ) : (
                        <span className="text-zinc-500 italic text-sm">{bookData.title} (Deleted)</span>
                      )}
                    </div>
                  </div>

                  {/* User Info */}
                  <div className="flex justify-between md:justify-center md:w-[20%] border-t border-zinc-700 pt-3 md:border-none md:pt-0">
                    <span className="md:hidden text-zinc-500 text-sm">Customer:</span>
                    <div className="text-right md:text-center text-sm">
                      {order.user.name} <br />
                      <span className="text-xs text-zinc-500">{order.user.email}</span>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="flex justify-between md:justify-center md:w-[10%]">
                    <span className="md:hidden text-zinc-500 text-sm">Price:</span>
                    <span className="font-mono text-yellow-100">₹ {bookData.price}</span>
                  </div>

                  {/* Status */}
                  <div className="flex justify-between md:justify-center md:w-[15%]">
                    <span className="md:hidden text-zinc-500 text-sm">Status:</span>
                    <span className={`px-2 py-1 rounded text-[10px] uppercase font-bold ${
                      order.status === "Cancelled" ? "text-red-400 bg-red-400/10" :
                      order.status === "Order Placed" ? "text-yellow-400 bg-yellow-400/10" :
                      order.status === "delivered" ? "text-green-400 bg-green-400/10" :
                      "text-blue-400 bg-blue-400/10"
                    }`}>
                      {order.status}
                    </span>
                  </div>

                  {/* Seller Info for Admin */}
                  {role === "admin" && (
                    <div className="flex justify-between md:justify-center md:w-[20%] border-t border-zinc-700 md:border-none pt-2 md:pt-0">
                      <span className="md:hidden text-zinc-500 text-sm">Seller:</span>
                      <div className="text-right md:text-center text-[10px]">
                        {order.book?.seller ? (
                          <span className="text-zinc-400 italic">ID: {String(order.book.seller).slice(-6)}</span>
                        ) : (
                          <span className="text-zinc-500">N/A</span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Change Status */}
                  <div className="flex justify-between md:justify-center md:w-[12%] border-t border-zinc-700 md:border-none pt-3 md:pt-0">
                    <span className="md:hidden text-zinc-500 text-sm">Update:</span>
                    {canEditStatus ? (
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusChange(order._id, e.target.value)}
                        disabled={updating || order.status === "delivered" || order.status === "Cancelled"}
                        className="bg-zinc-900 md:bg-zinc-700 text-white text-xs rounded px-2 py-1 outline-none border border-zinc-600 focus:border-yellow-500 cursor-pointer disabled:opacity-50"
                      >
                        <option value="Order Placed">Placed</option>
                        <option value="out for delivery">out for delivery</option>
                        <option value="delivered">Delivered</option>
                        <option value="Cancelled">Cancel</option>
                      </select>
                    ) : (
                      <span className="text-zinc-600">—</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
};

export default AllOrders;