import React, { useEffect, useState } from "react";
import axiosInstance from "../../store/axios.js";
import BookCard from "../BookCard/BookCard.jsx";
import Loader from "../Loader/loader.jsx";
import { NavLink } from "react-router-dom";

const Favourites = () => {
  const [favBooks, setFavBooks] = useState(null);

  const headers = {
    id: localStorage.getItem("id"),
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  };

  const fetchFavourites = async () => {
    try {
      const response = await axiosInstance.get("/favourites/get-favourites", {
        headers,
      });
      console.log (response.data.data);

      // Get the book data from each favourite
      const books = response.data.data;
      setFavBooks(books);
    } catch (error) {
      console.error("Error fetching favourites:", error);
    }
  };

  useEffect(() => {
    fetchFavourites();
  }, []);

  return (
    <div className="bg-zinc-900 h-auto py-8 px-12">
      <h4 className="text-3xl font-semibold text-yellow-100">Favourite Books</h4>

      {!favBooks && (
        <div className="flex items-center justify-center my-8">
          <Loader />
        </div>
      )}
      {favBooks && favBooks.length === 0 && (
        <div className="flex flex-col font-semibold items-center justify-center my-8">
           <h2> you have no books added to Favourites. </h2>
           <NavLink to="/books" className="text-yellow-500 border-yellow-100 underline ml-2">
             Explore Books  
            </NavLink>
        </div>
      )}

      <div className="my-8 grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-6">
        {favBooks &&
          favBooks.length > 0 &&
          favBooks.map((item, i) => (
            <div key={i}>
              <BookCard
                data={item}
                favourite={true}
                onFavouriteRemoved={fetchFavourites} // Pass the refetch function
              />
            </div>
          ))}
      </div>
    </div>
  );
};

export default Favourites;
