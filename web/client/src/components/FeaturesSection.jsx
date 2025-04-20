import React from "react";

const FeaturesSection = () => {
  const features = [
    {
      title: "Secure Voting",
      description: "Robust authentication and encryption designed for corporate confidentiality.",
      icon: "🔐",
    },
    {
      title: "Intuitive Interface",
      description: "A streamlined experience built for clarity and efficiency.",
      icon: "🖥️",
    },
    {
      title: "Transparent Results",
      description: "Real-time, verifiable results for informed decision-making.",
      icon: "📊",
    },
    {
      title: "Data-Driven Insights",
      description: "Comprehensive post-election analytics to support strategy and governance.",
      icon: "📈",
    },
  ];

  return (
    <section className="py-12 bg-blue-50">
      <h2 className="text-center text-3xl font-bold text-blue-600 mb-6">
        Key Capabilities
      </h2>
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 px-4">
        {features.map((feature, index) => (
          <div
            key={index}
            className="flex flex-col items-center text-center bg-white shadow-md p-6 rounded-2xl hover:shadow-lg transition-shadow"
          >
            <div className="text-5xl mb-3">{feature.icon}</div>
            <h3 className="text-xl font-medium text-gray-800 mb-1">
              {feature.title}
            </h3>
            <p className="text-gray-600 text-sm">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FeaturesSection;
