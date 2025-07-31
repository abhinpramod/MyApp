import { Mail, MapPin, Phone, Clock } from 'lucide-react';
import { FaFacebookF, FaTwitter, FaLinkedinIn, FaInstagram, FaYoutube } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="bg-gradient-to-b from-gray-800 to-gray-900 text-white pt-16 pb-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Company Info */}
          <div>
            <div className="flex items-center space-x-2 mb-6">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-700 flex items-center justify-center">
                <span className="text-white font-bold text-lg">L</span>
              </div>
              <span className="text-2xl font-bold">LocalFinder</span>
            </div>
            <p className="text-gray-300 mb-6">
              Committed to excellence in construction, from foundation to finish. Connecting you with trusted professionals since 2023.
            </p>
            <div className="flex space-x-4">
              <FaFacebookF className="cursor-pointer hover:text-blue-400 transition-colors duration-300" size={20} />
              <FaTwitter className="cursor-pointer hover:text-blue-400 transition-colors duration-300" size={20} />
              <FaLinkedinIn className="cursor-pointer hover:text-blue-400 transition-colors duration-300" size={20} />
              <FaInstagram className="cursor-pointer hover:text-blue-400 transition-colors duration-300" size={20} />
              <FaYoutube className="cursor-pointer hover:text-blue-400 transition-colors duration-300" size={20} />
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-6 text-white">Quick Links</h3>
            <ul className="space-y-3">
              <li><a href="/" className="text-gray-300 hover:text-white transition-colors duration-300">Home</a></li>
              <li><a href="/contractors" className="text-gray-300 hover:text-white transition-colors duration-300">Contractors</a></li>
              <li><a href="/stores" className="text-gray-300 hover:text-white transition-colors duration-300">Material Stores</a></li>
              <li><a href="/about" className="text-gray-300 hover:text-white transition-colors duration-300">About Us</a></li>
              <li><a href="/contact" className="text-gray-300 hover:text-white transition-colors duration-300">Contact</a></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold mb-6 text-white">Services</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors duration-300">Home Construction</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors duration-300">Renovation</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors duration-300">Interior Design</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors duration-300">Plumbing</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors duration-300">Electrical Work</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-6 text-white">Contact Us</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin size={20} className="text-blue-400 mt-1" />
                <span className="text-gray-300">123 Business Park, Suite 100, City, Country</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone size={20} className="text-blue-400" />
                <span className="text-gray-300">+91 98765 43210</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail size={20} className="text-blue-400" />
                <span className="text-gray-300">contact@localfinder.com</span>
              </div>
              <div className="flex items-center gap-3">
                <Clock size={20} className="text-blue-400" />
                <span className="text-gray-300">Mon-Fri: 9AM - 6PM</span>
              </div>
            </div>
          </div>
        </div>

        {/* Newsletter
        <div className="bg-gray-700 rounded-xl p-6 mb-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-semibold mb-2">Subscribe to Our Newsletter</h3>
              <p className="text-gray-300">Get the latest updates and offers</p>
            </div>
            <div className="flex w-full md:w-auto">
              <input 
                type="email" 
                placeholder="Your email address" 
                className="px-4 py-3 rounded-l-lg w-full md:w-64 focus:outline-none text-gray-800"
              />
              <button className="bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-3 rounded-r-lg font-medium hover:opacity-90 transition-opacity duration-300">
                Subscribe
              </button>
            </div>
          </div>
        </div> */}

        {/* Copyright */}
        <div className="pt-8 border-t border-gray-700 text-center text-gray-400 text-sm">
          <p>Copyright © 2023-2024 LocalFinder. All rights reserved.</p>
          <div className="mt-2 flex justify-center space-x-6">
            <a href="#" className="hover:text-white transition-colors duration-300">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors duration-300">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors duration-300">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}