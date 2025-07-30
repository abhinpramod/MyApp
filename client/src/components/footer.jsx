import { Mail, MapPin, Phone, ArrowUp } from 'lucide-react';
import { FaFacebookF, FaTwitter, FaLinkedinIn, FaInstagram, FaYoutube } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

export default function Footer() {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const socialLinks = [
    { icon: FaFacebookF, href: '#', color: 'hover:text-blue-500', bg: 'hover:bg-blue-50' },
    { icon: FaTwitter, href: '#', color: 'hover:text-sky-500', bg: 'hover:bg-sky-50' },
    { icon: FaLinkedinIn, href: '#', color: 'hover:text-blue-600', bg: 'hover:bg-blue-50' },
    { icon: FaInstagram, href: '#', color: 'hover:text-pink-500', bg: 'hover:bg-pink-50' },
    { icon: FaYoutube, href: '#', color: 'hover:text-red-500', bg: 'hover:bg-red-50' },
  ];

  const contactInfo = [
    { icon: MapPin, text: "Business park", color: "text-blue-400" },
    { icon: Phone, text: "9876543210", color: "text-green-400" },
    { icon: Mail, text: "abhinpramod18@gmail.com", color: "text-purple-400" },
  ];

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
        staggerChildren: 0.2,
        delayChildren: 0.1
      }
    }
  };

  return (
    <footer className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}></div>
      </div>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <motion.button
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0 }}
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-50 bg-gradient-to-r from-blue-500 to-purple-600 text-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.95 }}
        >
          <ArrowUp size={24} />
        </motion.button>
      )}

      <div className="relative z-10 py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12"
          >
            {/* Company Info Section */}
            <motion.div variants={fadeInUp} className="space-y-6">
              <div>
                <h2 className="text-2xl lg:text-3xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  LocalFinder
                </h2>
                <p className="text-gray-300 text-lg leading-relaxed">
                  Committed to excellence in construction, from foundation to finish. 
                  Your trusted partner for all construction and labor needs.
                </p>
              </div>

              {/* Contact Information */}
              <div className="space-y-4">
                {contactInfo.map((item, index) => {
                  const IconComponent = item.icon;
                  return (
                    <motion.div
                      key={index}
                      whileHover={{ x: 5 }}
                      className="flex items-center gap-4 group cursor-pointer"
                    >
                      <div className={`p-2 rounded-lg bg-gray-800 ${item.color} group-hover:scale-110 transition-all duration-300`}>
                        <IconComponent size={20} />
                      </div>
                      <span className="text-gray-300 group-hover:text-white transition-colors duration-300">
                        {item.text}
                      </span>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>

            {/* Quick Links Section */}
            <motion.div variants={fadeInUp} className="space-y-6">
              <h3 className="text-xl font-semibold mb-6 text-white">Quick Links</h3>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { name: "Home", href: "/" },
                  { name: "About Us", href: "/about" },
                  { name: "Contractors", href: "/contractors" },
                  { name: "Stores", href: "/stores" },
                  { name: "Services", href: "/services" },
                  { name: "Contact", href: "/contact" },
                  { name: "Privacy Policy", href: "/privacy" },
                  { name: "Terms of Service", href: "/terms" },
                ].map((link, index) => (
                  <motion.a
                    key={index}
                    href={link.href}
                    whileHover={{ x: 5 }}
                    className="text-gray-300 hover:text-blue-400 transition-all duration-300 py-2 border-b border-transparent hover:border-blue-400/30"
                  >
                    {link.name}
                  </motion.a>
                ))}
              </div>
            </motion.div>

            {/* Social Media Section */}
            <motion.div variants={fadeInUp} className="space-y-6">
              <h3 className="text-xl font-semibold mb-6 text-white">Connect With Us</h3>
              <p className="text-gray-300 mb-6">
                Follow us on social media for updates, tips, and industry insights.
              </p>
              
              <div className="flex flex-wrap gap-4">
                {socialLinks.map((social, index) => {
                  const IconComponent = social.icon;
                  return (
                    <motion.a
                      key={index}
                      href={social.href}
                      whileHover={{ scale: 1.1, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      className={`p-3 rounded-xl bg-gray-800 text-gray-400 ${social.color} ${social.bg} transition-all duration-300 shadow-lg hover:shadow-xl border border-gray-700 hover:border-gray-600`}
                    >
                      <IconComponent size={20} />
                    </motion.a>
                  );
                })}
              </div>

              {/* Newsletter Signup */}
              <div className="mt-8 p-6 bg-gradient-to-r from-blue-600/10 to-purple-600/10 rounded-2xl border border-gray-700">
                <h4 className="text-lg font-semibold mb-3 text-white">Stay Updated</h4>
                <p className="text-gray-300 text-sm mb-4">
                  Subscribe to our newsletter for the latest updates and offers.
                </p>
                <div className="flex gap-2">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="flex-1 px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors duration-300"
                  />
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all duration-300"
                  >
                    Subscribe
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Bottom Section */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="mt-16 pt-8 border-t border-gray-700"
          >
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="text-gray-400 text-sm">
                Copyright © 2025-2026 LocalFinder Company S.L. All rights reserved.
              </div>
              <div className="flex items-center gap-6 text-sm text-gray-400">
                <motion.a
                  href="/privacy"
                  whileHover={{ color: "#60A5FA" }}
                  className="hover:underline transition-colors duration-300"
                >
                  Privacy Policy
                </motion.a>
                <motion.a
                  href="/terms"
                  whileHover={{ color: "#60A5FA" }}
                  className="hover:underline transition-colors duration-300"
                >
                  Terms of Service
                </motion.a>
                <motion.a
                  href="/cookies"
                  whileHover={{ color: "#60A5FA" }}
                  className="hover:underline transition-colors duration-300"
                >
                  Cookie Policy
                </motion.a>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-40 h-40 bg-gradient-to-tl from-purple-500/10 to-pink-500/10 rounded-full blur-3xl"></div>
    </footer>
  );
}
