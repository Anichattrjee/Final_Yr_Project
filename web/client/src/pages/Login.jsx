import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../apiCalls/apis"; // Adjust the import path as necessary

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [voterId, setVoterId] = useState(""); 
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const user = await loginUser({ email, password });
      
      // Store user data and token before navigation
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('token', user.token);
      
      // Force reload to initialize axios interceptors
      window.location.href = user.role === 'admin' ? '/admin' : '/';
      
    } catch (error) {
      // Error handling
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 to-blue-100 flex items-center justify-center">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-sm border border-blue-200">
        <h1 className="text-3xl font-bold text-center text-blue-600 mb-6">
          Login
        </h1>
        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Email Input */}
          <div>
            <label htmlFor="email" className="block text-gray-700 font-medium mb-1">
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
                required
              />
              <span className="absolute inset-y-0 right-4 flex items-center text-gray-400">
                📧
              </span>
            </div>
          </div>

          {/* Password Input */}
          <div>
            <label htmlFor="password" className="block text-gray-700 font-medium mb-1">
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
                required
              />
              <span className="absolute inset-y-0 right-4 flex items-center text-gray-400">
                🔒
              </span>
            </div>
          </div>

          {/* Voter ID Input (optional) */}
          

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full ${
              loading ? "bg-blue-300" : "bg-blue-500 hover:bg-blue-600"
            } text-white font-bold py-3 rounded-lg focus:ring focus:ring-blue-300`}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        <p className="text-center text-gray-500 mt-4">
          Don’t have an account?{' '}
          <a href="/register" className="text-blue-600 hover:underline">
            Register
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
