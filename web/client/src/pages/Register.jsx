import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../apiCalls/apis"; // Adjust path if needed

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    voterID: "",
    role: "voter",
    party: "",
    position: "",
    constituency: "",
  });
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { username, email, password, voterID, role, party, position, constituency } = formData;
  
    // Enhanced validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!username || !email || !password || !voterID) {
      alert("Please fill in all required fields!");
      return;
    }
    if (!emailRegex.test(email)) {
      alert("Please enter a valid email address!");
      return;
    }
    if (role === "candidate" && (!party || !position || !constituency)) {
      alert("Please fill in all candidate details!");
      return;
    }
  
    setLoading(true);
    try {
      const payload = { 
        username, 
        email, 
        password, 
        voterID, 
        role,
        // Correct candidate info structure
        ...(role === "candidate" && {
          candidateInfo: {
            party,
            position,
            constituency
          }
        })
      };
  
      const res = await registerUser(payload);
      alert(res.message || "Registration successful! Please await approval if applicable.");
      navigate("/login");
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      if (errorMessage.includes("duplicate")) {
        alert("This email or voter ID is already registered!");
      } else {
        alert(errorMessage || "Registration failed.");
      }
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 to-blue-100 flex items-center justify-center">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md border border-blue-200">
        <h1 className="text-3xl font-bold text-center text-blue-600 mb-6">
          Register
        </h1>
        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Username */}
          <div>
            <label htmlFor="username" className="block text-gray-700 font-medium mb-1">
              Name
            </label>
            <input
              id="username"
              name="username"
              type="text"
              placeholder="Enter your name"
              value={formData.username}
              onChange={handleChange}
              required
              className="w-full p-3 border rounded-lg focus:ring focus:ring-blue-300 focus:outline-none"
            />
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-gray-700 font-medium mb-1">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full p-3 border rounded-lg focus:ring focus:ring-blue-300 focus:outline-none"
            />
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-gray-700 font-medium mb-1">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full p-3 border rounded-lg focus:ring focus:ring-blue-300 focus:outline-none"
            />
          </div>

          {/* Voter ID */}
          <div>
            <label htmlFor="voterID" className="block text-gray-700 font-medium mb-1">
              UID
            </label>
            <input
              id="voterID"
              name="voterID"
              type="text"
              placeholder="Enter your UID"
              value={formData.voterID}
              onChange={handleChange}
              required
              className="w-full p-3 border rounded-lg focus:ring focus:ring-blue-300 focus:outline-none"
            />
          </div>

          {/* Role Selection */}
          <div>
            <label htmlFor="role" className="block text-gray-700 font-medium mb-1">
              Register As
            </label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg focus:ring focus:ring-blue-300 focus:outline-none"
            >
              <option value="voter">Voter</option>
              <option value="candidate">Candidate</option>
            </select>
          </div>

          {/* Candidate Details */}
          {formData.role === "candidate" && (
            <>
              <div>
                <label htmlFor="party" className="block text-gray-700 font-medium mb-1">
                  Party
                </label>
                <input
                  id="party"
                  name="party"
                  type="text"
                  placeholder="Enter party name"
                  value={formData.party}
                  onChange={handleChange}
                  required
                  className="w-full p-3 border rounded-lg focus:ring focus:ring-blue-300 focus:outline-none"
                />
              </div>
              <div>
                <label htmlFor="position" className="block text-gray-700 font-medium mb-1">
                  Position
                </label>
                <input
                  id="position"
                  name="position"
                  type="text"
                  placeholder="Enter position"
                  value={formData.position}
                  onChange={handleChange}
                  required
                  className="w-full p-3 border rounded-lg focus:ring focus:ring-blue-300 focus:outline-none"
                />
              </div>
              <div>
                <label htmlFor="constituency" className="block text-gray-700 font-medium mb-1">
                  Constituency
                </label>
                <input
                  id="constituency"
                  name="constituency"
                  type="text"
                  placeholder="Enter constituency"
                  value={formData.constituency}
                  onChange={handleChange}
                  required
                  className="w-full p-3 border rounded-lg focus:ring focus:ring-blue-300 focus:outline-none"
                />
              </div>
            </>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`w-full ${
              loading ? "bg-blue-300" : "bg-blue-500 hover:bg-blue-600"
            } text-white font-bold py-3 rounded-lg focus:ring focus:ring-blue-300`}
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>
        <p className="text-center text-gray-500 mt-4">
          Already have an account?{' '}
          <a href="/login" className="text-blue-600 hover:underline">
            Login
          </a>
        </p>
      </div>
    </div>
  );
};

export default Register;
