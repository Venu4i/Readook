import React, { useEffect, useState } from "react";
import axiosInstance from "../store/axios.js";
import BookCard from "../components/BookCard/BookCard.jsx";
import Loader from "../components/Loader/loader.jsx";
import { PiShoppingCartSimpleDuotone } from "react-icons/pi";
import { NavLink } from "react-router-dom";
import { useNavigate } from 'react-router-dom';

const Cart = () => {
  const [cart, setCart] = useState(null);
  const [total, setTotal] = useState(0);
  const navigate = useNavigate();


  const headers = {
    id: localStorage.getItem("id"),
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  };

  const fetchCart = async () => {
    try {
      const response = await axiosInstance.get("/cart/get-cart", {
        headers,
      });
      console.log(response.data.data);

      // Get the book data from each favourite
      const books = response.data.data;
      setCart(books);
    } catch (error) {
      console.error("Error fetching cart:", error);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  useEffect(() => {
    if(cart && cart.length > 0) {
     let total= 0;
        cart.forEach((item) => {
            total += item.book.price * (item.quantity || 1); // Assuming quantity is available
        });
        console.log("Total Cart Value: ", total);
        setTotal(total);
        total=0;
    }
  },
   [cart]);

 const PlaceOrder = async () => {
  try {
    //getting user
    const userRes = await axiosInstance.get("/user/getuser", { headers });
    const user = userRes.data.data;
    //console.log("User data:", user);

    //checking if address exists
    if (!user.address || user.address.trim() === "") {
      alert("Please update your address before placing an order.");
      navigate("/profile/settings"); // Or navigate to the edit profile page
      return;
    }

    // placing the order
    const res = await axiosInstance.post(
      "/order/place-order",
      { orderData: cart },
      { headers }
    );
    alert(res.data.message);
    navigate("/profile/orders");
  } catch (error) {
    console.error("Error placing order:", error);
    alert("Something went wrong. Please try again.");
  }
};


  return (
  <div className="bg-zinc-900 min-h-screen py-8 px-12 justify-between">
    <div>
      <h4 className="text-3xl md:text-5xl font-semibold text-zinc-500 mb-8">Cart</h4>

      {!cart && (
        <div className="flex items-center justify-center my-8">
          <Loader />
        </div>
      )}

      {cart && cart.length === 0 && (
        <div className="flex text-white flex-col items-center justify-center my-12 p-10">
          <h2>Cart Is Empty!</h2>
          <NavLink
            to="/books"
            className="text-yellow-500 mt-5 text-3xl font-semibold border-yellow-100 underline ml-2"
          >
            Explore Books
          </NavLink>
          <div className="text-yellow-500 text-6xl mt-4">
            <PiShoppingCartSimpleDuotone />
          </div>
        </div>
      )}

      {cart && cart.length > 0 && (
        <>
          <div className="my-8 grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {cart.map((item, i) => (
              <div key={i}>
                <BookCard
                  data={item}
                  incart={true}
                  onCartRemoved={fetchCart}
                />
              </div>
            ))}
          </div>

          {/* ✅ Wrap Place Order section only when cart is not empty */}
          <div className="bg-zinc-800 p-4 rounded mt-8 flex flex-col md:flex-row items-center justify-between">
            <div className="flex flex-col md:flex-row mb-4 md:mb-0">
              <p className="text-white text-2xl font-semibold">Total Cart Value: </p>
              <p className="text-yellow-100 text-2xl ml-2">{total} INR</p>
            </div>
            <button
              onClick={PlaceOrder}
              className="border-zinc-800 bg-yellow-100 rounded p-2 hover:bg-yellow-200 transition-all"
            >
              Place Order
            </button>
          </div>
        </>
      )}
    </div>
  </div>
);

};

export default Cart;
