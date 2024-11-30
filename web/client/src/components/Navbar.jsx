import React from "react";
import { NavLink } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="bg-blue-600 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold">Voting System</h1>
        <div>
          <NavLink
            to="/register"
            className="px-4 py-2 bg-white text-blue-600 rounded-md mr-2 hover:bg-blue-500 hover:text-white"
            activeClassName="font-bold"
          >
            Register
          </NavLink>
          <NavLink
            to="/login"
            className="px-4 py-2 bg-white text-blue-600 rounded-md mr-2 hover:bg-blue-500 hover:text-white"
            activeClassName="font-bold"
          >
            Login
          </NavLink>
          <NavLink
            to="/about"
            className="px-4 py-2 bg-white text-blue-600 rounded-md hover:bg-blue-500 hover:text-white"
            activeClassName="font-bold"
          >
            About Us
          </NavLink>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
