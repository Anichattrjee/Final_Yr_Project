import React from "react";

const ImpactStories = () => {
  const impactStories = [
    {
      title: "Board Decisions",
      description:
        "Conduct confidential voting for strategic boardroom resolutions with full transparency and security.",
      image: "https://img.freepik.com/free-vector/team-business-meeting_23-2147585784.jpg",
    },
    {
      title: "Employee Committees",
      description:
        "Run smooth and secure elections for internal groups such as finance or committee boards.",
      image: "https://blogimage.vantagecircle.com/content/images/2023/02/employee--engagement-committee.png",
    },
    {
      title: "Stakeholder Polls",
      description:
        "Gather and analyze structured votes from key stakeholders to guide corporate initiatives and decisions.",
      image: "https://img.lovepik.com/free-png/20210927/lovepik-office-meeting-scene-business-illustration-png-image_401534187_wh1200.png",
    },
  ];

  return (
    <section className="py-12 bg-gray-100">
      <h2 className="text-center text-3xl font-bold text-blue-600 mb-8">
        Real-World Applications of Our Voting System
      </h2>
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        {impactStories.map((story, index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-lg shadow-lg text-center"
          >
            <div className="mb-4">
              <img
                src={story.image}
                alt={story.title}
                className="w-full h-48 object-cover rounded-lg"
              />
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-4">{story.title}</h3>
            <p className="text-gray-700">{story.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ImpactStories;
