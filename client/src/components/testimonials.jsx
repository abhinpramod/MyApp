import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import axiosInstance from "../lib/axios";
import { useEffect, useState } from "react";

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const fetchTestimonials = async () => {
    try {
      const response = await axiosInstance.get("/testimonials");
      setTestimonials(response.data);
    } catch (error) {
      console.error('Error fetching testimonials:', error);
    }
  }

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex + 4 >= testimonials.length ? 0 : prevIndex + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? Math.max(0, testimonials.length - 4) : prevIndex - 1
    );
  };

  // Get the subset of testimonials to display
  const visibleTestimonials = testimonials.slice(currentIndex, currentIndex + 4);

  return (
    <div className="bg-blue-100 py-10 relative overflow-hidden">
      <h2 className="text-3xl font-bold text-center mb-6">Testimonials</h2>
      
      <div className="relative max-w-6xl mx-auto">
        {/* Navigation arrows */}
        <button 
          onClick={prevSlide}
          className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-white p-2 rounded-full shadow-md hover:bg-gray-100"
        >
          <ChevronLeft size={24} />
        </button>
        
        <button 
          onClick={nextSlide}
          className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-white p-2 rounded-full shadow-md hover:bg-gray-100"
        >
          <ChevronRight size={24} />
        </button>

        <div className="flex justify-center gap-6 transition-transform duration-300">
          {visibleTestimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-white shadow-lg rounded-xl p-6 w-72 text-center flex-shrink-0"
            >
              <img
                src={testimonial.image}
                alt={testimonial.name}
                className="w-20 h-20 mx-auto rounded-full mb-4 object-cover"
              />
              <h3 className="text-lg font-bold">{testimonial.name}</h3>
              <p className="text-gray-600 text-sm mt-2">{testimonial.feedback}</p>
              <div className="flex justify-center mt-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} color="#fbbf24" fill="#fbbf24" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Indicator dots */}
      <div className="flex justify-center mt-6">
        {Array.from({ length: Math.ceil(testimonials.length / 4) }).map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index * 4)}
            className={`w-3 h-3 mx-1 rounded-full ${currentIndex === index * 4 ? 'bg-blue-600' : 'bg-gray-300'}`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}