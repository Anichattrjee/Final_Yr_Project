import React from "react";
import { useNavigate } from "react-router-dom";

const Cards = () => {
  const features = [
    {
      title: "Cast Vote",
      description: "Submit your vote securely online.",
      icon: "🗳️",
    },
    {
      title: "Current Status",
      description: "Check the status of ongoing elections.",
      icon: "📊",
    },
    {
      title: "Results",
      description: "View election results in real-time.",
      icon: "🏆",
    },
  ];

  const navigate = useNavigate();

  const handleClick = (feature) => {
    if (feature === "Cast Vote") {
      navigate("/cast-vote");
    } else if (feature === "Current Status") {
      navigate("/current-status");
    } else {
      navigate("/results");
    }
  };

  return (
    <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 py-8">
      {features.map((feature, index) => (
        <div
          key={index}
          onClick={() => handleClick(feature.title)}
          className="bg-white shadow-lg rounded-lg p-8 text-center border hover:shadow-2xl transition-transform transform hover:scale-105 cursor-pointer"
        >
          <div className="text-5xl mb-6">{feature.icon}</div>
          <h2 className="text-2xl font-bold text-blue-600 mb-4">
            {feature.title}
          </h2>
          <p className="text-gray-600">{feature.description}</p>
        </div>
      ))}
    </div>
  );
};

export default Cards;
