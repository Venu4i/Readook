import React, { useEffect, useState } from "react";
import BookCard from "../components/BookCard/BookCard.jsx";
import Loader from "../components/Loader/loader.jsx";
import axiosInstance from "../store/axios.js";

const Books = () => {
  const [Data, setData] = useState([]);
  const [error, setError] = useState(null);

  // Search/filter states
  const [searchTitle, setSearchTitle] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("");

useEffect(() => {
    const fetchBooks = async () => {
      try {
        const token = localStorage.getItem("token");
        
        // Define configuration. If token exists, add it to headers.
        const config = token 
          ? { headers: { Authorization: `Bearer ${token}` } } 
          : {};

        const resp = await axiosInstance.get(
          "http://localhost:3000/api/v1/book/get-all-books",
          config // Pass the config here
        );

        setData(resp.data.data);
      } catch (error) {
        console.log("Error fetching books:", error);
        setError("Failed to load books. Please try again later.");
      }
    };
    
    fetchBooks();
  }, []);

  // Filtering logic
  const filteredBooks = Data.filter((book) => {
    const matchesTitle = book.title
      .toLowerCase()
      .includes(searchTitle.toLowerCase());
    const matchesLanguage =
      !selectedLanguage || book.language === selectedLanguage;
    return matchesTitle && matchesLanguage;
  });

  return (
    <div className="bg-zinc-900 min-h-screen py-8 px-12">
      <h4 className="text-3xl font-semibold text-yellow-100 mb-4">
        Available Books
      </h4>

      {/* Search and Filter Controls */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <input
          type="text"
          placeholder="Search by title..."
          value={searchTitle}
          onChange={(e) => setSearchTitle(e.target.value)}
          className="p-2 rounded w-full text-white bg-zinc-800 sm:w-1/2"
        />
        <select
          value={selectedLanguage}
          onChange={(e) => setSelectedLanguage(e.target.value)}
          className="p-2 rounded w-full sm:w-1/4 text-white bg-zinc-800"
        >
          <option value="">All Languages</option>
          <option value="English">English</option>
          <option value="Hindi">Hindi</option>
          <option value="French">French</option>
          <option value="Spanish">Spanish</option>
          {/* Add more as needed */}
        </select>
      </div>

      {!Data && (
        <div className="flex items-center justify-center my-8">
          <Loader />
        </div>
      )}

      <div className="my-8 grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredBooks && filteredBooks.length > 0 ? (
          filteredBooks.map((book, i) => (
            <div key={i}>
              <BookCard data={book} />
            </div>
          ))
        ) : (
          <p className="text-yellow-100 col-span-full">No books found.</p>
        )}
      </div>
    </div>
  );
};

export default Books;
