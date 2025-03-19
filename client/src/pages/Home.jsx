import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../lib/axios";
import Navbar from "../components/Navbar";
import Card from "@/components/ui/card";
import CardContent from "@/components/ui/card-content";
import { LucideUser, LucideMapPin, LucideSearch } from "lucide-react";
import  Footer from "../components/footer";
import Testimonials from "../components/testimonials";

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

  return (
    <>
      <Navbar />
      <div className="min-h-screen w-full flex flex-col mt-20 p-4 md:p-7">
        {/* Header Section */}
        <section className="text-center mb-8 flex flex-col md:flex-row items-center md:items-start">
          <img
            src="../../public/coverpic.user.jpeg"
            alt="Construction"
            className="w-full md:w-1/3 max-w-sm mx-auto md:mx-0 shadow-lg transform transition-transform duration-300"
          />
          <div className="text-center md:text-left md:ml-8 flex flex-col justify-center">
            <h1 className="text-3xl md:text-5xl font-bold mb-4">
              Book Trusted Help for All Construction Tasks
            </h1>
            <center>  <p className="text-gray-500 text-sm md:text-lg">
              Your Vision, Our Commitment to Excellence
            </p></center>
          
            <Card className="hover:shadow-lg transition-shadow duration-200 mt-6">
              <CardContent className="p-4 md:p-6">
                <h3 className="text-2xl md:text-4xl font-bold mb-4">
                  India's First Local Skilled Labour Finding Application
                </h3>
                <p className="text-gray-500 mb-4 md:mb-8 text-base md:text-lg">
                  Local Skilled Labor is a platform connecting users with local
                  skilled laborers, contractors, and material stores. Find
                  trusted help easily!
                </p>
                <center> <button
                  className="hover:underline text-blue-500"
                  onClick={() => navigate("/about")}
                >
                  Learn more
                </button></center>
               
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 bg-red-500 text-white text-center p-4 md:p-8 w-full">
          {["250+ Contractors", "200+ Shops", "5000+ Happy Customers", "2000+ Labours", "90% Satisfaction"].map((stat, idx) => (
            <div
              key={idx}
              className="font-bold text-xs md:text-lg hover:scale-105 transition-transform duration-300"
            >
              {stat}
            </div>
          ))}
        </div>

        {/* Info Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 my-8 w-full">
          <button onClick={() => navigate("/contractors/contractors")}>
            <Card className="transform hover:scale-105 transition-transform duration-300 shadow-lg">
              <CardContent>
                <h3 className="font-bold text-xl mb-4">Find Contractors</h3>
                <p className="text-gray-700 text-base">
                  Hire experienced labor for your projects. Direct communication
                  with contractors and get quotations easily.
                </p>
              </CardContent>
            </Card>
          </button>

          <button onClick={() => navigate("/stores")}> 
            <Card className="transform hover:scale-105 transition-transform duration-300 shadow-lg">
              <CardContent>
                <h3 className="font-bold text-xl mb-4">Material Stores</h3>
                <p className="text-gray-700 text-base">
                  Explore material stores offering top-quality building materials.
                  Get everything you need for construction.
                </p>
              </CardContent>
            </Card>
          </button>
        </div>

        {/* Services Section */}
        <section className="flex-grow w-full p-4 md:p-8 bg-gray-100">
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center md:text-left">
            Services
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-8">
            {service &&
              service.map((service) => (
                <Card
                  key={service._id}
                  className="overflow-hidden transform hover:scale-105 transition-transform duration-300 shadow-lg"
                >
                  <img
                    src={service.image}
                    alt="Service"
                    className="w-full h-48 object-cover"
                  />
                  <CardContent>
                    <h3 className="text-xl font-bold text-center">
                      {service.name}
                    </h3>
                  </CardContent>
                </Card>
              ))}
          </div>
        </section>
      </div>
      <Testimonials/>
      <Footer/>
    </>
  );
}
