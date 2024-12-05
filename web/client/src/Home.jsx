import React from "react";
import { useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Carousel from "./components/Carousel";
import Cards from "./components/Cards";
import Testimonials from "./components/Testimonials";
import FeaturesSection from "./components/FeaturesSection";
import Footer from "./components/Footer";

const Home = () => {
  const location = useLocation();
  const userName = location.state?.userName || "Guest";

  return (
    <div>
      <Navbar />
      <Carousel />
      <div className="bg-gray-100 py-12">
        <h1 className="text-center text-4xl font-extrabold text-blue-600 mb-6">
          Welcome to the Voting System, {userName}!
        </h1>
        <p className="text-center text-gray-700 text-lg mb-12">
          Make your voice heard with our secure and efficient voting platform.
        </p>
        <Cards />
        <FeaturesSection />
        <Testimonials />
      </div>
      <Footer />
    </div>
  );
};

export default Home;
