import React from "react";

const Cards = () => {
  const features = [
    { title: "Cast Vote", description: "Submit your vote securely online.", icon: "🗳️" },
    { title: "Current Status", description: "Check the status of ongoing elections.", icon: "📊" },
    { title: "Results", description: "View election results in real-time.", icon: "🏆" },
  ];

  return (
    <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 py-8">
      {features.map((feature, index) => (
        <div
          key={index}
          className="bg-white shadow-lg rounded-lg p-6 text-center border hover:shadow-2xl"
        >
          <div className="text-4xl mb-4">{feature.icon}</div>
          <h2 className="text-xl font-bold mb-2">{feature.title}</h2>
          <p className="text-gray-600">{feature.description}</p>
        </div>
      ))}
    </div>
  );
};

export default Cards;
