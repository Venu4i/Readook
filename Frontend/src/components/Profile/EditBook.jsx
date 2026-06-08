import React, { useEffect, useState } from "react";
import axiosInstance from "../../store/axios";
import { useNavigate, useParams } from "react-router-dom";

const EditBook = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    url: "",
    title: "",
    author: "",
    price: "",
    description: "",
    language: "",
  });

  const headers = {
    id: localStorage.getItem("id"),
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  };

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const res = await axiosInstance.get(`/book/get-book-details/${id}`, {
          headers,
        });
        setForm(res.data.data);
      } catch (err) {
        console.error("Failed to fetch book details", err);
        alert("Failed to load book details.");
      }
    };

    fetchBook();
  }, [id]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axiosInstance.patch(`/book/update-book/${id}`, form, {
        headers,
      });
      alert(res.data.message);
      navigate("/books");
    } catch (err) {
      console.error("Failed to update book", err);
      alert("Failed to update book. Only admins can perform this action.");
    }
  };

  return (
    <div className="min-h-screen bg-zinc-900 text-white flex items-center justify-center p-8">
      <form
        onSubmit={handleSubmit}
        className="bg-zinc-800 p-6 rounded shadow-md w-full max-w-xl"
      >
        <h2 className="text-3xl font-bold mb-6 text-yellow-200">Edit Book</h2>

        <label className="block mb-2">Image URL</label>
        <input
          type="text"
          name="url"
          value={form.url}
          onChange={handleChange}
          className="w-full mb-4 p-2 rounded bg-zinc-700 text-white"
          required
        />

        <label className="block mb-2">Title</label>
        <input
          type="text"
          name="title"
          value={form.title}
          onChange={handleChange}
          className="w-full mb-4 p-2 rounded bg-zinc-700 text-white"
          required
        />

        <label className="block mb-2">Author</label>
        <input
          type="text"
          name="author"
          value={form.author}
          onChange={handleChange}
          className="w-full mb-4 p-2 rounded bg-zinc-700 text-white"
          required
        />

        <label className="block mb-2">Price (INR)</label>
        <input
          type="number"
          name="price"
          value={form.price}
          onChange={handleChange}
          className="w-full mb-4 p-2 rounded bg-zinc-700 text-white"
          required
        />

        <label className="block mb-2">Description</label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          className="w-full mb-4 p-2 rounded bg-zinc-700 text-white"
          rows={3}
          required
        />

        <label className="block mb-2">Language</label>
        <input
          type="text"
          name="language"
          value={form.language}
          onChange={handleChange}
          className="w-full mb-6 p-2 rounded bg-zinc-700 text-white"
          required
        />

        <button
          type="submit"
          className="w-full bg-yellow-400 text-black font-semibold py-2 rounded hover:bg-yellow-500 transition"
        >
          Update Book
        </button>
      </form>
    </div>
  );
};

export default EditBook;
