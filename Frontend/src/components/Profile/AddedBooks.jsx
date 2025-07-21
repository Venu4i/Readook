import React, { useState, useEffect } from "react";
import axiosInstance from "../../store/axios";
import Loader from "../Loader/loader.jsx";
import { NavLink } from "react-router-dom";
import BookCard from "../BookCard/BookCard.jsx";

const AddedBooks = () => {
  const [Data, setData] = useState(null);
  const [error, setError] = useState(null);

  // Search/filter state
  const [searchTitle, setSearchTitle] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("");

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const resp = await axiosInstance.get("/book/get-added-books", {
          headers: {
            id: localStorage.getItem("id"),
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        console.log(resp);
        setData(resp.data.data);
      } catch (error) {
        console.log(error);
        setError("Failed to load books. Please try again later.");
      }
    };
    fetchBooks();
  }, []);

  // Filter logic
  const filteredBooks =
    Data?.filter((book) => {
      const matchesTitle = book.title
        .toLowerCase()
        .includes(searchTitle.toLowerCase());
      const matchesLanguage =
        !selectedLanguage || book.language === selectedLanguage;
      return matchesTitle && matchesLanguage;
    }) || [];

  return (
    <div className="bg-zinc-900 min-h-screen py-8 px-12">
      <h4 className="text-3xl font-semibold text-zinc-500">Added Books</h4>

      {/* Search and Filter Controls */}
      <div className="flex flex-col sm:flex-row justify-between gap-4 mt-6 mb-6">
        <input
          type="text"
          placeholder="Search by title..."
          value={searchTitle}
          onChange={(e) => setSearchTitle(e.target.value)}
          className="p-2 rounded w-full sm:w-1/2"
        />
        <select
          value={selectedLanguage}
          onChange={(e) => setSelectedLanguage(e.target.value)}
          className="p-2 rounded w-full text-white bg-zinc-800 sm:w-1/4"
        >
          <option value="">All Languages</option>
          <option value="English">English</option>
          <option value="Hindi">Hindi</option>
          <option value="French">French</option>
          <option value="Spanish">Spanish</option>
        </select>
      </div>

      {!Data && (
        <div className="flex items-center justify-center my-8">
          <Loader />
        </div>
      )}

      <div className="my-8 grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-6 items-center justify-center">
        {Data && Data.length === 0 && (
          <div className="text-xl items-center justify-center">
            <h2 className="text-zinc-300 m-5 mb-3 font-semibold">
              No Books Added
            </h2>
            <NavLink
              to="/profile/addBooks"
              className="rounded mt-8 m-5 underline text-yellow-50"
            >
              Add Books
            </NavLink>
          </div>
        )}
        {filteredBooks.length > 0 ? (
          filteredBooks.map((book, i) => (
            <div key={i}>
              <BookCard data={book} />
            </div>
          ))
        ) : (
          Data &&
          Data.length > 0 && (
            <p className="text-yellow-100 col-span-full">No matching books.</p>
          )
        )}
      </div>
    </div>
  );
};

export default AddedBooks;
