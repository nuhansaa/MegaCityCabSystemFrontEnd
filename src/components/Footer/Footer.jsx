import React from 'react';
import { Facebook, Instagram, Twitter, Phone, Mail, MapPin, Clock } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
          <div className="text-2xl font-bold">
              <span className="text-white italic">MEGA</span>
              <span className="text-white italic">CITY</span>
              <span className="text-lime-400 italic"> CABS</span>
            </div>
            <p className="text-gray-400">Your trusted transportation partner in Colombo. Available 24/7 for safe and comfortable rides.</p>
            <div className="flex space-x-4">
              <a href="#" className="p-2 bg-lime-400/10 rounded-lg hover:bg-lime-400/20 transition-colors">
                <Facebook className="w-5 h-5 text-lime-400" />
              </a>
              <a href="#" className="p-2 bg-lime-400/10 rounded-lg hover:bg-lime-400/20 transition-colors">
                <Instagram className="w-5 h-5 text-lime-400" />
              </a>
              <a href="#" className="p-2 bg-lime-400/10 rounded-lg hover:bg-lime-400/20 transition-colors">
                <Twitter className="w-5 h-5 text-lime-400" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white">Quick Links</h4>
            <ul className="space-y-2">
              {['About Us', 'Our Fleets', 'Book a Ride', 'Contact Us'].map((item) => (
                <li key={item}>
                  <a href="#" className="hover:text-lime-400 transition-colors">{item}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white">Contact Info</h4>
            <ul className="space-y-3">
              <li className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-lime-400" />
                <span>+94 11 234 5678</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-lime-400" />
                <span>info@megacitycab.com</span>
              </li>
              <li className="flex items-center space-x-3">
                <MapPin className="w-5 h-5 text-lime-400" />
                <span>123 Main Street, Colombo 03</span>
              </li>
              <li className="flex items-center space-x-3">
                <Clock className="w-5 h-5 text-lime-400" />
                <span>24/7 Service Available</span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white">Newsletter</h4>
            <p className="text-gray-400">Subscribe to receive updates and special offers.</p>
            <div className="space-y-2">
              <input
                type="email"
                placeholder="Your email"
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-lime-400"
              />
              <button className="w-full bg-lime-400 text-gray-900 px-4 py-2 rounded-lg font-semibold hover:bg-lime-300 transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-400">© 2025 Mega City Cab. All rights reserved.</p>
            <div className="flex space-x-6">
              <a href="#" className="text-gray-400 hover:text-lime-400 transition-colors">Privacy Policy</a>
              <a href="#" className="text-gray-400 hover:text-lime-400 transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;