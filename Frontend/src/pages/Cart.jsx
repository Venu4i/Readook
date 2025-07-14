import React, { useEffect, useState } from "react";
import axiosInstance from "../store/axios.js";
import BookCard from "../components/BookCard/BookCard.jsx";
import Loader from "../components/Loader/loader.jsx";
import { PiShoppingCartSimpleDuotone } from "react-icons/pi";
import { NavLink } from "react-router-dom";

const Cart = () => {
  const [cart, setCart] = useState(null);
  const [total, setTotal] = useState(0);


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

  return (
    <div className="bg-zinc-900 min-h-screen py-8 px-12 justify-between">
      <div>
      <h4 className="text-3xl font-semibold text-yellow-100">Cart</h4>

      {!cart && (
        <div className="flex items-center justify-center my-8">
          <Loader />
        </div>
      )}
      {cart && cart.length === 0 && (
        <div className="flex text-white flex-col  items-center justify-center my-12 p-10">
           <h2> Cart Is Empty !  </h2>
           <NavLink to="/books" className="text-yellow-500 mt-5 text-3xl font-semibold border-yellow-100 underline ml-2">
             Explore Books  
            </NavLink>
            <div className="text-yellow-500 text-6xl mt-4">
            <PiShoppingCartSimpleDuotone />
            </div>
            
        </div>
      )}

      <div className="my-8 grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-6">
        {cart &&
          cart.length > 0 &&
          cart.map((item, i) => (
            // console.log(cart),
            <div key={i}>
              <BookCard
                data={item}
                incart={true}
                onCartRemoved={fetchCart} // Pass the refetch function
              />
            </div>
          ))}
      </div>
      </div>
      <div className="bg-zinc-800 p-4 rounded mt-8 flex flex-row md:flex col items-center justify-between">
        <div className="flex flex-col md:flex-row">
        <p className="text-white text-2xl font-semibold">Total Cart Value : </p>
        <p className="text-yellow-100 text-2xl"> {total}  INR 
        </p>
        </div>
        <button className="border-zinc-800 bg-yellow-100 rounded p-1 ">
          Place Order 
        </button>
      </div>
    </div>
  );
};

export default Cart;
