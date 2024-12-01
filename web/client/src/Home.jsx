import React from "react";
import { useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Carousel from "./components/Carousel";
import Cards from "./components/Cards";
import Footer from "./components/Footer";

const Home = () => {
  const location = useLocation();
  const userName = location.state?.userName || "Guest"; 

  return (
    <div>
      <Navbar />
      <Carousel />
      <div className="bg-gray-100 py-8">
        <h1 className="text-center text-3xl font-bold text-blue-600 mb-6">
          Welcome to the Voting System, {userName}!
        </h1>
        <Cards />
      </div>
      <Footer />
    </div>
  );
};

export default Home;
