import React from "react";
import { NavLink } from "react-router-dom";
import { FaUserAlt, FaSignInAlt, FaInfoCircle } from "react-icons/fa"; // Importing icons for visual appeal

const Navbar = () => {
  return (
    <nav className="bg-blue-600 text-white p-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo Section */}
        <h1 className="text-3xl font-extrabold tracking-wider text-white">
          Voting System
        </h1>
        
        {/* NavLinks */}
        <div className="flex space-x-6">
          <NavLink
            to="/register"
            className="flex items-center space-x-2 text-lg font-semibold px-4 py-2 rounded-lg hover:bg-white hover:text-blue-600 transition-all duration-300 ease-in-out"
            activeClassName="font-bold"
          >
            <FaUserAlt className="text-xl" />
            <span>Register</span>
          </NavLink>

          <NavLink
            to="/login"
            className="flex items-center space-x-2 text-lg font-semibold px-4 py-2 rounded-lg hover:bg-white hover:text-blue-600 transition-all duration-300 ease-in-out"
            activeClassName="font-bold"
          >
            <FaSignInAlt className="text-xl" />
            <span>Login</span>
          </NavLink>

          <NavLink
            to="/about"
            className="flex items-center space-x-2 text-lg font-semibold px-4 py-2 rounded-lg hover:bg-white hover:text-blue-600 transition-all duration-300 ease-in-out"
            activeClassName="font-bold"
          >
            <FaInfoCircle className="text-xl" />
            <span>About Us</span>
          </NavLink>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
