import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import axiosInstance from "../lib/axios";
import { useEffect, useState, useCallback, useRef } from "react";

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const [slidesToShow, setSlidesToShow] = useState(4);
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
        setSlidesToShow(3);
      } else {
        setSlidesToShow(4);
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
    <div className="bg-blue-100 py-10 relative overflow-hidden">
      <h2 className="text-3xl font-bold text-center mb-6">Testimonials</h2>
      
      <div 
        ref={carouselRef}
        className="relative max-w-6xl mx-auto px-10"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Navigation arrows */}
        <button 
          onClick={prevSlide}
          className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-white p-2 rounded-full shadow-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Previous testimonial"
        >
          <ChevronLeft size={24} />
        </button>
        
        <button 
          onClick={nextSlide}
          className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-white p-2 rounded-full shadow-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Next testimonial"
        >
          <ChevronRight size={24} />
        </button>

        <div className="flex justify-center gap-6 transition-transform duration-300 ease-in-out">
          {visibleTestimonials.map((testimonial, index) => (
            <div
              key={`${testimonial.id || index}-${currentIndex}`}
              className={`bg-white shadow-lg rounded-xl p-6 ${
                slidesToShow === 1 ? 'w-full' : 
                slidesToShow === 2 ? 'w-80' : 
                slidesToShow === 3 ? 'w-72' : 'w-64'
              } text-center flex-shrink-0 transform transition-all duration-300 hover:scale-105`}
            >
              <img
                src={testimonial.image}
                alt={testimonial.name}
                className="w-20 h-20 mx-auto rounded-full mb-4 object-cover"
                loading="lazy"
              />
              <h3 className="text-lg font-bold">{testimonial.name}</h3>
              <p className="text-gray-600 text-sm mt-2 line-clamp-3">{testimonial.feedback}</p>
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
      {testimonials.length > 0 && (
        <div className="flex justify-center mt-6">
          {Array.from({ length: Math.ceil(testimonials.length / slidesToShow) }).map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 mx-1 rounded-full transition-all duration-300 ${
                currentIndex >= index * slidesToShow && 
                currentIndex < (index + 1) * slidesToShow ? 
                'bg-blue-600 w-6' : 'bg-gray-300'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}