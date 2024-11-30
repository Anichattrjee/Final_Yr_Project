import React from "react";
import Navbar from "./components/Navbar";
import Carousel from "./components/Carousel";
import Cards from "./components/Cards";
import Footer from "./components/Footer";

const Home = () => {
  return (
    <div>
      <Navbar />
      <Carousel />
      <div className="bg-gray-100 py-8">
        <h1 className="text-center text-3xl font-bold text-blue-600 mb-6">
          Welcome to the Voting System
        </h1>
        <Cards />
      </div>
      <Footer />
    </div>
  );
};

export default Home;
