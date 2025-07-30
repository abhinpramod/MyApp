import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";
import axiosInstance from "../lib/axios";
import { useEffect, useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

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

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  return (
    <div className="relative bg-gradient-to-br from-blue-50 via-white to-purple-50 py-20 overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-gradient-to-br from-blue-200/20 to-purple-200/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-purple-200/20 to-pink-200/20 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
      
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%236366f1' fill-opacity='0.1'%3E%3Cpath d='m0 40l40-40h-40v40zm40 0v-40h-40l40 40z'/%3E%3C/g%3E%3C/svg%3E")`,
        }}></div>
      </div>

      <div className="relative z-10">
        {/* Header Section */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="text-center mb-16"
        >
          <motion.div
            variants={fadeInUp}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-100 to-purple-100 px-6 py-3 rounded-full mb-6"
          >
            <Quote size={20} className="text-blue-600" />
            <span className="text-blue-800 font-semibold">What Our Clients Say</span>
          </motion.div>
          
          <motion.h2 
            variants={fadeInUp}
            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent"
          >
            Testimonials
          </motion.h2>
          
          <motion.p 
            variants={fadeInUp}
            className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed"
          >
            Discover what our satisfied customers have to say about their experience with our services
          </motion.p>
        </motion.div>
        
        <div 
          ref={carouselRef}
          className="relative max-w-7xl mx-auto px-4 md:px-8"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Navigation arrows */}
          <motion.button 
            onClick={prevSlide}
            whileHover={{ scale: 1.1, x: -2 }}
            whileTap={{ scale: 0.95 }}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-white p-4 rounded-full shadow-xl hover:shadow-2xl border border-gray-200 hover:border-blue-300 focus:outline-none focus:ring-4 focus:ring-blue-100 transition-all duration-300 group"
            aria-label="Previous testimonial"
          >
            <ChevronLeft size={24} className="text-gray-600 group-hover:text-blue-600 transition-colors duration-300" />
          </motion.button>
          
          <motion.button 
            onClick={nextSlide}
            whileHover={{ scale: 1.1, x: 2 }}
            whileTap={{ scale: 0.95 }}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-white p-4 rounded-full shadow-xl hover:shadow-2xl border border-gray-200 hover:border-blue-300 focus:outline-none focus:ring-4 focus:ring-blue-100 transition-all duration-300 group"
            aria-label="Next testimonial"
          >
            <ChevronRight size={24} className="text-gray-600 group-hover:text-blue-600 transition-colors duration-300" />
          </motion.button>

          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="flex justify-center gap-6 lg:gap-8 transition-transform duration-500 ease-in-out"
          >
            <AnimatePresence mode="wait">
              {visibleTestimonials.map((testimonial, index) => (
                <motion.div
                  key={`${testimonial.id || index}-${currentIndex}`}
                  variants={fadeInUp}
                  initial={{ opacity: 0, y: 20, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -20, scale: 0.9 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className={`bg-white shadow-xl rounded-3xl p-8 ${
                    slidesToShow === 1 ? 'w-full max-w-md' : 
                    slidesToShow === 2 ? 'w-80' : 
                    slidesToShow === 3 ? 'w-72' : 'w-64'
                  } text-center flex-shrink-0 transform transition-all duration-500 hover:scale-105 hover:shadow-2xl border border-gray-100 hover:border-blue-200 relative overflow-hidden group`}
                >
                  {/* Background Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-purple-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl"></div>
                  
                  {/* Quote Icon */}
                  <div className="absolute top-4 right-4 text-blue-200 group-hover:text-blue-300 transition-colors duration-300">
                    <Quote size={24} />
                  </div>
                  
                  <div className="relative z-10">
                    {/* Profile Image */}
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ duration: 0.3 }}
                      className="relative mx-auto mb-6"
                    >
                      <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-blue-400 to-purple-500 p-1 shadow-lg">
                        <img
                          src={testimonial.image}
                          alt={testimonial.name}
                          className="w-full h-full rounded-full object-cover"
                          loading="lazy"
                        />
                      </div>
                      {/* Decorative ring */}
                      <div className="absolute inset-0 rounded-full border-2 border-blue-200 animate-pulse"></div>
                    </motion.div>

                    {/* Name */}
                    <motion.h3 
                      whileHover={{ scale: 1.05 }}
                      className="text-xl font-bold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors duration-300"
                    >
                      {testimonial.name}
                    </motion.h3>

                    {/* Feedback */}
                    <p className="text-gray-600 text-sm leading-relaxed mb-6 line-clamp-3 group-hover:text-gray-700 transition-colors duration-300">
                      "{testimonial.feedback}"
                    </p>

                    {/* Star Rating */}
                    <div className="flex justify-center mb-4 gap-1">
                      {[...Array(5)].map((_, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: i * 0.1, duration: 0.3 }}
                          whileHover={{ scale: 1.2 }}
                        >
                          <Star 
                            size={18} 
                            className="text-yellow-400 fill-yellow-400 drop-shadow-sm" 
                          />
                        </motion.div>
                      ))}
                    </div>

                    {/* Rating Text */}
                    <div className="text-xs text-gray-500 font-medium">
                      Excellent Service
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* Indicator dots */}
        {testimonials.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className="flex justify-center mt-12 gap-3"
          >
            {Array.from({ length: Math.ceil(testimonials.length / slidesToShow) }).map((_, index) => (
              <motion.button
                key={index}
                onClick={() => goToSlide(index)}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                className={`h-3 rounded-full transition-all duration-300 ${
                  currentIndex >= index * slidesToShow && 
                  currentIndex < (index + 1) * slidesToShow ? 
                  'bg-gradient-to-r from-blue-500 to-purple-600 w-8 shadow-lg' : 
                  'bg-gray-300 hover:bg-gray-400 w-3'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </motion.div>
        )}

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="text-center mt-16"
        >
          <motion.button
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-full font-semibold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 border border-blue-400 hover:border-purple-400"
          >
            Share Your Experience
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}