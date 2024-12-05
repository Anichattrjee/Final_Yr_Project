import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [voterId, setVoterId] = useState("");
  const navigate = useNavigate();

  const handleLogin = () => {
    if (email === "admin@gmail.com" && password === "123") {
      navigate("/admin");
    } else {
      const storedData = JSON.parse(localStorage.getItem("userData"));
      if (
        storedData &&
        email === storedData.email &&
        password === storedData.password &&
        voterId === storedData.voterId
      ) {
        navigate("/", { state: { userName: storedData.name } });
      } else {
        alert("Invalid credentials. Please register first.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 to-blue-100 flex items-center justify-center">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-sm">
        <h1 className="text-3xl font-bold text-center text-blue-600 mb-6">
          Login
        </h1>
        <form
          className="space-y-4"
          onSubmit={(e) => e.preventDefault()}
        >
          {/* Email Input */}
          <div>
            <label
              className="block text-gray-700 font-medium mb-1"
              htmlFor="email"
            >
              Email
            </label>
            <div className="relative">
              <input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 border rounded-lg focus:ring focus:ring-blue-300 focus:outline-none"
              />
              <span className="absolute inset-y-0 right-4 flex items-center text-gray-400">
                📧
              </span>
            </div>
          </div>

          {/* Password Input */}
          <div>
            <label
              className="block text-gray-700 font-medium mb-1"
              htmlFor="password"
            >
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 border rounded-lg focus:ring focus:ring-blue-300 focus:outline-none"
              />
              <span className="absolute inset-y-0 right-4 flex items-center text-gray-400">
                🔒
              </span>
            </div>
          </div>

          {/* Voter ID Input */}
          <div>
            <label
              className="block text-gray-700 font-medium mb-1"
              htmlFor="voterId"
            >
              Voter ID
            </label>
            <div className="relative">
              <input
                id="voterId"
                type="text"
                placeholder="Enter your Voter ID"
                value={voterId}
                onChange={(e) => setVoterId(e.target.value)}
                className="w-full p-3 border rounded-lg focus:ring focus:ring-blue-300 focus:outline-none"
              />
              <span className="absolute inset-y-0 right-4 flex items-center text-gray-400">
                🆔
              </span>
            </div>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            onClick={handleLogin}
            className="w-full bg-blue-500 text-white font-bold py-3 rounded-lg hover:bg-blue-600 focus:ring focus:ring-blue-300"
          >
            Login
          </button>
        </form>
        <p className="text-center text-gray-500 mt-4">
          Don’t have an account?{" "}
          <a href="/register" className="text-blue-600 hover:underline">
            Register
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
