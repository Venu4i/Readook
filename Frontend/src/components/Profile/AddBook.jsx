import React, { useState } from "react";
import axiosInstance from "../../store/axios";
import { useNavigate } from "react-router-dom";

const AddBooks = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    url: "",
    title: "",
    author: "",
    price: "",
    description: "",
    language: "",
    category: "",
  });

  const [aiLoading, setAiLoading] = useState(false);

  const headers = {
    id: localStorage.getItem("id"),
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const generateDescription = async () => {
    if (!form.title || !form.author) {
      return alert("Please enter title and author first");
    }

    try {
      setAiLoading(true);

      const res = await axiosInstance.post(
        "/ai/generateDescription",
        {
          title: form.title,
          author: form.author,
        },
        { headers }
      );

      setForm({
        ...form,
        description: res.data.data.description,
        category: res.data.data.category,
      });

    } catch (error) {
      console.error(error);
      alert("Failed to generate description");
    } finally {
      setAiLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axiosInstance.post("/book/add-book", form, { headers });
      //console.log(res.data);
      alert(res.data.message);
      navigate("/profile/addedBooks");
    } catch (error) {
      alert("Failed to add book. Make sure you are an admin.");
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-900 text-white flex items-center justify-center p-8">
      <form onSubmit={handleSubmit} className="bg-zinc-800 p-6 rounded shadow-md w-full max-w-xl">
        <h2 className="text-3xl font-bold mb-6 text-yellow-200">Add a New Book</h2>

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
          className="w-full mb-2 p-2 rounded bg-zinc-700 text-white"
          required
        />

        <button
          type="button"
          onClick={generateDescription}
          disabled={aiLoading}
          className="w-full mb-4 bg-indigo-600 hover:bg-indigo-500 text-white py-2 rounded transition"
        >
          {aiLoading ? "Generating..." : "Generate Description with AI"}
        </button>

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

        <label className="block mb-2">Category</label>
        <input
          type="text"
          name="category"
          value={form.category}
          onChange={handleChange}
          className="w-full mb-6 p-2 rounded bg-zinc-700 text-white"
          required
        />

        <button
          type="submit"
          className="w-full bg-yellow-400 text-black font-semibold py-2 rounded hover:bg-yellow-500 transition"
        >
          Add Book
        </button>
      </form>
    </div>
  );
};

export default AddBooks;
