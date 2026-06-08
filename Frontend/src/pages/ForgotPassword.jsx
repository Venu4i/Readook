import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ForgotPassword() {

  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    otp: "",
    newPassword: ""
  });

  const [loading, setLoading] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);

  const [message, setMessage] = useState({
    type: "",
    text: ""
  });

  const sendOTP = async () => {

    try {

      setOtpLoading(true);

      const res = await fetch(
        "https://readook.onrender.com/api/v1/otp/send-reset-otp",
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
        throw new Error(data.message);
      }

      setMessage({
        type: "success",
        text: "OTP sent successfully"
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

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      setLoading(true);

      const res = await fetch(
        "https://readook.onrender.com/api/v1/otp/reset-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(form)
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message);
      }

      alert("Password reset successfully");

      navigate("/login");

    } catch (err) {

      setMessage({
        type: "error",
        text: err.message
      });

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-900 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-lg">

        <h2 className="text-2xl font-bold mb-6 text-center text-zinc-800">
          Reset Password
        </h2>

        {message.text && (
          <div
            className={`mb-4 px-4 py-2 rounded text-sm ${
              message.type === "error"
                ? "bg-red-100 text-red-700"
                : "bg-green-100 text-green-700"
            }`}
          >
            {message.text}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >

          <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) =>
              setForm({
                ...form,
                email: e.target.value
              })
            }
            className="w-full p-3 border rounded-lg"
            required
          />

          <div className="flex gap-2">

            <input
              type="text"
              placeholder="OTP"
              value={form.otp}
              onChange={(e) =>
                setForm({
                  ...form,
                  otp: e.target.value
                })
              }
              className="flex-1 p-3 border rounded-lg"
              required
            />

            <button
              type="button"
              onClick={sendOTP}
              disabled={otpLoading}
              className="bg-green-500 text-white px-4 rounded-lg"
            >
              {otpLoading
                ? "Sending..."
                : "Send OTP"}
            </button>

          </div>

          <input
            type="password"
            placeholder="New Password"
            value={form.newPassword}
            onChange={(e) =>
              setForm({
                ...form,
                newPassword: e.target.value
              })
            }
            className="w-full p-3 border rounded-lg"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600"
          >
            {loading
              ? "Updating..."
              : "Reset Password"}
          </button>

          <button
            type="button"
            onClick={() => navigate("/login")}
            className="w-full text-blue-500"
          >
            Back to Login
          </button>

        </form>

      </div>
    </div>
  );
}