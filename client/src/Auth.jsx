import React, { useState } from "react";
import axios from "axios";

const API_URL = "http://localhost:5001";

const Auth = ({ onLogin }) => {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      alert("Please fill all fields");
      return;
    }

    try {
      setLoading(true);
      const endpoint = isLoginMode ? "/auth/login" : "/auth/signup";

      const res = await axios.post(`${API_URL}${endpoint}`, {
        email,
        password,
      });

      const { token } = res.data;

      // save token in localStorage for later requests
      localStorage.setItem("token", token);

      onLogin(); // tell App: "user is logged in"
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Auth failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-full flex items-center justify-center bg-gray-900">
      <div className="bg-gray-800 p-10 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-3xl text-center font-bold text-white mb-6">
          {isLoginMode ? "Login" : "Create Account"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="email"
            placeholder="Email Address"
            className="w-full p-3 rounded bg-gray-700 text-white border border-gray-600 focus:border-blue-500 outline-none"
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 rounded bg-gray-700 text-white border border-gray-600 focus:border-blue-500 outline-none"
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-500 transition text-white font-bold py-3 rounded-md disabled:opacity-50"
          >
            {loading
              ? "Please wait..."
              : isLoginMode
              ? "Login"
              : "Sign Up"}
          </button>
        </form>

        <p className="text-gray-400 text-sm text-center mt-4">
          {isLoginMode ? "Don't have an account?" : "Already have an account?"}
          <button
            className="text-blue-400 ml-1"
            onClick={() => setIsLoginMode(!isLoginMode)}
          >
            {isLoginMode ? "Register" : "Login"}
          </button>
        </p>
      </div>
    </div>
  );
};

export default Auth;
