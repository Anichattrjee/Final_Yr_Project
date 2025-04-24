import React from 'react';
import { Link } from 'react-router-dom';
import { FaGithub, FaLinkedin, FaUniversity } from 'react-icons/fa';

const AboutUs = () => {
  const teamMembers = [
    {
      name: "Team Member 1",
      role: "Full Stack Developer",
      photo: "/placeholder-member1.jpg",
      linkedin: "#",
      github: "#"
    },
    {
      name: "Team Member 2",
      role: "Frontend Specialist",
      photo: "/placeholder-member2.jpg",
      linkedin: "#",
      github: "#"
    },
    {
      name: "Team Member 3",
      role: "Backend Engineer",
      photo: "/placeholder-member3.jpg",
      linkedin: "#",
      github: "#"
    },
    // Add more team members as needed
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100">
      {/* Hero Section */}
      <section className="text-center py-16 bg-blue-600 text-white">
        <h1 className="text-4xl font-bold mb-4">About Voting System</h1>
        <p className="text-xl max-w-2xl mx-auto px-4">
          Revolutionizing digital democracy through secure and accessible voting solutions
        </p>
      </section>

      {/* Team Section */}
      <section className="py-16 px-4 max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12 text-blue-800">Our Team</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {teamMembers.map((member, index) => (
            <div key={index} className="bg-white rounded-xl shadow-lg p-6 transform transition hover:scale-105">
              <img 
                src={member.photo} 
                alt={member.name}
                className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
              />
              <h3 className="text-xl font-semibold text-center mb-2">{member.name}</h3>
              <p className="text-gray-600 text-center mb-4">{member.role}</p>
              <div className="flex justify-center space-x-4">
                <a href={member.linkedin} className="text-blue-600 hover:text-blue-800">
                  <FaLinkedin size={24} />
                </a>
                <a href={member.github} className="text-gray-600 hover:text-gray-800">
                  <FaGithub size={24} />
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Institute Section */}
      <section className="bg-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <FaUniversity className="text-5xl text-blue-600 mx-auto mb-6" />
          <h2 className="text-3xl font-bold mb-4 text-blue-800">
            Heritage Institute of Technology
          </h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Proudly developed by students of Heritage Institute of Technology, Kolkata - 
            A premier technical institution committed to fostering innovation and excellence in technology.
          </p>
          <a 
            href="https://www.heritageit.edu/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition"
          >
            Visit College Website
          </a>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 px-4 bg-blue-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-blue-800">Our Mission</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-md">
              <h3 className="text-xl font-semibold mb-4">Why We Built This</h3>
              <p className="text-gray-600">
                As Engineering students passionate about social impact, we recognized the need for 
                modern voting solutions that combine security, accessibility, and transparency. Our 
                platform aims to bridge the gap between traditional voting systems and modern technology.
              </p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-md">
              <h3 className="text-xl font-semibold mb-4">Future Vision</h3>
              <p className="text-gray-600">
                We aim to expand our platform to support various voting scenarios while maintaining 
                the highest security standards. Our roadmap includes blockchain integration, 
                biometric authentication, and AI-powered fraud detection systems.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-blue-800 text-white py-8 text-center">
        <p className="mb-4">
          Made with ❤️ by Students of Heritage Institute of Technology
        </p>
        <p className="text-sm text-blue-200">
          © 2024 Voting System. All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default AboutUs;