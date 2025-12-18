import React, { useEffect, useState } from "react";
import axiosInstance from "../../store/axios.js";
import Loader from "../Loader/loader.jsx";
import { Link } from "react-router-dom";

const Orders = () => {
  const [orders, setOrders] = useState(null);
  const [rating, setRating] = useState({}); // Current star selection
  const [hover, setHover] = useState({});   // Hover state for stars

  const headers = {
    id: localStorage.getItem("id"),
    authorization: `Bearer ${localStorage.getItem("token")}`,
  };

  const fetchOrders = async () => {
    try {
      const res = await axiosInstance.get("/order/get-orders", { headers });
      setOrders(res.data.data);
    } catch (error) {
      console.error("Error fetching orders:", error);
      setOrders([]);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleRateBook = async (bookId, orderId) => {
    const stars = rating[orderId];
    if (!stars) {
      return;
    }

    const confirmRate = window.confirm(`Confirm ${stars} star rating for this book?`);

    if (confirmRate) {
      try {
        await axiosInstance.post(
          "/book/rate", // Ensure this matches your route
          { bookId, orderId, stars },
          { headers }
        );
        fetchOrders(); 
      } catch (error) {
        console.error("Error rating book:", error);
      }
    }
  };

  return (
    <>
      {!orders && <Loader />}

      {orders && orders.length === 0 && (
        <div className="min-h-screen p-4 text-zinc-100 flex flex-col items-center justify-center">
          <h2 className="text-5xl font-semibold text-zinc-500 mb-8">No orders placed!</h2>
          <img src="/no-orders.png" alt="No orders" className="w-40 h-40 opacity-50" />
        </div>
      )}

      {orders && orders.length > 0 && (
        <div className="min-h-screen p-0 md:p-4 text-zinc-100">
          <h1 className="text-3xl md:text-5xl font-semibold text-zinc-500 mb-8">Purchase History</h1>

          {/* Table Header */}
          <div className="mt-4 bg-zinc-800 w-full rounded-t py-2 px-4 flex gap-2 border-b border-zinc-700">
            <div className="w-[3%] text-center font-semibold text-zinc-400">#</div>
            <div className="w-[22%] text-center font-semibold">Book Title</div>
            <div className="w-[45%] text-center font-semibold">Description</div>
            <div className="w-[9%] text-center font-semibold">Price</div>
            <div className="w-[16%] text-center font-semibold">Status / Security</div>
            <div className="w-[5%] text-center font-semibold hidden md:block">Mode</div>
          </div>

          {/* Orders List */}
          {orders.map((items, i) => {
            if (!items.book) return null;

            return (
              <div
                key={items._id}
                className="bg-zinc-800 w-full py-4 px-4 flex gap-4 mt-1 hover:bg-zinc-850 transition-colors items-start"
              >
                <div className="w-[3%] text-center pt-1 text-zinc-500">{i + 1}</div>

                <div className="w-[22%] flex flex-col items-center text-center">
                  <Link
                    to={`/get-book-details/${items.book._id}`}
                    className="text-blue-400 hover:text-blue-200 font-medium"
                  >
                    {items.book.title}
                  </Link>
                  
                  {/* Rating Section */}
                  {items.status === "delivered" && !items.isRated && (
                    <div className="mt-3 bg-zinc-900/50 p-2 rounded-lg border border-zinc-700 w-full max-w-[140px]">
                      <div className="flex gap-1 mb-2 justify-center">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            className={`text-xl transition-all ${
                              (hover[items._id] || rating[items._id]) >= star 
                                ? "text-yellow-400" 
                                : "text-zinc-600"
                            }`}
                            onMouseEnter={() => setHover({ ...hover, [items._id]: star })}
                            onMouseLeave={() => setHover({ ...hover, [items._id]: 0 })}
                            onClick={() => setRating({ ...rating, [items._id]: star })}
                          >
                            ★
                          </button>
                        ))}
                      </div>
                      <button
                        onClick={() => handleRateBook(items.book._id, items._id)}
                        className="w-full bg-indigo-600 hover:bg-indigo-500 text-white text-[11px] font-bold py-1 rounded"
                      >
                        Rate Now
                      </button>
                    </div>
                  )}

                  {items.isRated && (
                    <div className="flex items-center gap-1 mt-2 text-yellow-500 bg-yellow-500/10 px-2 py-1 rounded-full text-[12px]">
                      <span>{items.ratingGiven}</span>
                      <span className="text-[10px]">★ Rated</span>
                    </div>
                  )}
                </div>

                <div className="w-[45%] text-zinc-400 text-sm pt-1">
                  {items.book.description?.slice(0, 100)}...
                </div>

                <div className="w-[9%] text-center pt-1 font-mono">₹{items.book.price}</div>

                {/* Status and Verification Code Column */}
                <div className="w-[16%] text-center flex flex-col items-center pt-1">
                  <span className={`px-2 py-1 rounded text-xs uppercase tracking-wider font-bold ${
                    items.status === "Order Placed" ? "text-yellow-500 bg-yellow-500/10" :
                    items.status === "Cancelled" ? "text-red-500 bg-red-500/10" :
                    items.status === "delivered" ? "text-green-400 bg-green-400/10" :
                    "text-blue-400 bg-blue-400/10"
                  }`}>
                    {items.status}
                  </span>

                  {/* SHOW CODE ONLY IF NOT DELIVERED OR CANCELLED */}
                  {items.status !== "delivered" && items.status !== "Cancelled" && items.deliveryCode && (
                    <div className="mt-3 p-2 bg-zinc-900 border border-zinc-700 rounded w-full">
                      <p className="text-[10px] text-zinc-500 uppercase font-bold">Delivery Code</p>
                      <p className="text-lg font-mono text-indigo-400 tracking-widest">
                        {items.deliveryCode}
                      </p>
                    </div>
                  )}
                </div>

                <div className="w-[5%] text-center hidden md:block text-[10px] text-zinc-500 pt-2">
                  CASH
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
};

export default Orders;