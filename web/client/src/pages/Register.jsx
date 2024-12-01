import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    address: "",
    email: "",
    password: "",
    voterId: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      !formData.name ||
      !formData.age ||
      !formData.address ||
      !formData.email ||
      !formData.password ||
      !formData.voterId
    ) {
      alert("Please fill in all fields!");
      return;
    }
    const { name, email, password,voterId } = formData;
    localStorage.setItem("userData", JSON.stringify({ name, email, password,voterId }));
    alert("Registration successful! Redirecting to Login page...");
    navigate("/login"); 
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">Register</h1>
      <form
        className="bg-white shadow-md rounded px-8 pt-6 pb-8 w-96"
        onSubmit={handleSubmit}
      >
        {["name", "age", "address", "email", "password", "voterId"].map((field) => (
          <div className="mb-4" key={field}>
            <label className="block text-gray-700 text-sm font-bold mb-2 capitalize">
              {field}
            </label>
            <input
              type={field === "password" ? "password" : "text"}
              name={field}
              placeholder={`Enter your ${field}`}
              value={formData[field]}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
            />
          </div>
        ))}
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full"
        >
          Register
        </button>
      </form>
    </div>
  );
};

export default Register;
