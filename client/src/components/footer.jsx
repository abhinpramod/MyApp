import { Mail, MapPin, Phone } from 'lucide-react';
import { FaFacebookF, FaTwitter, FaLinkedinIn, FaInstagram, FaYoutube } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-8 px-4">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Section */}
        <div>
          <h2 className="text-lg font-semibold mb-4">
            Committed to excellence in construction, from foundation to finish
          </h2>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <MapPin size={20} />
              <span>Business park</span>
            </div>
            <div className="flex items-center gap-3">
              <Phone size={20} />
              <span>9876543210</span>
            </div>
            <div className="flex items-center gap-3">
              <Mail size={20} />
              <span>abhinpramod18@gmail.com</span>
            </div>
          </div>
        </div>

        {/* Middle Section */}
     

        {/* Right Section */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Reach us through our socials</h3>
          <div className="flex gap-3">
            <FaFacebookF className="cursor-pointer hover:text-gray-400" size={24} />
            <FaTwitter className="cursor-pointer hover:text-gray-400" size={24} />
            <FaLinkedinIn className="cursor-pointer hover:text-gray-400" size={24} />
            <FaInstagram className="cursor-pointer hover:text-gray-400" size={24} />
            <FaYoutube className="cursor-pointer hover:text-gray-400" size={24} />
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="text-center text-sm mt-6 border-t border-gray-700 pt-4">
        Copyright © 2025-2026 MY Company S.L. All rights reserved.
      </div>
    </footer>
  );
}
