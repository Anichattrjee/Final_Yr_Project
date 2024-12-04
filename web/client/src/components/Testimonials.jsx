import React from "react";

const Testimonials = () => {
  const testimonials = [
    {
      name: "John Doe",
      quote: "This platform made voting so much easier and secure!",
      image: "https://via.placeholder.com/150",
    },
    {
      name: "Jane Smith",
      quote: "I love the real-time updates and smooth interface.",
      image: "https://via.placeholder.com/150",
    },
    {
      name: "Alice Johnson",
      quote: "The best voting system I've ever used. Highly recommend!",
      image: "https://via.placeholder.com/150",
    },
  ];

  return (
    <section className="py-12 bg-gray-100">
      <h2 className="text-center text-3xl font-bold text-blue-600 mb-8">
        What Our Users Say
      </h2>
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        {testimonials.map((testimonial, index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-lg shadow-lg text-center"
          >
            <img
              src={testimonial.image}
              alt={testimonial.name}
              className="w-20 h-20 mx-auto rounded-full mb-4"
            />
            <p className="text-gray-700 italic mb-4">"{testimonial.quote}"</p>
            <h3 className="text-lg font-bold">{testimonial.name}</h3>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Testimonials;
