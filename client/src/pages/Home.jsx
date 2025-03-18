import React, { useEffect } from "react";
import { Button } from "@mui/material";
import Card from "@/components/ui/card";
import CardContent from "@/components/ui/card-content";
import Navbar from "../components/Navbar";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../lib/axios";
import { use } from "react";
import { useState } from "react";


export default function LandingPage() {
  const navigate = useNavigate();
  const[service,setService]=useState([]);

  const fectchServices = async () => {
    try {
      const response = await axiosInstance.get("/user/Jobtypes");
      console.log(response.data);
      setService(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fectchServices();
  }, []);

  return (
    <>
      <Navbar />
      <div className="min-h-screen w-full flex flex-col mt-20 p-7">
        {/* Header Section */}
        <section className="text-center mb-8 w-full flex ">
          <img
            src="../../public/coverpic.user.jpeg" // Update this path to your actual image
            alt="Construction"
            className="mx-auto my-8 ml-4  shadow-lg  w-1/3 transform  transition-transform duration-300"
          />
          <section className="text-center mb-16 w-full p-8">
            <div className="flex flex-col items-center w-full mt-15 mb-9">
              <h1 className="text-4xl  md:text-5xl font-bold mb-4">
                Book Trusted Help for All Construction Tasks
              </h1>
              <p className="text-gray-500 text-sm md:text-lg">
                Your Vision, Our Commitment to Excellence
              </p>
            </div>
            <Card className="hover:shadow-lg transition-shadow duration-200">
              <CardContent className="p-6">
                <h3 className="text-3xl md:text-4xl font-bold mb-4">
                  India's First Local Skilled Labour Finding Application
                </h3>
                <p className="text-gray-500 mb-8 text-base md:text-lg">
                  Local Skilled Labor is a platform connecting users with local
                  skilled laborers, contractors, and material stores. Find
                  trusted help easily!
                </p>
               <button className="hover:underline" onClick={() => navigate("/about")}>
                Lern more
               </button>
              </CardContent>
            </Card>
          </section>
        </section>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 bg-red-500 text-white text-center p-8 w-full">
          {[
            "250+ Contractors",
            "200+ Shops",
            "5000+ Happy Customers",
            "2000+ Laborers",
            "90% Satisfaction",
          ].map((stat, idx) => (
            <div
              key={idx}
              className="font-bold text-sm md:text-lg hover:scale-105 transition-transform duration-300"
            >
              {stat}
            </div>
          ))}
        </div>

        {/* Info Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16 w-full p-8">
          <button onClick={() => navigate("/contractors/contractors")} ><Card className="transform hover:scale-105 transition-transform duration-300 shadow-lg">
            <CardContent>
              <h3 className="font-bold text-xl mb-4">Find Contractors</h3>
              <p className="text-gray-700 text-base">
                Hire experienced labor for your projects. Direct communication
                with contractors and get quotations easily.
              </p>
            </CardContent>
          </Card></button>   
          
          
          <button onClick={() => navigate("/stores")}> <Card className="transform hover:scale-105 transition-transform duration-300 shadow-lg">
            <CardContent>
              <h3 className="font-bold text-xl mb-4">Material Stores</h3>
              <p className="text-gray-700 text-base">
                Explore material stores offering top-quality building materials.
                Get everything you need for construction.
              </p>
            </CardContent>
          </Card></button>
          
        
         
        </div>

        {/* About Section */}

        {/* Services Section */}
        <section className="flex-grow w-full p-8 bg-gray-100">
          <h2 className="text-3xl md:text-4xl font-bold mb-8">
            Services
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            { service && service.map((service, idx) => (
              <Card
                key={service._id}
                className="overflow-hidden transform hover:scale-105 transition-transform duration-300 shadow-lg"
              >
                <img
                  src={service.image} // Update this path to your actual image
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
    </>
  );
}
