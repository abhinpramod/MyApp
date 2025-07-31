import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../lib/axios";
import Navbar from "../components/Navbar";
import Footer from "../components/footer";
import Testimonials from "../components/testimonials";
import { LucideUser, LucideMapPin, LucideSearch } from "lucide-react";
import { motion } from "framer-motion";
import Card from "../components/ui/card";
import CardContent from "../components/ui/card-content";

// Import Swiper styles and components
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Navigation, Pagination, Autoplay } from "swiper/modules";

export default function LandingPage() {
  const navigate = useNavigate();
  const [service, setService] = useState([]);

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

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  const scaleUp = {
    hidden: { scale: 0.9, opacity: 0 },
    visible: { scale: 1, opacity: 1, transition: { duration: 0.5 } },
  };

  const customStyles = `
    .swiper-button-next, .swiper-button-prev { 
      color: #0f4c81; 
    } 
    .swiper-button-next::after, .swiper-button-prev::after { 
      font-size: 1.5rem; 
    } 
    .swiper-pagination-bullet { 
      width: 8px; 
      height: 8px; 
      background-color: rgba(0, 0, 0, 0.3); 
      opacity: 1; 
    } 
    .swiper-pagination-bullet-active { 
      background-color: #0f4c81; 
    } 
    @media (max-width: 640px) { 
      .swiper-pagination-bullet { 
        width: 6px; 
        height: 6px; 
      } 
    }
  `;

  return (
    <>
      <style>{customStyles}</style>
      <Navbar />
      <div className="min-h-screen w-full flex flex-col mt-16">
        {/* Header Section with Gradient Background */}
        <div className="relative bg-gradient-to-r from-blue-50 to-indigo-100 py-16 md:py-24">
          <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
          <div className="container mx-auto px-4 md:px-8 relative z-10">
            <motion.section
              initial="hidden"
              animate="visible"
              variants={fadeIn}
              className="text-center mb-12 flex flex-col md:flex-row items-center justify-between gap-8"
            >
              <motion.div className="md:w-1/2 text-left">
                <h1 className="text-4xl md:text-6xl font-bold mb-6 text-gray-800 leading-tight">
                  Book Trusted <span className="text-blue-600">Help</span> for All Tasks
                </h1>
                <p className="text-gray-600 text-lg md:text-xl mb-8 max-w-2xl">
                  Your Vision, Our Commitment to Excellence
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    onClick={() => navigate("/contractors")}
                    className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-lg hover:bg-blue-700 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl"
                  >
                    Find Contractors
                  </button>
                  <button
                    onClick={() => navigate("/stores")}
                    className="px-8 py-3 bg-white text-blue-600 font-semibold rounded-lg shadow-lg border border-blue-200 hover:bg-blue-50 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl"
                  >
                    Browse Stores
                  </button>
                </div>
              </motion.div>
              <motion.div className="md:w-2/5 flex justify-center">
                <div className="relative">
                  <div className="absolute -inset-4 bg-blue-200 rounded-full blur-lg opacity-70 animate-pulse"></div>
                  <motion.img
                    src="/coverpic.user.jpeg"
                    alt="Construction"
                    className="w-full max-w-md rounded-2xl shadow-xl relative z-10"
                    whileHover={{ scale: 1.03 }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              </motion.div>
            </motion.section>
          </div>
        </div>
        {/* Stats Section with Enhanced Design */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          className="grid grid-cols-2 md:grid-cols-5 gap-4 bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-8 md:py-12 px-4 md:px-8 w-full shadow-lg"
        >
          {[
            "250+ Contractors",
            "200+ Shops",
            "5000+ Happy Customers",
            "2000+ Labours",
            "99% Satisfaction"
          ].map((stat, idx) => (
            <motion.div
              key={idx}
              whileHover={{ scale: 1.05, y: -5 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col items-center justify-center p-4 rounded-lg bg-white bg-opacity-10 backdrop-blur-sm"
            >
              <div className="text-2xl md:text-3xl font-bold mb-2">{stat.split('+')[0]}+</div>
              <div className="text-xs md:text-sm text-center">{stat.split('+')[1]}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Info Section with Enhanced Cards */}
        <div className="container mx-auto px-4 md:px-8 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">How It Works</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Find the right professionals and materials for your project in just a few simple steps</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div
              onClick={() => navigate("/contractors")}
              variants={scaleUp}
              initial="hidden"
              animate="visible"
              whileHover={{ y: -10, scale: 1.02 }}
              className="bg-white rounded-xl shadow-lg overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-xl border border-gray-100"
            >
              <div className="p-1 bg-gradient-to-r from-blue-500 to-indigo-600">
                <div className="bg-white p-6 md:p-8">
                  <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mb-6">
                    <LucideUser className="text-blue-600" size={32} />
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-gray-800">Find Contractors</h3>
                  <p className="text-gray-600 mb-6">
                    Hire experienced labor for your projects. Direct communication with contractors and get quotations easily.
                  </p>
                  <div className="text-blue-600 font-semibold flex items-center">
                    Explore Contractors
                    <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            </motion.div>
            
            <motion.div
              onClick={() => navigate("/stores")}
              variants={scaleUp}
              initial="hidden"
              animate="visible"
              whileHover={{ y: -10, scale: 1.02 }}
              className="bg-white rounded-xl shadow-lg overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-xl border border-gray-100"
            >
              <div className="p-1 bg-gradient-to-r from-green-500 to-teal-600">
                <div className="bg-white p-6 md:p-8">
                  <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-6">
                    <LucideMapPin className="text-green-600" size={32} />
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-gray-800">Material Stores</h3>
                  <p className="text-gray-600 mb-6">
                    Explore material stores offering top-quality building materials. Get everything you need for construction.
                  </p>
                  <div className="text-green-600 font-semibold flex items-center">
                    Browse Stores
                    <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Services Section with Enhanced Swiper Carousel */}
        <motion.section
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          className="py-16 bg-gradient-to-b from-gray-50 to-white"
        >
          <div className="container mx-auto px-4 md:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Our Services</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">Explore our wide range of professional services for all your construction needs</p>
            </div>
            
            <Swiper
              modules={[Navigation, Pagination, Autoplay]}
              spaceBetween={30}
              slidesPerView={1}
              navigation
              pagination={{ clickable: true }}
              autoplay={{ delay: 3000 }}
              breakpoints={{
                640: { slidesPerView: 2 },
                1024: { slidesPerView: 3 },
              }}
              className="w-full pb-12"
            >
              {service &&
                service.map((service) => (
                  <SwiperSlide key={service._id}>
                    <motion.div
                      whileHover={{ y: -10 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden bg-white rounded-xl shadow-lg cursor-pointer h-full flex flex-col border border-gray-100"
                      onClick={() => navigate(`/contractors/${service.name}`)}
                    >
                      <div className="relative h-48 overflow-hidden">
                        <img
                          src={service.image}
                          alt={service.name}
                          className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-40"></div>
                      </div>
                      <div className="p-6 flex-grow flex flex-col">
                        <h3 className="text-xl font-bold text-gray-800 mb-3">{service.name}</h3>
                        <p className="text-gray-600 mb-4 flex-grow">
                          Find experienced professionals for all your {service.name.toLowerCase()} needs
                        </p>
                        <button className="text-blue-600 font-semibold flex items-center self-start">
                          View Professionals
                          <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </button>
                      </div>
                    </motion.div>
                  </SwiperSlide>
                ))}
            </Swiper>
          </div>
        </motion.section>

        {/* CTA Section */}
        <div className="py-16 bg-gradient-to-r from-blue-600 to-indigo-700">
          <div className="container mx-auto px-4 md:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Ready to Start Your Project?</h2>
            <p className="text-blue-100 text-lg max-w-2xl mx-auto mb-8">Join thousands of satisfied customers who found the right professionals for their needs</p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button
                onClick={() => navigate("/contractors")}
                className="px-8 py-3 bg-white text-blue-600 font-semibold rounded-lg shadow-lg hover:bg-gray-100 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl"
              >
                Find a Professional
              </button>
              <button
                onClick={() => navigate("/about")}
                className="px-8 py-3 bg-transparent text-white font-semibold rounded-lg shadow-lg border border-white hover:bg-white hover:bg-opacity-10 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl"
              >
                Learn More
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