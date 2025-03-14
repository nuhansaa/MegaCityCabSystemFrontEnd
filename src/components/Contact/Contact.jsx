import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send } from 'lucide-react';
import Footer from '../Footer/Footer';
import Navbar from '../Navbar/Navbar';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  
  const [formSubmitted, setFormSubmitted] = useState(false);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send the form data to your backend
    console.log('Form submitted:', formData);
    setFormSubmitted(true);
    
    // Reset form after submission
    setTimeout(() => {
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
      setFormSubmitted(false);
    }, 3000);
  };
  
  return (
    
    <div className="bg-gray-900 min-h-screen text-gray-100">
      <Navbar/>
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-gray-800 to-gray-900 py-20 border-b border-gray-700">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-lime-400 text-center">Contact Us</h1>
          <p className="text-xl text-gray-300 text-center mt-4 max-w-2xl mx-auto">
            Have questions about our services? Need to book a ride? We're here to help you 24/7.
          </p>
        </div>
      </div>
      
      {/* Contact Information Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="bg-gray-800 p-6 rounded-xl shadow-md hover:shadow-lime-900/20 transition-shadow flex flex-col items-center text-center">
            <div className="bg-gray-700 p-3 rounded-full mb-4">
              <MapPin className="w-8 h-8 text-lime-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-lime-300">Our Location</h3>
            <p className="text-gray-300">
              123 MegaCity Plaza<br />
              Downtown District<br />
              MegaCity, MC 12345
            </p>
          </div>
          
          <div className="bg-gray-800 p-6 rounded-xl shadow-md hover:shadow-lime-900/20 transition-shadow flex flex-col items-center text-center">
            <div className="bg-gray-700 p-3 rounded-full mb-4">
              <Phone className="w-8 h-8 text-lime-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-lime-300">Call Us</h3>
            <p className="text-gray-300">
              Bookings: (555) 123-4567<br />
              Customer Support: (555) 765-4321<br />
              Emergency: (555) 911-0000
            </p>
          </div>
          
          <div className="bg-gray-800 p-6 rounded-xl shadow-md hover:shadow-lime-900/20 transition-shadow flex flex-col items-center text-center">
            <div className="bg-gray-700 p-3 rounded-full mb-4">
              <Mail className="w-8 h-8 text-lime-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-lime-300">Email Us</h3>
            <p className="text-gray-300">
              Bookings: bookings@megacitycab.com<br />
              Support: support@megacitycab.com<br />
              Business: partners@megacitycab.com
            </p>
          </div>
          
          <div className="bg-gray-800 p-6 rounded-xl shadow-md hover:shadow-lime-900/20 transition-shadow flex flex-col items-center text-center">
            <div className="bg-gray-700 p-3 rounded-full mb-4">
              <Clock className="w-8 h-8 text-lime-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-lime-300">Working Hours</h3>
            <p className="text-gray-300">
              Cab Service: 24/7<br />
              Office Hours: Mon-Fri, 9AM-6PM<br />
              Customer Support: 24/7
            </p>
          </div>
        </div>
      </div>
      
      {/* Contact Form and Map Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="bg-gray-800 p-8 rounded-xl shadow-md">
            <h2 className="text-3xl font-bold mb-6 text-lime-400">Send Us a Message</h2>
            <p className="text-gray-300 mb-8">
              Have a question or comment? Fill out the form below and our team will get back to you as soon as possible.
            </p>
            
            {formSubmitted ? (
              <div className="bg-lime-900/50 text-lime-300 p-4 rounded-lg mb-6 border border-lime-600">
                Thank you for your message! We'll get back to you soon.
              </div>
            ) : null}
            
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label htmlFor="name" className="block text-gray-300 font-medium mb-2">Full Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-lime-500 focus:border-transparent"
                    placeholder="John Doe"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-gray-300 font-medium mb-2">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-lime-500 focus:border-transparent"
                    placeholder="johndoe@example.com"
                    required
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label htmlFor="phone" className="block text-gray-300 font-medium mb-2">Phone Number</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-lime-500 focus:border-transparent"
                    placeholder="(555) 123-4567"
                  />
                </div>
                <div>
                  <label htmlFor="subject" className="block text-gray-300 font-medium mb-2">Subject</label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-lime-500 focus:border-transparent"
                    placeholder="Booking Inquiry"
                    required
                  />
                </div>
              </div>
              
              <div className="mb-6">
                <label htmlFor="message" className="block text-gray-300 font-medium mb-2">Your Message</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows="5"
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-lime-500 focus:border-transparent"
                  placeholder="Write your message here..."
                  required
                ></textarea>
              </div>
              
              <button 
                type="submit" 
                className="group bg-lime-500 text-gray-900 px-6 py-3 rounded-lg font-semibold
                          flex items-center gap-2 transition-all duration-300
                          hover:bg-lime-400 hover:drop-shadow-[0_0_12px_rgba(163,230,53,0.5)]"
              >
                Send Message
                <Send className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </button>
            </form>
          </div>
          
          {/* Map Section */}
          <div className="bg-gray-800 p-8 rounded-xl shadow-md">
            <h2 className="text-3xl font-bold mb-6 text-lime-400">Find Us</h2>
            <p className="text-gray-300 mb-8">
              Located in the heart of Colombo, MegaCity Cab is easily accessible by public transport or personal vehicle.
            </p>

            {/* Google Maps Embed for Colombo */}
            <div className="h-80 bg-gray-700 rounded-lg mb-8 border border-gray-600 overflow-hidden">
              <iframe
                title="Colombo Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d126743.585931931!2d79.78616420000001!3d6.927078600000001!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae253d10f7a7003%3A0x320b2e4d32d3838d!2sColombo%2C%20Sri%20Lanka!5e0!3m2!1sen!2sus!4v1715681234567!5m2!1sen!2sus"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
              ></iframe>
            </div>

            <div className="bg-gray-700 p-6 rounded-lg border border-gray-600">
              <h3 className="text-xl font-semibold mb-3 text-lime-300">Getting Here</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-lime-200">By Public Transport:</h4>
                  <p className="text-gray-300">Take the Colombo Central Bus or Train Station, then a 5-minute walk to our office.</p>
                </div>
                <div>
                  <h4 className="font-medium text-lime-200">By Car:</h4>
                  <p className="text-gray-300">Parking available in the Colombo City Center Garage (hourly rates apply).</p>
                </div>
                <div>
                  <h4 className="font-medium text-lime-200">From the Airport:</h4>
                  <p className="text-gray-300">35-minute drive via Colombo-Katunayake Expressway, or take the Airport Express shuttle.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* FAQ Section */}
      <div className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12 text-lime-400">Frequently Asked Questions</h2>
        
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-gray-800 p-6 rounded-xl shadow-md border border-gray-700">
            <h3 className="text-xl font-semibold mb-3 text-lime-300">How do I book a cab?</h3>
            <p className="text-gray-300">
              You can book through our mobile app, website, or call our 24/7 booking line at (076) 123-4567.
            </p>
          </div>
          
          <div className="bg-gray-800 p-6 rounded-xl shadow-md border border-gray-700">
            <h3 className="text-xl font-semibold mb-3 text-lime-300">What payment methods do you accept?</h3>
            <p className="text-gray-300">
              We accept all major credit cards, cash, digital wallets, and corporate accounts.
            </p>
          </div>
          
          <div className="bg-gray-800 p-6 rounded-xl shadow-md border border-gray-700">
            <h3 className="text-xl font-semibold mb-3 text-lime-300">Can I book a cab in advance?</h3>
            <p className="text-gray-300">
              Yes, you can schedule a pickup up to 7 days in advance through our app or by calling our booking line.
            </p>
          </div>
          
          <div className="bg-gray-800 p-6 rounded-xl shadow-md border border-gray-700">
            <h3 className="text-xl font-semibold mb-3 text-lime-300">Do you offer airport transfers?</h3>
            <p className="text-gray-300">
              Yes, we specialize in airport transfers with fixed rates and flight tracking for delayed arrivals.
            </p>
          </div>
        </div>
        
      </div>
      <Footer/>
    </div>
  );
};

export default Contact;