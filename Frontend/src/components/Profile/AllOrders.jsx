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

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axiosInstance.get("/order/get-all-orders", { headers });

        const validOrders = res.data.data
          .filter((order) => order.book && order.user)
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        setOrders(validOrders);
      } catch (error) {
        console.error("Error fetching orders:", error);
        setOrders([]);
      }
    };

    setRole(localStorage.getItem("role"));
    setUserId(localStorage.getItem("id"));
    console.log("role", role);
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      setUpdating(true);
      await axiosInstance.patch(
        "/order/update-status",
        { orderId, status: newStatus },
        { headers }
      );

      // Refresh the orders
      const res = await axiosInstance.get("/order/get-all-orders", { headers });
      const validOrders = res.data.data
        .filter((order) => order.book && order.user)
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      setOrders(validOrders);
    } catch (err) {
      console.error("Failed to update status", err);
      alert("Error updating status");
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
            <h2 className="text-4xl font-semibold text-zinc-500 mb-6">
              No orders found!
            </h2>
            <img src="/no-orders.png" alt="No orders" className="w-32 h-32" />
          </div>
        </div>
      )}

      {orders && orders.length > 0 && (
        <div className="min-h-screen p-4 text-zinc-100">
          <h1 className="text-3xl font-bold mb-8 text-yellow-300">
            All Orders
          </h1>

          {/* Header Row */}
          <div className="bg-zinc-800 rounded py-2 px-4 flex font-semibold">
            <div className="w-[3%] text-center">#</div>
            <div className="w-[20%] text-center">Book</div>
            <div className="w-[20%] text-center">User</div>
            <div className="w-[10%] text-center">Price</div>
            <div className="w-[15%] text-center">Status</div>
            {role === "admin" && (
              <div className="w-[20%] text-center">Seller</div>
            )}
            <div className="w-[12%] text-center">Change</div>
          </div>

          {/* Orders List */}
          {orders.map((order, i) => {
            const seller = order.book?.seller;
            const canEditStatus =
              role === "admin" || (seller && seller._id === userId);

            return (
              <div
                key={order._id}
                className="bg-zinc-800 rounded py-2 px-4 flex items-center gap-2 hover:bg-zinc-900"
              >
                <div className="w-[3%] text-center">{i + 1}</div>

                <div className="w-[20%] text-center">
                  <Link
                    to={`/get-book-details/${order.book._id}`}
                    className="hover:text-blue-400"
                  >
                    {order.book.title}
                  </Link>
                </div>

                <div className="w-[20%] text-center">
                  {order.user.name} ({order.user.email})
                </div>

                <div className="w-[10%] text-center">₹ {order.book.price}</div>

                <div className="w-[15%] text-center font-semibold">
                  {order.status === "Cancelled" ? (
                    <span className="text-red-400">{order.status}</span>
                  ) : order.status === "Order Placed" ? (
                    <span className="text-yellow-400">{order.status}</span>
                  ) : order.status === "delivered" ? (
                    <span className="text-green-400">{order.status}</span>
                  ) : (
                    <span>{order.status}</span>
                  )}
                </div>

                {/* Seller Info for Admin */}
                {role === "admin" && (
                        <div className="w-[20%] text-center">
                            {order.book?.seller ? (
                            <>
                                {order.book.seller.name} ({order.book.seller.email})
                            </>
                            ) : (
                            "Unknown Seller"
                            )}
                        </div>
                        )}

                {/* Status Dropdown */}
                <div className="w-[12%] text-center">
                  {canEditStatus ? (
                    <select
                      value={order.status}
                      onChange={(e) =>
                        handleStatusChange(order._id, e.target.value)
                      }
                      disabled={updating}
                      className="bg-zinc-700 text-white rounded px-2 py-1"
                    >
                      <option value="Order Placed">Order Placed</option>
                      <option value="out for delivery">Out for Delivery</option>
                      <option value="delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  ) : (
                    <span className="text-zinc-400">-</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
};

export default AllOrders;
