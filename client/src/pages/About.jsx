import React from "react";
import { Users, Briefcase, Building } from "lucide-react";
import Navbar from "../components/Navbar";

export default function AboutPage() {
  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gray-50 text-gray-800 mt-20">
        <div className="max-w-6xl mx-auto p-6">
          <h1 className="text-4xl font-bold text-center mb-8 ">
            About Local Skilled Labor Finder
          </h1>
          <p className="text-lg text-center mb-12">
            Connecting communities with trusted local skilled laborers,
            contractors, and material suppliers.
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white shadow-lg rounded-2xl p-6 text-center hover:shadow-xl transition">
              <Users className="w-12 h-12 mx-auto" />
              <h2 className="text-xl font-semibold mt-4">Our Mission</h2>
              <p className="text-sm mt-2">
                Empowering users by providing a seamless way to find and hire
                skilled laborers, contractors, and access building materials
                locally.
              </p>
            </div>
            <div className="bg-white shadow-lg rounded-2xl p-6 text-center hover:shadow-xl transition">
              <Briefcase className="w-12 h-12 mx-auto" />
              <h2 className="text-xl font-semibold mt-4">For Contractors</h2>
              <p className="text-sm mt-2">
                Offering contractors a dedicated platform to showcase their
                skills, manage inquiries, and grow their business.
              </p>
            </div>
            <div className="bg-white shadow-lg rounded-2xl p-6 text-center hover:shadow-xl transition">
              <Building className="w-12 h-12 mx-auto " />
              <h2 className="text-xl font-semibold mt-4">For Stores</h2>
              <p className="text-sm mt-2">
                Helping local stores reach more customers by listing their
                products and simplifying the purchase process.
              </p>
            </div>
          </div>

          <div className="mt-16 text-center">
            <h2 className="text-2xl font-bold ">Why Choose Us?</h2>
            <p className="mt-4 text-lg max-w-4xl mx-auto">
              Local Skilled Labor Finder” is more than just a platform — it’s a
              bridge connecting users, contractors, and local stores in a
              seamless, efficient, and trustworthy environment. We’ve built this
              project with a focus on solving real-world challenges: finding
              reliable skilled labor, verifying contractors, and sourcing
              building materials all in one place. Our platform offers features
              like real-time notifications, OTP-based authentication, and secure
              payments, ensuring safety and convenience at every step. For
              contractors and stores, we provide tools to showcase work, manage
              sales, and gain insights into their business. For users, we
              simplify the search process with advanced filters, geolocation,
              and personalized recommendations. Our project is designed to
              empower local businesses, build community trust, and streamline
              construction-related services. Choose us because we’re not just
              building a platform — we’re building a stronger, more connected
              local ecosystem.
            </p>
          </div>

          <div className="mt-16 text-center">
            <h2 className="text-2xl font-bold ">Get in Touch</h2>
            <p className="mt-4 text-lg">
              Have questions or feedback? Reach out to us at{" "}
              <a
                href="mailto:support@localskilledlabor.com"
                className="text-blue-500 underline"
              >
                support@localskilledlabor.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
