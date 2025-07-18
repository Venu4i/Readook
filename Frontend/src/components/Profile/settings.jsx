import React, { useEffect, useState } from "react";
import axiosInstance from "../../store/axios";
import Loader from "../Loader/loader.jsx";

const Settings = () => {
  const [value, setValue] = useState({ address: "" });
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);

  const headers = {
    id: localStorage.getItem("id"),
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  };

  useEffect(() => {
    const fetch = async () => {
      try {
        const resp = await axiosInstance.get("/user/getuser", { headers });
        setProfile(resp.data.data);
        setValue({ address: resp.data.data.address || "" });
      } catch (err) {
        console.error("Failed to fetch user profile:", err);
      }
    };
    fetch();
  }, []);

  const handleChange = (e) => {
    setValue({ ...value, address: e.target.value });
  };

  const handleSubmit = async () => {
    if (!value.address.trim()) {
      alert("Address cannot be empty.");
      return;
    }

    setLoading(true);
    try {
      const res = await axiosInstance.patch(
        "/user/update-address",
        { address: value.address },
        { headers }
      );
      alert("Address updated successfully!");
    } catch (error) {
      console.error("Error updating address:", error);
      alert("Failed to update address. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-900 text-white p-6">
      <h1 className="text-3xl md:text-5xl font-semibold text-zinc-500 mb-8">Settings</h1>

      {!profile && (
         <div className="items-center">
         <Loader />
         </div>
      )}
      {profile && (
        <div className="max-w-md mt-7">
          <label className="block mb-2 text-sm font-medium">Address</label>
          <textarea
            value={value.address}
            onChange={handleChange}
            className="w-full p-2 rounded bg-zinc-800 border border-zinc-700 text-white"
            rows="4"
            placeholder="Enter your address"
          />
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="mt-4 bg-yellow-500 text-black px-4 py-2 rounded hover:bg-yellow-600 transition"
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      )}
    </div>
  );
};

export default Settings;
