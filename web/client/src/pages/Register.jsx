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
    const { name, email, password, voterId } = formData;
    localStorage.setItem(
      "userData",
      JSON.stringify({ name, email, password, voterId })
    );
    alert("Registration successful! Redirecting to Login page...");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 to-blue-100 flex items-center justify-center">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md border border-blue-200">
        <h1 className="text-3xl font-bold text-center text-blue-600 mb-6">
          Register
        </h1>
        <form className="space-y-4" onSubmit={handleSubmit}>
          {[
            { field: "name", type: "text", placeholder: "Enter your name" },
            { field: "age", type: "number", placeholder: "Enter your age" },
            { field: "address", type: "text", placeholder: "Enter your address" },
            { field: "email", type: "email", placeholder: "Enter your email" },
            { field: "password", type: "password", placeholder: "Enter your password" },
            { field: "voterId", type: "text", placeholder: "Enter your Voter ID" },
          ].map(({ field, type, placeholder }) => (
            <div key={field}>
              <label
                htmlFor={field}
                className="block text-gray-700 font-medium mb-1 capitalize"
              >
                {field}
              </label>
              <input
                id={field}
                type={type}
                name={field}
                placeholder={placeholder}
                value={formData[field]}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg focus:ring focus:ring-blue-300 focus:outline-none"
              />
            </div>
          ))}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white font-bold py-3 rounded-lg hover:bg-blue-600 focus:ring focus:ring-blue-300"
          >
            Register
          </button>
        </form>
        <p className="text-center text-gray-500 mt-4">
          Already have an account?{" "}
          <a href="/login" className="text-blue-600 hover:underline">
            Login
          </a>
        </p>
      </div>
    </div>
  );
};

export default Register;
