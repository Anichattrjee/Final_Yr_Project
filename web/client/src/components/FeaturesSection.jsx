import React from "react";

const FeaturesSection = () => {
  const features = [
    {
      title: "Secure Voting",
      description: "State-of-the-art encryption ensures your vote is safe.",
      icon: "🔒",
    },
    {
      title: "User-Friendly Interface",
      description: "Designed for accessibility and ease of use.",
      icon: "💡",
    },
    {
      title: "Real-Time Updates",
      description: "Get instant notifications on election progress.",
      icon: "⚡",
    },
  ];

  return (
    <section className="py-12 bg-blue-50">
      <h2 className="text-center text-3xl font-bold text-blue-600 mb-6">
        Why Choose Us?
      </h2>
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {features.map((feature, index) => (
          <div
            key={index}
            className="flex flex-col items-center text-center bg-white shadow-md p-6 rounded-lg hover:shadow-lg transition-shadow"
          >
            <div className="text-6xl mb-4">{feature.icon}</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              {feature.title}
            </h3>
            <p className="text-gray-600">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FeaturesSection;
