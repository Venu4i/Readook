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

  //ai
  const [aiQuery, setAiQuery] = useState("");
  const [aiLoading, setAiLoading] = useState(false);

useEffect(() => {
    const fetchBooks = async () => {
      try {
        const token = localStorage.getItem("token");
        
        //If token exists, add it to headers.
        const config = token 
          ? { headers: { Authorization: `Bearer ${token}` } } 
          : {};

        const resp = await axiosInstance.get(
          "http://localhost:3000/api/v1/book/get-all-books",
          config 
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

  const handleAIDiscovery = async () => {
    if (!aiQuery.trim()) {
      return alert("Please describe what kind of book you want");
    }

    try {
      setAiLoading(true);

      const res = await axiosInstance.post(
        "/ai/discoverBooks",
        {
          query: aiQuery,
        }
      );
      console.log("AI Discovery Response:", res.data);
      setData(res.data.books);

    } catch (error) {
      console.error(error);
      alert("error : " + (error.response?.data?.message || error.message));
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className="bg-zinc-900 min-h-screen py-8 px-12">
      <h4 className="text-3xl font-semibold text-yellow-100 mb-4">
        Available Books
      </h4>

      <div className="bg-zinc-800 p-4 rounded mb-6">
        <h3 className="text-lg font-semibold text-yellow-200 mb-2">
          AI Assisted Discovery
        </h3>

        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            placeholder="Describe the book you want to read..."
            value={aiQuery}
            onChange={(e) => setAiQuery(e.target.value)}
            className="p-2 rounded flex-1 text-white bg-zinc-700"
          />

          <button
            onClick={handleAIDiscovery}
            disabled={aiLoading}
            className="bg-indigo-600 hover:bg-indigo-500 px-4 py-2 rounded text-white"
          >
            {aiLoading ? "Searching..." : "AI Discover"}
          </button>
        </div>

        <p className="text-zinc-400 text-sm mt-2">
          Example: "Fantasy book with dragons and magic"
        </p>
      </div>

      
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
