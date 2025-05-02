import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../lib/axios";
import Navbar from "../components/Navbar";
import Footer from "../components/footer";
import Testimonials from "../components/testimonials";
import { LucideUser, LucideMapPin, LucideSearch } from "lucide-react";
import { color, motion } from "framer-motion";
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
      color: oklch(0.21 0.034 264.665);
    }
    .swiper-button-next::after, .swiper-button-prev::after {
      font-size: 1.5rem;
    }
    .swiper-pagination-bullet {
      width: 8px;
      height: 8px;
      background-color: rgba(0, 0, 0, 0.5);
      opacity: 1;
    }
    .swiper-pagination-bullet-active {
      background-color: oklch(0.21 0.034 264.665);
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
      <div className="min-h-screen w-full flex flex-col mt-20 ">
        {/* Header Section */}

        <div className="container mx-auto px-4 md:px-8 ">
          {" "}
          <motion.section
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            className="text-center mb-8 flex flex-col md:flex-row items-center md:items-start"
          >
            <motion.img
              src="../../public/coverpic.user.jpeg"
              alt="Construction"
              className="w-full md:w-1/3 max-w-sm mx-auto md:mx-0 shadow-lg "
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            />
            <div className="text-center md:text-left md:ml-8 flex flex-col justify-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 text-center">
                Book Trusted Help for All Tasks
              </h1>
              <p className="text-gray-500 text-sm md:text-lg mb-4 text-center">
                Your Vision, Our Commitment to Excellence
              </p>
              <div className="flex justify-center ">
                <Card className="hover:shadow-lg transition-shadow duration-200 mt-6 max-w-XL p-4 md:p-7">
                  <CardContent className="p-4 md:p-6 text-center">
                    <h3 className="text-2xl md:text-4xl font-bold mb-4">
                      India's First Local Skilled Labour Finding Application
                    </h3>
                    <p className="text-gray-500 mb-4 md:mb-8 text-base md:text-lg">
                      Local Skilled Labor is a platform connecting users with
                      local skilled laborers, contractors, and material stores.
                      Find trusted help easily!
                    </p>
                    <button
                      className="hover:underline text-blue-500"
                      onClick={() => navigate("/about")}
                    >
                      Learn more
                    </button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </motion.section>
        </div>

        {/* Stats Section */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          className="grid grid-cols-2 md:grid-cols-5 gap-4 bg-red-500 text-white text-center p-4 md:p-8 w-full "
        >
          {[
            "250+ Contractors",
            "200+ Shops",
            "5000+ Happy Customers",
            "2000+ Labours",
            "90% Satisfaction",
          ].map((stat, idx) => (
            <motion.div
              key={idx}
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.3 }}
              className="font-bold text-xs md:text-lg"
            >
              {stat}
            </motion.div>
          ))}
        </motion.div>

        {/* Info Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 my-8 w-full p-4 md:p-7">
          <motion.button
            onClick={() => navigate("/contractors")}
            variants={scaleUp}
            initial="hidden"
            animate="visible"
            whileHover={{ scale: 1.05 }}
            className="p-4 bg-white shadow-lg rounded-lg"
          >
            <h3 className="font-bold text-xl mb-2">Find Contractors</h3>
            <p className="text-gray-700 text-base">
              Hire experienced labor for your projects. Direct communication
              with contractors and get quotations easily.
            </p>
          </motion.button>

          <motion.button
            onClick={() => navigate("/stores")}
            variants={scaleUp}
            initial="hidden"
            animate="visible"
            whileHover={{ scale: 1.05 }}
            className="p-4 bg-white shadow-lg rounded-lg"
          >
            <h3 className="font-bold text-xl mb-2">Material Stores</h3>
            <p className="text-gray-700 text-base">
              Explore material stores offering top-quality building materials.
              Get everything you need for construction.
            </p>
          </motion.button>
        </div>

        {/* Services Section with Swiper Carousel */}
        <motion.section
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          className="flex-grow w-full p-4 md:p-8 bg-gray-100 rounded-lg"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center md:text-left">
            Services
          </h2>
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
            className="w-full"
          >
            {service &&
              service.map((service) => (
                <SwiperSlide key={service._id}>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden bg-white shadow-lg rounded-lg cursor-pointer"
                    onClick={() =>
                      navigate(
                        `/contractors/${encodeURIComponent(service.name)}`
                      )
                    }
                  >
                    <img
                      src={service.image}
                      alt={service.name}
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-4">
                      <h3 className="text-xl font-bold text-center">
                        {service.name}
                      </h3>
                      <div className="custom-pagination mt-4 flex justify-center"></div>
                    </div>
                  </motion.div>
                </SwiperSlide>
              ))}
          </Swiper>
        </motion.section>
      </div>
      <Testimonials />
      <Footer />
    </>
  );
}
