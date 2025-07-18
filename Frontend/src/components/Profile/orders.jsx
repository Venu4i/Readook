import React, { useEffect, useState } from "react";
import axiosInstance from "../../store/axios.js";
import Loader from "../Loader/loader.jsx";
import { Link } from "react-router-dom";

const Orders = () => {
  const [orders, setOrders] = useState(null);

  const headers = {
    id: localStorage.getItem("id"),
    authorization: `Bearer ${localStorage.getItem("token")}`,
  };

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axiosInstance.get("/order/get-orders", { headers });
        setOrders(res.data.data);
      } catch (error) {
        console.error("Error fetching orders:", error);
        setOrders([]);
      }
    };

    fetchOrders();
  }, []);

  return (
    <>
      {!orders && <Loader />}

      {orders && orders.length === 0 && (
        <div className="min-h-screen p-4 text-zinc-100">
          <div className="h-full flex flex-col items-center justify-center">
            <h2 className="text-5xl font-semibold text-zinc-500 mb-8">
              No orders placed!
            </h2>
            <img src="/no-orders.png" alt="No orders" className="w-40 h-40" />
          </div>
        </div>
      )}

      {orders && orders.length > 0 && (
        <div className="min-h-screen p-0 md:p-4 text-zinc-100">
          <h1 className="text-3xl md:text-5xl font-semibold text-zinc-500 mb-8">
            Your Orders
          </h1>

          <div className="mt-4 bg-zinc-800 w-full rounded py-2 px-4 flex gap-2">
            <div className="w-[3%] text-center font-semibold">Sr.</div>
            <div className="w-[22%] text-center font-semibold">Book</div>
            <div className="w-[45%] text-center font-semibold">Description</div>
            <div className="w-[9%] text-center font-semibold">Price</div>
            <div className="w-[16%] text-center font-semibold">Status</div>
            <div className="w-[5%] text-center font-semibold hidden md:block">Mode</div>
          </div>

          {orders.map((items, i) => (
            <div
              key={items._id}
              className="bg-zinc-800 w-full rounded py-2 px-4 flex gap-4 hover:bg-zinc-900 cursor-pointer"
            >
              <div className="w-[3%] text-center">{i + 1}</div>

              <div className="w-[22%] text-center">
                <Link
                  to={`/get-book-details/${items.book._id}`}
                  className="hover:text-blue-300"
                >
                  {items.book.title}
                </Link>
              </div>

              <div className="w-[45%] text-center">
                {items.book.description.slice(0, 50)}...
              </div>

              <div className="w-[9%] text-center">
                ₹ {items.book.price}
              </div>

              <div className="w-[16%] text-center font-semibold">
                {items.status === "Order Placed" ? (
                  <span className="text-yellow-500">{items.status}</span>
                ) : items.status === "Cancelled" ? (
                  <span className="text-red-500">{items.status}</span>
                ) : (
                  <span>{items.status}</span>
                )}
              </div>

              <div className="w-[5%] text-center hidden md:block text-sm text-zinc-400">
                COD
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default Orders;
