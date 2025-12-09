import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../lib/axios";
import Navbar from "../components/Navbar";
import Footer from "../components/footer";
import Testimonials from "../components/testimonials";
import { LucideUser, LucideMapPin, LucideSearch, LucideArrowRight } from "lucide-react";
import { motion } from "framer-motion";

// Import Swiper styles and components
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Navigation, Pagination, Autoplay } from "swiper/modules";

export default function LandingPage() {
  const navigate = useNavigate();
  const [service, setService] = useState([]);
  const [searchTerm, setSearchTerm] = useState(""); 

  const fetchServices = async () => {
    try {
      const response = await axiosInstance.get("/user/Jobtypes");
      setService(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/contractors?search=${searchTerm.trim()}`);
    } else {
      navigate("/contractors");
    }
  };

  const fadeIn = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, delay: 0.2 } },
  };

  const scaleUp = {
    hidden: { scale: 0.9, opacity: 0 },
    visible: { scale: 1, opacity: 1, transition: { duration: 0.6, delay: 0.4 } },
  };

  // Improved custom styles for Swiper navigation/pagination color consistency
  const customStyles = `
    .swiper-button-next, .swiper-button-prev { 
      color: #0d9488; /* Teal-600 */
      top: 50%;
      transform: translateY(-50%);
      transition: opacity 0.3s;
    } 
    .swiper-button-next:hover, .swiper-button-prev:hover {
        opacity: 0.7;
    }
    .swiper-button-next::after, .swiper-button-prev::after { 
      font-size: 1.5rem; 
      font-weight: bold;
    } 
    .swiper-pagination-bullet { 
      width: 10px;
      height: 10px; 
      background-color: rgba(0, 0, 0, 0.3); 
      opacity: 1; 
    } 
    .swiper-pagination-bullet-active { 
      background-color: #0d9488; /* Teal-600 for active state */
    } 
    @media (max-width: 640px) { 
      .swiper-button-next, .swiper-button-prev {
          display: none !important;
      }
      .swiper-pagination-bullet { 
        width: 8px; 
        height: 8px; 
      } 
    }
  `;

  return (
    <>
      <style>{customStyles}</style>
      <Navbar />
      <div className="min-h-screen w-full flex flex-col mt-16">
        
        {/* === HERO SECTION with Integrated Search - TEAL/CYAN BACKGROUND === */}
        <div className="relative bg-gradient-to-br from-white to-teal-50 py-16 md:py-24 overflow-hidden">
          <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
          <div className="container mx-auto px-4 md:px-8 relative z-10">
            <motion.section
              initial="hidden"
              animate="visible"
              variants={fadeIn}
              className="flex flex-col md:flex-row items-center justify-between gap-12"
            >
              {/* Text and Search Input */}
              <motion.div className="md:w-3/5 lg:w-1/2 text-center md:text-left order-2 md:order-1">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-4 text-gray-900 leading-tight">
                  Your Vision, Our <span className="text-teal-700">Skilled Professionals</span>
                </h1>
                <p className="text-gray-600 text-lg md:text-xl mb-8 max-w-2xl mx-auto md:mx-0">
                  Find trusted contractors and quality materials for any construction or home improvement task.
                </p>

                {/* Primary CTA: Search Bar (Uses Accent Color: Orange) */}
                <form onSubmit={handleSearch} className="mb-8 relative max-w-lg mx-auto md:mx-0 shadow-xl rounded-xl">
                  <div className="flex items-center bg-white rounded-xl p-2 border border-teal-200">
                    <LucideSearch className="text-gray-400 ml-3" size={20} />
                    <input
                      type="text"
                      placeholder="What service do you need? (e.g., Electrician, Plumber)"
                      className="flex-grow p-3 text-gray-700 focus:outline-none placeholder-gray-400 bg-transparent"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <button
                      type="submit"
                      className="flex-shrink-0 px-6 py-3 bg-orange-500 text-white font-semibold rounded-lg hover:bg-orange-600 transition-colors duration-300"
                    >
                      Search
                    </button>
                  </div>
                </form>

                {/* Secondary CTAs below search (Uses Primary Color: Teal) */}
                <div className="flex flex-col sm:flex-row justify-center md:justify-start gap-4">
                  <button
                    onClick={() => navigate("/contractors")}
                    className="flex items-center justify-center px-6 py-2 border-b-2 border-teal-600 text-teal-600 font-medium hover:text-teal-700 transition-colors duration-300"
                  >
                    Browse All Services <LucideArrowRight className="ml-2 w-4 h-4" />
                  </button>
                  <button
                    onClick={() => navigate("/stores")}
                    className="flex items-center justify-center px-6 py-2 border-b-2 border-gray-400 text-gray-600 font-medium hover:text-gray-800 transition-colors duration-300"
                  >
                    Find Materials <LucideArrowRight className="ml-2 w-4 h-4" />
                  </button>
                </div>
              </motion.div>

              {/* Decorative Image */}
              <motion.div 
                className="md:w-2/5 lg:w-1/3 flex justify-center order-1 md:order-2 mb-8 md:mb-0"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7, delay: 0.4 }}
              >
                <div className="relative p-4 bg-white rounded-3xl shadow-2xl">
                  <div className="absolute -inset-4 bg-teal-200 rounded-3xl blur-xl opacity-50 animate-pulse"></div>
                  <img
                    src="/coverpic.user.jpeg"
                    alt="Trusted Help for Tasks"
                    className="w-full max-w-sm rounded-2xl relative z-10 border-4 border-white"
                    style={{ aspectRatio: '4/3', objectFit: 'cover' }}
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              </motion.div>
            </motion.section>
          </div>
        </div>

        {/* === STATS SECTION - DEEP TEAL BACKGROUND === */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          className="grid grid-cols-2 md:grid-cols-5 gap-0 bg-teal-800 text-white py-8 md:py-10 px-4 md:px-8 w-full shadow-inner"
        >
          {[
            "250+ Contractors",
            "200+ Shops",
            "5000+ Customers",
            "2000+ Labours",
            "99% Success"
          ].map((stat, idx) => (
            <motion.div
              key={idx}
              whileHover={{ backgroundColor: '#0f766e', scale: 1.05 }} /* Slightly darker teal hover */
              transition={{ duration: 0.3 }}
              className="flex flex-col items-center justify-center p-4 md:p-6 bg-transparent border-r border-white border-opacity-20 last:border-r-0"
            >
              <div className="text-3xl md:text-4xl font-extrabold mb-1">{stat.split('+')[0]}{stat.includes('%') ? '%' : '+'}</div>
              <div className="text-xs md:text-sm text-center font-light opacity-90">{stat.split('+')[1] ? stat.split('+')[1].trim() : stat.split('%')[1]}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* === INFO/HOW IT WORKS SECTION (Refined Card Styling) === */}
        <div className="container mx-auto px-4 md:px-8 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Your Project, Simplified</h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">Find the right professionals and materials for your project in just a few simple steps</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Find Contractors Card (Teal focus) */}
            <motion.div
              onClick={() => navigate("/contractors")}
              variants={scaleUp}
              initial="hidden"
              animate="visible"
              whileHover={{ y: -5, scale: 1.01 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              className="bg-white rounded-2xl shadow-xl overflow-hidden cursor-pointer border-t-4 border-teal-600 transition-all duration-300"
            >
              <div className="p-8">
                <div className="w-16 h-16 rounded-full bg-teal-50 flex items-center justify-center mb-6 shadow-inner">
                  <LucideUser className="text-teal-600" size={32} />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-gray-800">1. Hire Contractors</h3>
                <p className="text-gray-600 mb-6">
                  Browse profiles of certified professionals, view their past work, read reviews, and get direct quotes for your project.
                </p>
                <div className="text-teal-600 font-semibold flex items-center hover:underline">
                  Explore Contractors
                  <LucideArrowRight className="ml-2 w-5 h-5" />
                </div>
              </div>
            </motion.div>
            
            {/* Material Stores Card (Green focus for distinction) */}
            <motion.div
              onClick={() => navigate("/stores")}
              variants={scaleUp}
              initial="hidden"
              animate="visible"
              whileHover={{ y: -5, scale: 1.01 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              className="bg-white rounded-2xl shadow-xl overflow-hidden cursor-pointer border-t-4 border-green-600 transition-all duration-300"
            >
              <div className="p-8">
                <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center mb-6 shadow-inner">
                  <LucideMapPin className="text-green-600" size={32} />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-gray-800">2. Find Materials</h3>
                <p className="text-gray-600 mb-6">
                  Easily locate material stores near you, compare prices, and order all the top-quality supplies needed for construction.
                </p>
                <div className="text-green-600 font-semibold flex items-center hover:underline">
                  Browse Stores
                  <LucideArrowRight className="ml-2 w-5 h-5" />
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* === SERVICES SECTION (Improved Card Layout) === */}
        <motion.section
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          className="py-16 bg-gray-50"
        >
          <div className="container mx-auto px-4 md:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Popular Services</h2>
              <p className="text-gray-600 max-w-2xl mx-auto text-lg">Explore the most in-demand professional services in your area</p>
            </div>
            
            <Swiper
              modules={[Navigation, Pagination, Autoplay]}
              spaceBetween={20}
              slidesPerView={1}
              navigation
              pagination={{ clickable: true }}
              autoplay={{ delay: 3500, disableOnInteraction: false }}
              breakpoints={{
                640: { slidesPerView: 2, spaceBetween: 20 },
                1024: { slidesPerView: 4, spaceBetween: 24 },
              }}
              className="w-full pb-12"
            >
              {service &&
                service.slice(0, 8).map((service) => (
                  <SwiperSlide key={service._id} className="h-full">
                    <motion.div
                      whileHover={{ y: -5, boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)' }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden bg-white rounded-xl shadow-lg cursor-pointer h-full flex flex-col border border-gray-100 transform"
                      onClick={() => navigate(`/contractors/${service.name}`)}
                    >
                      <div className="relative h-40 md:h-48 overflow-hidden">
                        <img
                          src={service.image}
                          alt={service.name}
                          className="w-full h-full object-cover transition-transform duration-500 hover:scale-110" 
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-20"></div>
                      </div>
                      <div className="p-4 md:p-5 flex-grow flex flex-col justify-between">
                        <h3 className="text-lg font-bold text-gray-900 mb-2">{service.name}</h3>
                        <p className="text-gray-500 text-sm mb-4 flex-grow line-clamp-2">
                          Find experienced professionals for all your {service.name.toLowerCase()} needs.
                        </p>
                        <button className="text-teal-600 font-medium text-sm flex items-center self-start hover:underline">
                          View Professionals
                          <LucideArrowRight className="ml-2 w-4 h-4" />
                        </button>
                      </div>
                    </motion.div>
                  </SwiperSlide>
                ))}
            </Swiper>
            {/* View All Services Button (Uses Primary Color: Teal) */}
            <div className="text-center mt-8">
              <button
                onClick={() => navigate("/contractors")}
                className="px-8 py-3 bg-teal-600 text-white font-semibold rounded-lg shadow-lg hover:bg-teal-700 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl"
              >
                View All Services
              </button>
            </div>
          </div>
        </motion.section>

        {/* === FINAL CTA SECTION - DEEP CYAN BACKGROUND === */}
        <div className="py-20 bg-cyan-900">
          <div className="container mx-auto px-4 md:px-8 text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Start Your Project Today</h2>
            <p className="text-cyan-200 text-xl max-w-3xl mx-auto mb-10 font-light">
              Connect with vetted professionals and source quality materials instantly.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              {/* Primary CTA Button (Uses Accent Color: Orange) */}
              <button
                onClick={() => navigate("/contractors")}
                className="px-10 py-4 bg-orange-500 text-cyan-900 font-bold text-lg rounded-xl shadow-2xl hover:bg-orange-600 transition-all duration-300 transform hover:-translate-y-1"
              >
                Get Started Now
              </button>
              {/* Secondary CTA Button (White outline for contrast) */}
              <button
                onClick={() => navigate("/about")}
                className="px-10 py-4 bg-transparent text-white font-semibold text-lg rounded-xl border-2 border-white hover:bg-white hover:bg-opacity-10 transition-all duration-300 transform hover:-translate-y-1"
              >
                How We Work
              </button>
            </div>
          </div>
        </div>
      </div>
      <Testimonials />
      <Footer />
    </>
  );
}