import React from "react";

const Carousel = () => {
  const images = [
    "https://via.placeholder.com/800x300?text=Make+Your+Vote+Count",
    "https://via.placeholder.com/800x300?text=Every+Vote+Matters",
    "https://via.placeholder.com/800x300?text=Vote+For+A+Better+Tomorrow",
  ];

  return (
    <div className="w-full overflow-hidden">
      <div className="flex animate-slide">
        {images.map((src, index) => (
          <img
            key={index}
            src={src}
            alt={`Slide ${index + 1}`}
            className="w-full"
          />
        ))}
      </div>
    </div>
  );
};

export default Carousel;
