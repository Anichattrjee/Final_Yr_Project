import React, { useState, useEffect } from "react";

const Carousel = () => {
  const images = [
    "../../image1.jpg",
    "../../image2.jpg",
    "https://via.placeholder.com/800x300?text=Vote+For+A+Better+Tomorrow",
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000); // Rotate every 5 seconds

    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div className="relative w-full h-[70vh] overflow-hidden">
      <div
        className="flex transition-transform duration-700 ease-in-out"
        style={{
          transform: `translateX(-${currentIndex * 100}%)`,
          width: `${images.length * 100}%`, // Ensures proper width for all images
        }}
      >
        {images.map((src, index) => (
          <div
            key={index}
            className="w-full h-[70vh] flex-shrink-0" // Ensures each slide takes full width
          >
            <img
              src={src}
              alt={`Slide ${index + 1}`}
              className="w-full h-full object-scale-down"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Carousel;
