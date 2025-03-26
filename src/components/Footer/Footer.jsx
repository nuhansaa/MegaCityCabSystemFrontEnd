import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Facebook, 
  Instagram, 
  Twitter, 
  Phone, 
  Mail, 
  MapPin, 
  Clock 
} from 'lucide-react';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [subscriptionStatus, setSubscriptionStatus] = useState('');

  const handleSubscribe = async (e) => {
    e.preventDefault();
    
    try {
      setSubscriptionStatus('Subscribing...');
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSubscriptionStatus('Successfully subscribed! Thank you!');
      setEmail('');
      setTimeout(() => setSubscriptionStatus(''), 3000);
    } catch (error) {
      setSubscriptionStatus('Subscription failed. Please try again.');
      setTimeout(() => setSubscriptionStatus(''), 3000);
    }
  };

  const socialLinks = [
    { icon: <Facebook className="w-5 h-5" />, label: "Facebook", url: "https://facebook.com" },
    { icon: <Instagram className="w-5 h-5" />, label: "Instagram", url: "https://instagram.com" },
    { icon: <Twitter className="w-5 h-5" />, label: "Twitter", url: "https://twitter.com" }
  ];

  const quickLinks = [
    { name: "About Us", path: "/AboutUs" },
    { name: "Our Fleets", path: "/Cabs" },
    { name: "Book a Ride", path: "/Cabs" },
    { name: "Contact Us", path: "/Contact" }
    
  ];

  const contactInfo = [
    { icon: <Phone className="w-5 h-5" />, text: "+94 11 234 5678" },
    { icon: <Mail className="w-5 h-5" />, text: "info@megacitycab.com" },
    { icon: <MapPin className="w-5 h-5" />, text: "123 Main Street, Colombo 03" },
    { icon: <Clock className="w-5 h-5" />, text: "24/7 Service Available" }
  ];

  const legalLinks = [
    { name: "Privacy Policy", path: "/privacy" },
    { name: "Terms of Service", path: "/terms" },
    { name: "Cookie Policy", path: "/cookies" }
  ];

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <Link to="/" className="text-2xl font-bold flex items-center">
              <span className="text-white italic">MEGA</span>
              <span className="text-white italic">CITY</span>
              <span className="text-lime-400 italic"> CABS</span>
            </Link>
            <p className="text-gray-400">
              Your trusted transportation partner in Colombo. Available 24/7 for safe and comfortable rides.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="p-2 bg-lime-400/10 rounded-lg hover:bg-lime-400/20 transition-colors"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Quick Links</h3>
            <ul className="space-y-2">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <Link 
                    to={link.path} 
                    className="hover:text-lime-400 transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Contact Info</h3>
            <ul className="space-y-3">
              {contactInfo.map((info, index) => (
                <li key={index} className="flex items-start space-x-3">
                  <span className="text-lime-400 mt-0.5">{info.icon}</span>
                  <span>{info.text}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Newsletter</h3>
            <p className="text-gray-400">
              Subscribe to receive updates, promotions, and special offers.
            </p>
            <form onSubmit={handleSubscribe} className="space-y-3">
              <div>
                <input
                  type="email"
                  placeholder="Your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-lime-400"
                  aria-label="Email for newsletter subscription"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-lime-400 text-gray-900 px-4 py-2 rounded-lg font-semibold hover:bg-lime-300 transition-colors focus:outline-none focus:ring-2 focus:ring-lime-400 focus:ring-offset-2 focus:ring-offset-gray-900"
              >
                Subscribe
              </button>
              {subscriptionStatus && (
                <p 
                  className={`text-sm mt-2 ${
                    subscriptionStatus.includes('Success') 
                      ? 'text-lime-400' 
                      : 'text-red-400'
                  }`}
                >
                  {subscriptionStatus}
                </p>
              )}
            </form>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-400 text-sm">
              © {new Date().getFullYear()} Mega City Cab. All rights reserved.
            </p>
            <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
              {legalLinks.map((link, index) => (
                <Link
                  key={index}
                  to={link.path}
                  className="text-gray-400 hover:text-lime-400 transition-colors text-sm"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;