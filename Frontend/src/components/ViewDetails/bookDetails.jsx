import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useSelector } from "react-redux";

import Loader from "../Loader/loader";
import { GrLanguage } from "react-icons/gr";
import { MdCurrencyRupee } from "react-icons/md";
import { IoMdHeart, IoMdHeartEmpty } from "react-icons/io";
import { IoCartOutline } from "react-icons/io5";
import { TbEdit } from "react-icons/tb";
import { MdDeleteOutline } from "react-icons/md";
import axiosInstance from "../../store/axios";

const BookDetails = () => {
  const { id } = useParams();
  const [Data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [liked, setLiked] = useState(false);

  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const role = useSelector((state) => state.auth.role);
  const userId = localStorage.getItem("id");

  const headers = {
    id: userId,
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  };

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const resp = await axiosInstance.get(`/book/get-book-details/${id}`);
        setData(resp.data.data);
      } catch (error) {
        console.log(error);
        setError("Failed to load books. Please try again later.");
      }
    };

    fetchBooks();
  }, [id]);

  useEffect(() => {
    const checkFavouriteStatus = async () => {
      try {
        setLiked(false);
        const res = await axiosInstance.get(`/favourites/get-favourites`, { headers });
        const fav = res.data.data || [];
        const favouriteBookIds = fav.map((item) => String(item._id));
        setLiked(favouriteBookIds.includes(String(id)));
      } catch (err) {
        console.error("Error checking favourites:", err);
      }
    };

    if (isLoggedIn && role === "user") {
      checkFavouriteStatus();
    }
  }, [id, isLoggedIn, role]);

  const handleFavourites = async () => {
    try {
      if (!liked) {
        await axiosInstance.patch(`/favourites/add-to-favourites/${id}`, {}, { headers });
      } else {
        await axiosInstance.patch(`/favourites/delete-from-favourites/${id}`, {}, { headers });
      }
      setLiked(!liked);
    } catch (err) {
      console.error("Failed to update favourites:", err);
    }
  };

  const handleCart = async () => {
    try {
      await axiosInstance.post(`/cart/add-to-cart/${id}`, {}, { headers });
      alert("Book added to cart successfully");
    } catch (err) {
      console.error("Failed to update cart:", err);
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this book?")) {
      try {
        await axiosInstance.delete(`/book/delete-book/${id}`, { headers });
        alert("Book deleted successfully.");
        window.location.href = "/";
      } catch (err) {
        console.error("Failed to delete book:", err);
        alert("Failed to delete book. Please try again.");
      }
    }
  };

  return (
    <>
      {Data ? (
        <div className="bg-zinc-900 flex flex-col md:flex-row gap-8 py-8 px-5 md:px-12">
          <div className="bg-zinc-800 rounded p-4 h-[60vh] md:h-[80vh] w-full lg:w-2/6 flex items-center justify-center">
            <img src={Data.url} alt="Book Cover" className="h-[50vh] lg:h-[70vh]" />
          </div>

          
          {isLoggedIn && role === "user" && (
            <div className="flex md:flex-col gap-3">
              <button
                onClick={handleFavourites}
                className="bg-white rounded-full text-2xl p-2 mt-3 md:mt-5"
              >
                {liked ? <IoMdHeart className="text-red-500" /> : <IoMdHeartEmpty />}
              </button>
              <button onClick={handleCart} className="bg-white rounded-full text-2xl p-2 mt-3">
                <IoCartOutline />
              </button>
            </div>
          )}

          
          {isLoggedIn && (role === "admin" || userId === Data.seller) && (
            <div className="flex md:flex-col gap-3">
              <Link to={`/editBook/${id}`}>
                <button className="bg-white rounded-full text-2xl p-2 mt-3 md:mt-5">
                  <TbEdit />
                </button>
              </Link>
              <button
                onClick={handleDelete}
                className="bg-white text-red-500 rounded-full text-2xl p-2 mt-3"
              >
                <MdDeleteOutline />
              </button>
            </div>
          )}

          <div className="w-full lg:w-3/6 p-4">
            <h2 className="text-3xl text-yellow-100 font-semibold">{Data.title}</h2>
            <p className="mt-1 text-zinc-400 text-xl">By: {Data.author}</p>
            <p className="mt-4 text-xl text-zinc-400">{Data.description}</p>
            <p className="mt-2 text-zinc-400 text-xl flex">
              <GrLanguage className="me-3 mt-1" /> {Data.language}
            </p>
            <p className="mt-2 text-zinc-300 text-xl flex">
              Price: <MdCurrencyRupee className="ml-1 mt-1" /> {Data.price}
            </p>
          </div>
        </div>
      ) : (
        <div className="h-screen bg-zinc-900 flex items-center justify-center">
          <Loader />
        </div>
      )}
    </>
  );
};

export default BookDetails;
