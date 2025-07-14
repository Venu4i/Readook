import React from "react";
import { Link } from "react-router-dom";
import axiosInstance from "../../store/axios.js";

const BookCard = ({ data, favourite, onFavouriteRemoved, incart, onCartRemoved }) => {
  const headers = {
    id: localStorage.getItem("id"),
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  };

  const book = data.book || data; // fallback if not in cart

  const removeFavourites = async (bookId) => {
    try {
      await axiosInstance.patch(
        `/favourites/delete-from-favourites/${bookId}`,
        {},
        { headers }
      );
      if (onFavouriteRemoved) {
        onFavouriteRemoved();
      }
    } catch (err) {
      console.error("Failed to remove from favourites:", err);
    }
  };

  const removeFromcart = async (bookId) => {
    try {
      await axiosInstance.delete(
        `/cart/delete-from-cart/${bookId}`,
        {},
        { headers }
      );
      if (onCartRemoved) {
        onCartRemoved();
      }
    } catch (err) {
      console.error("Failed to remove book from cart:", err);
    }
  };

  return (
    <div className="bg-zinc-800 rounded p-4 flex flex-col md:h-[50vh] items-center justify-center hover:scale-105 transition-all duration-300">
      <Link to={`/get-book-details/${book._id}`}>
        <div className="bg-zinc-900 rounded flex items-center justify-center">
          <img src={book.url} alt="/" className="h-[25vh]" />
        </div>
        <h2 className="mt-4 text-white text-xl font-semibold">{book.title}</h2>
        <p className="mt-2 text-zinc-400 font-semibold">Author: {book.author}</p>
        <p className="mt-2 text-zinc-400 font-semibold">Price: {book.price} INR</p>
      </Link>

      {favourite && (
        <button
          onClick={() => removeFavourites(book._id)}
          className="bg-yellow-50 px-4 py-2 rounded border-yellow-500 text-yellow-500 mt-4 hover:bg-yellow-500 hover:text-white transition-all duration-300"
        >
          Remove
        </button>
      )}
      {incart && (
        <>
          <h1 className="text-white mt-2">Quantity: {data.quantity}</h1>
          <button
            onClick={() => removeFromcart(book._id)}
            className="bg-yellow-50 px-4 py-2 rounded border-yellow-500 text-yellow-500 mt-4 hover:bg-yellow-500 hover:text-white transition-all duration-300"
          >
            Remove
          </button>
        </>
      )}
    </div>
  );
};

export default BookCard;
