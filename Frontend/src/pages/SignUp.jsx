import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';


export default function SignupPage() {
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    role: 'user' ,// default role
    otp : ''
  });

  const navigate = useNavigate()

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const roles = ["user", "seller"];
  const [showDropdown, setShowDropdown] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const res = await fetch('http://localhost:3000/api/v1/user/register', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      console.log(data);
      

      if (!res.ok) throw new Error(data.message || 'Signup failed');

      setMessage({ type: 'success', text: 'Signup successful!' });
      setForm({ username: '', email: '', password: '', role: 'user' }); // Reset
      navigate('/login') // Redirect to login after successful signup
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setLoading(false);
    }
  };

  const sendOTP = async () => {

    if (!form.email.trim()) {
      setMessage({
        type: "error",
        text: "Enter email first"
      });
      return;
    }

    try {

      setOtpLoading(true);

      const res = await fetch(
        "http://localhost:3000/api/v1/otp/send-otp",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            email: form.email
          })
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.message || "Failed to send OTP"
        );
      }

      setMessage({
        type: "success",
        text: "OTP sent to your email"
      });

    } catch (err) {

      setMessage({
        type: "error",
        text: err.message
      });

    } finally {
      setOtpLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-900 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-center">Create an Account</h2>

        {message.text && (
          <div
            className={`mb-4 text-sm font-medium px-4 py-2 rounded ${
              message.type === 'error' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
            }`}
          >
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="username"
            value={form.username}
            onChange={handleChange}
            placeholder="Username"
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email Address"
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
          <div className="flex gap-2">
            <input
              type="text"
              name="otp"
              value={form.otp}
              onChange={handleChange}
              placeholder="Enter OTP"
              className="flex-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />

            <button
              type="button"
              onClick={sendOTP}
              disabled={otpLoading}
              className="bg-green-500 text-white px-4 rounded-lg hover:bg-green-600"
            >
              {otpLoading
                ? "Sending..."
                : "Send OTP"}
            </button>
          </div>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Password"
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
        <div className="relative">
                <label htmlFor="role" className="block mb-1 text-gray-300 font-medium">
                </label>
                <button
                    type="button"
                    onClick={() => setShowDropdown(!showDropdown)}
                    className="w-full bg-white border rounded-lg px-4 py-3 text-left shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    {form.role || "Select a role"}
                </button>
                {showDropdown && (
                    <ul className="absolute z-10 mt-2 w-full bg-white border border-gray-300 rounded-lg shadow-lg">
                    {roles.map((role) => (
                        <li
                        key={role}
                        onClick={() => {
                            setForm({ ...form, role });
                            setShowDropdown(false);
                        }}
                        className="px-4 py-2 hover:bg-blue-100 cursor-pointer"
                        >
                        {role}
                        </li>
                    ))}
                    </ul>
                )}
            </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 transition"
          >
            {loading ? 'Signing up...' : 'Sign Up'}
          </button>
        </form>
      </div>
    </div>
  );
}
