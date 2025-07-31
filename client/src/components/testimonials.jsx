import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";
import axiosInstance from "../lib/axios";
import { useEffect, useState, useCallback, useRef } from "react";

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const [slidesToShow, setSlidesToShow] = useState(3);
  const carouselRef = useRef(null);
  const autoPlayInterval = useRef(null);

  const fetchTestimonials = async () => {
    try {
      const response = await axiosInstance.get("/testimonials");
      setTestimonials(response.data);
    } catch (error) {
      console.error('Error fetching testimonials:', error);
    }
  };

  // Handle responsiveness
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setSlidesToShow(1);
      } else if (window.innerWidth < 768) {
        setSlidesToShow(2);
      } else if (window.innerWidth < 1024) {
        setSlidesToShow(2);
      } else {
        setSlidesToShow(3);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    fetchTestimonials();
  }, []);

  // Auto-rotation effect
  useEffect(() => {
    const startAutoPlay = () => {
      autoPlayInterval.current = setInterval(() => {
        nextSlide();
      }, 5000);
    };

    const stopAutoPlay = () => {
      if (autoPlayInterval.current) {
        clearInterval(autoPlayInterval.current);
        autoPlayInterval.current = null;
      }
    };
    
    startAutoPlay();
    
    // Pause on hover
    const carousel = carouselRef.current;
    if (carousel) {
      carousel.addEventListener('mouseenter', stopAutoPlay);
      carousel.addEventListener('mouseleave', startAutoPlay);
    }
    
    return () => {
      stopAutoPlay();
      if (carousel) {
        carousel.removeEventListener('mouseenter', stopAutoPlay);
        carousel.removeEventListener('mouseleave', startAutoPlay);
      }
    };
  }, [testimonials.length, slidesToShow]);

  const nextSlide = useCallback(() => {
    setCurrentIndex(prevIndex => {
      if (prevIndex + slidesToShow >= testimonials.length) {
        return 0;
      }
      return prevIndex + 1;
    });
  }, [testimonials.length, slidesToShow]);

  const prevSlide = useCallback(() => {
    setCurrentIndex(prevIndex => {
      if (prevIndex === 0) {
        return Math.max(0, testimonials.length - slidesToShow);
      }
      return prevIndex - 1;
    });
  }, [testimonials.length, slidesToShow]);

  const goToSlide = (index) => {
    setCurrentIndex(index * slidesToShow);
  };

  // Touch event handlers for swipe gestures
  const handleTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 50) {
      nextSlide();
    }

    if (touchStart - touchEnd < -50) {
      prevSlide();
    }
  };

  // Calculate visible testimonials with padding for smooth animation
  const getVisibleTestimonials = () => {
    const endIndex = currentIndex + slidesToShow;
    if (endIndex > testimonials.length) {
      return [
        ...testimonials.slice(currentIndex),
        ...testimonials.slice(0, endIndex - testimonials.length)
      ];
    }
    return testimonials.slice(currentIndex, endIndex);
  };

  const visibleTestimonials = getVisibleTestimonials();

  return (
    <div className="py-16 bg-gradient-to-br from-blue-50 to-indigo-100 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
      <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-0 left-1/2 w-64 h-64 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      
      <div className="relative z-10 max-w-6xl mx-auto px-4 md:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">What Our Customers Say</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">Don't just take our word for it - hear from our satisfied customers</p>
        </div>

        <div 
          ref={carouselRef}
          className="relative"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Navigation arrows */}
          <button 
            onClick={prevSlide}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-white p-3 rounded-full shadow-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 hover:scale-105 -ml-4"
            aria-label="Previous testimonial"
          >
            <ChevronLeft size={24} className="text-gray-700" />
          </button>
          
          <button 
            onClick={nextSlide}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-white p-3 rounded-full shadow-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 hover:scale-105 -mr-4"
            aria-label="Next testimonial"
          >
            <ChevronRight size={24} className="text-gray-700" />
          </button>
          
          <div className="flex justify-center gap-6 transition-transform duration-500 ease-in-out">
            {visibleTestimonials.map((testimonial, index) => (
              <div
                key={`${testimonial.id || index}-${currentIndex}`}
                className={`bg-white rounded-2xl shadow-lg p-6 ${
                  slidesToShow === 1 ? 'w-full max-w-md' : 
                  slidesToShow === 2 ? 'w-80' : 
                  'w-80'
                } flex-shrink-0 transform transition-all duration-300 hover:shadow-xl hover:-translate-y-2 relative overflow-hidden`}
              >
                {/* Quote mark decoration */}
                <div className="absolute top-4 right-4 text-blue-100">
                  <Quote size={48} fill="currentColor" />
                </div>
                
                <div className="relative z-10">
                  <div className="flex items-center mb-4">
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-16 h-16 rounded-full object-cover border-2 border-blue-100"
                      loading="lazy"
                    />
                    <div className="ml-4">
                      <h3 className="text-lg font-bold text-gray-800">{testimonial.name}</h3>
                      <p className="text-gray-500 text-sm">{testimonial.position || "Customer"}</p>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 mb-6 line-clamp-4">{testimonial.feedback}</p>
                  
                  <div className="flex justify-center">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={18} color="#fbbf24" fill="#fbbf24" className="mx-0.5" />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Indicator dots */}
        {testimonials.length > 0 && (
          <div className="flex justify-center mt-8 space-x-2">
            {Array.from({ length: Math.ceil(testimonials.length / slidesToShow) }).map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  currentIndex >= index * slidesToShow && 
                  currentIndex < (index + 1) * slidesToShow ? 
                  'bg-blue-600 w-8' : 'bg-gray-300'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
      
      <style jsx>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}