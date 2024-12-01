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
    if (storedData && 
        email === storedData.email && 
        password === storedData.password &&
        voterId===storedData.voterId) {
      navigate("/", { state: { userName: storedData.name } });
        } else {
          alert("Invalid credentials. Please register first.");
        }
      }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">Login</h1>
      <form
        className="bg-white shadow-md rounded px-8 pt-6 pb-8 w-96"
        onSubmit={(e) => e.preventDefault()}
      >
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Email
          </label>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Password
          </label>
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Voter ID 
          </label>
          <input
            type="text"
            placeholder="Enter your Voter ID"
            value={voterId}
            onChange={(e) => setVoterId(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
          />
        </div>
        <button
          type="submit"
          onClick={handleLogin}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full"
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
