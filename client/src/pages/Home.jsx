import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../lib/axios";
import Navbar from "../components/Navbar";
import Footer from "../components/footer";
import Testimonials from "../components/testimonials";
import { LucideUser, LucideMapPin, LucideSearch, ArrowRight, CheckCircle, Star, Users, Building, Award } from "lucide-react";
import { motion } from "framer-motion";
import Card from "../components/ui/card";
import CardContent from "../components/ui/card-content";

// Import Swiper styles and components
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-cards";
import { Navigation, Pagination, Autoplay, EffectCards } from "swiper/modules";

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

  const fadeInUp = {
    hidden: { opacity: 0, y: 60 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { 
        duration: 0.8,
        ease: "easeOut"
      } 
    },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1
      }
    }
  };

  const scaleUp = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: { 
      scale: 1, 
      opacity: 1, 
      transition: { 
        duration: 0.6,
        ease: "easeOut"
      } 
    },
  };

  const customStyles = `
    .swiper-button-next, .swiper-button-prev {
      color: #3B82F6;
      background: rgba(255, 255, 255, 0.9);
      border-radius: 50%;
      width: 50px;
      height: 50px;
      margin-top: -25px;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
      transition: all 0.3s ease;
    }
    .swiper-button-next:hover, .swiper-button-prev:hover {
      background: rgba(255, 255, 255, 1);
      transform: scale(1.1);
    }
    .swiper-button-next::after, .swiper-button-prev::after {
      font-size: 1.2rem;
      font-weight: bold;
    }
    .swiper-pagination-bullet {
      width: 12px;
      height: 12px;
      background: linear-gradient(135deg, #3B82F6, #1D4ED8);
      opacity: 0.3;
      transition: all 0.3s ease;
    }
    .swiper-pagination-bullet-active {
      opacity: 1;
      transform: scale(1.2);
    }
    .hero-gradient {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }
    .service-card-hover {
      transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    }
    .service-card-hover:hover {
      transform: translateY(-10px) scale(1.02);
      box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15);
    }
    .glass-effect {
      backdrop-filter: blur(10px);
      background: rgba(255, 255, 255, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.2);
    }
  `;

  const stats = [
    { number: "250+", label: "Contractors", icon: Users },
    { number: "200+", label: "Shops", icon: Building },
    { number: "5000+", label: "Happy Customers", icon: Star },
    { number: "2000+", label: "Labours", icon: Users },
    { number: "90%", label: "Satisfaction", icon: Award },
  ];

  const features = [
    {
      title: "Find Contractors",
      description: "Hire experienced labor for your projects. Direct communication with contractors and get quotations easily.",
      icon: Users,
      gradient: "from-blue-500 to-blue-600",
      route: "/contractors"
    },
    {
      title: "Material Stores",
      description: "Explore material stores offering top-quality building materials. Get everything you need for construction.",
      icon: Building,
      gradient: "from-green-500 to-green-600",
      route: "/stores"
    }
  ];

  return (
    <>
      <style>{customStyles}</style>
      <Navbar />
      
      {/* Hero Section with Gradient Background */}
      <div className="min-h-screen w-full flex flex-col">
        <div className="hero-gradient pt-24 pb-16">
          <div className="container mx-auto px-4 md:px-8">
            <motion.section
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
              className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16"
            >
              {/* Image Section */}
              <motion.div
                variants={fadeInUp}
                className="lg:w-1/2 relative"
              >
                <div className="relative overflow-hidden rounded-3xl shadow-2xl">
                  <motion.img
                    src="/coverpic.user.jpeg"
                    alt="Construction"
                    className="w-full h-[400px] lg:h-[500px] object-cover"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.4 }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                </div>
                {/* Floating elements */}
                <motion.div 
                  className="absolute -top-6 -right-6 glass-effect rounded-2xl p-4 text-white"
                  animate={{ y: [-10, 10, -10] }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  <CheckCircle size={32} />
                </motion.div>
              </motion.div>

              {/* Content Section */}
              <motion.div 
                variants={fadeInUp}
                className="lg:w-1/2 text-center lg:text-left text-white"
              >
                <motion.h1 
                  variants={fadeInUp}
                  className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight"
                >
                  Book Trusted Help for{" "}
                  <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                    All Tasks
                  </span>
                </motion.h1>
                
                <motion.p 
                  variants={fadeInUp}
                  className="text-xl md:text-2xl mb-8 text-white/90 leading-relaxed"
                >
                  Your Vision, Our Commitment to Excellence
                </motion.p>

                <motion.div 
                  variants={fadeInUp}
                  className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-12"
                >
                  <button
                    onClick={() => navigate("/contractors")}
                    className="bg-white text-purple-600 px-8 py-4 rounded-full font-semibold text-lg hover:bg-gray-100 transition-all duration-300 flex items-center gap-2 justify-center shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    Get Started <ArrowRight size={20} />
                  </button>
                  <button
                    onClick={() => navigate("/about")}
                    className="border-2 border-white text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-white hover:text-purple-600 transition-all duration-300 flex items-center gap-2 justify-center"
                  >
                    Learn More
                  </button>
                </motion.div>

                {/* Feature Highlight Card */}
                <motion.div
                  variants={scaleUp}
                  className="glass-effect rounded-2xl p-6 lg:p-8 backdrop-blur-lg"
                >
                  <h3 className="text-2xl md:text-3xl font-bold mb-4 text-white">
                    India's First Local Skilled Labour Finding Application
                  </h3>
                  <p className="text-white/80 text-base md:text-lg leading-relaxed">
                    Local Skilled Labor is a platform connecting users with local skilled laborers, 
                    contractors, and material stores. Find trusted help easily!
                  </p>
                </motion.div>
              </motion.div>
            </motion.section>
          </div>
        </div>

        {/* Stats Section with Modern Design */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="bg-white py-16 shadow-lg"
        >
          <div className="container mx-auto px-4 md:px-8">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-6 lg:gap-8">
              {stats.map((stat, idx) => {
                const IconComponent = stat.icon;
                return (
                  <motion.div
                    key={idx}
                    variants={fadeInUp}
                    whileHover={{ scale: 1.05, y: -5 }}
                    className="text-center p-6 rounded-2xl bg-gradient-to-br from-gray-50 to-white shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <div className="bg-gradient-to-br from-blue-500 to-purple-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                      <IconComponent size={28} className="text-white" />
                    </div>
                    <div className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
                      {stat.number}
                    </div>
                    <div className="text-gray-600 font-medium text-sm md:text-base">
                      {stat.label}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </motion.div>

        {/* Features Section */}
        <div className="py-20 bg-gray-50">
          <div className="container mx-auto px-4 md:px-8">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
              className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12"
            >
              {features.map((feature, index) => {
                const IconComponent = feature.icon;
                return (
                  <motion.button
                    key={index}
                    onClick={() => navigate(feature.route)}
                    variants={fadeInUp}
                    whileHover={{ scale: 1.02, y: -5 }}
                    className={`p-8 lg:p-10 bg-gradient-to-br ${feature.gradient} text-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 text-left group`}
                  >
                    <div className="bg-white/20 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                      <IconComponent size={32} />
                    </div>
                    <h3 className="font-bold text-2xl lg:text-3xl mb-4 group-hover:text-yellow-200 transition-colors duration-300">
                      {feature.title}
                    </h3>
                    <p className="text-white/90 text-base lg:text-lg leading-relaxed mb-6">
                      {feature.description}
                    </p>
                    <div className="flex items-center gap-2 text-yellow-200 font-semibold group-hover:gap-4 transition-all duration-300">
                      Explore Now <ArrowRight size={20} />
                    </div>
                  </motion.button>
                );
              })}
            </motion.div>
          </div>
        </div>

        {/* Services Section with Enhanced Carousel */}
        <motion.section
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          className="py-20 bg-white"
        >
          <div className="container mx-auto px-4 md:px-8">
            <div className="text-center mb-16">
              <motion.h2 
                variants={fadeInUp}
                className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
              >
                Our Services
              </motion.h2>
              <motion.p 
                variants={fadeInUp}
                className="text-xl text-gray-600 max-w-2xl mx-auto"
              >
                Discover our comprehensive range of services designed to meet all your construction and labor needs
              </motion.p>
            </div>

            <Swiper
              modules={[Navigation, Pagination, Autoplay]}
              spaceBetween={30}
              slidesPerView={1}
              navigation
              pagination={{ clickable: true }}
              autoplay={{ delay: 4000, disableOnInteraction: false }}
              breakpoints={{
                640: { slidesPerView: 2 },
                1024: { slidesPerView: 3 },
                1280: { slidesPerView: 4 },
              }}
              className="w-full pb-16"
            >
              {service &&
                service.map((serviceItem) => (
                  <SwiperSlide key={serviceItem._id}>
                    <motion.div
                      whileHover={{ y: -10 }}
                      transition={{ duration: 0.3 }}
                      className="service-card-hover bg-white rounded-3xl shadow-lg overflow-hidden cursor-pointer group"
                      onClick={() => navigate(`/contractors/${serviceItem.name}`)}
                    >
                      <div className="relative overflow-hidden">
                        <img
                          src={serviceItem.image}
                          alt={serviceItem.name}
                          className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <div className="absolute bottom-4 left-4 right-4 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 opacity-0 group-hover:opacity-100">
                          <button className="bg-white text-blue-600 px-4 py-2 rounded-full font-semibold text-sm hover:bg-blue-50 transition-colors duration-300 flex items-center gap-2">
                            View Details <ArrowRight size={16} />
                          </button>
                        </div>
                      </div>
                      <div className="p-6">
                        <h3 className="text-xl font-bold text-center text-gray-800 group-hover:text-blue-600 transition-colors duration-300">
                          {serviceItem.name}
                        </h3>
                      </div>
                    </motion.div>
                  </SwiperSlide>
                ))}
            </Swiper>
          </div>
        </motion.section>
      </div>
      
      <Testimonials />
      <Footer />
    </>
  );
}
