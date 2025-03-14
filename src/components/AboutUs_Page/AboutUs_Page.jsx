import React from 'react';

const AboutUsPage = () => {
  return (
    <div className="bg-gray-900 text-white min-h-screen">
      {/* Header Section */}
      <div className="relative min-h-[500px] flex items-center justify-center">
        <div className="absolute inset-0 overflow-hidden">
          <img 
            src="/src/assets/Background_Images/Taxis.jpg" 
            alt="Mega City Cab Background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gray-900/70" />
        </div>
        <div className="relative text-center text-white">
          <h1 className="text-5xl lg:text-7xl font-bold">
            <span className="text-white">About </span>
            <span className="text-lime-400 ml-4">Us</span>
          </h1>
          <p className="text-lg text-gray-300 mt-4">Learn more about Mega City Cab</p>
        </div>
      </div>

      {/* Our Story Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="flex flex-col md:flex-row items-center gap-12">
          <div className="md:w-1/2">
            <h2 className="text-3xl font-bold mb-6">Our <span className="text-lime-400">Story</span></h2>
            <p className="text-gray-300 mb-4">
              Founded in 2020, Mega City Cab emerged from a vision to revolutionize urban transportation. 
              We recognized the need for a reliable, efficient, and tech-driven cab service that could 
              navigate the complexities of modern megacities.
            </p>
            <p className="text-gray-300 mb-4">
              What began as a small fleet of 50 vehicles has now grown into the city's premier transportation 
              network with over 5,000 drivers serving millions of passengers annually. Our journey has been 
              defined by our commitment to innovation, safety, and customer satisfaction.
            </p>
            <p className="text-gray-300">
              Today, we're proud to be the transportation backbone of the city, connecting people 
              to their destinations with speed, comfort, and reliability.
            </p>
          </div>
          <div className="md:w-1/2">
            <div className="rounded-lg overflow-hidden shadow-xl">
              <img 
                src="/src/assets/AboutUs/istockphoto-1470035625-612x612.jpg" 
                alt="Mega City Cab Story" 
                className="w-full h-auto"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Our Mission Section */}
      <div className="bg-gray-800 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-6">Our <span className="text-lime-400">Mission</span></h2>
            <p className="text-gray-300 text-lg mb-8">
              To provide the safest, most reliable, and technologically advanced transportation 
              experience in the urban landscape, while reducing traffic congestion and our carbon footprint.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
              <div className="bg-gray-900 p-6 rounded-lg shadow-lg">
                <div className="w-16 h-16 bg-lime-400/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-lime-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2 text-center">Safety First</h3>
                <p className="text-gray-400 text-center">
                  Rigorous driver screening, vehicle maintenance, and real-time trip monitoring.
                </p>
              </div>
              <div className="bg-gray-900 p-6 rounded-lg shadow-lg">
                <div className="w-16 h-16 bg-lime-400/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-lime-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2 text-center">Efficiency</h3>
                <p className="text-gray-400 text-center">
                  AI-powered routing and dispatch systems to minimize wait times and maximize coverage.
                </p>
              </div>
              <div className="bg-gray-900 p-6 rounded-lg shadow-lg">
                <div className="w-16 h-16 bg-lime-400/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-lime-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2 text-center">Sustainability</h3>
                <p className="text-gray-400 text-center">
                  Growing fleet of electric vehicles and carbon offset programs for every ride.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      

      {/* Stats Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">Our <span className="text-lime-400">Impact</span></h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { number: "5M+", label: "Rides Completed" },
              { number: "5,000+", label: "Professional Drivers" },
              { number: "98%", label: "Customer Satisfaction" },
              { number: "30%", label: "Electric Fleet" }
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl lg:text-5xl font-bold text-lime-400 mb-2">{stat.number}</div>
                <div className="text-gray-300">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="flex flex-col md:flex-row items-center gap-12">
          <div className="md:w-1/2">
            <div className="rounded-lg overflow-hidden shadow-xl">
              <img 
                src="/src/assets/AboutUs/taxi1.jpg" 
                alt="Mega City Cab Values" 
                className="w-full h-auto"
              />
            </div>
          </div>
          <div className="md:w-1/2">
            <h2 className="text-3xl font-bold mb-6">Our <span className="text-lime-400">Values</span></h2>
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="mt-1 mr-4 w-8 h-8 bg-lime-400/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-lime-400 font-bold">1</span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-1">Innovation</h3>
                  <p className="text-gray-300">
                    We continuously push the boundaries of technology to improve urban transportation.
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="mt-1 mr-4 w-8 h-8 bg-lime-400/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-lime-400 font-bold">2</span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-1">Reliability</h3>
                  <p className="text-gray-300">
                    We understand that people depend on us to get where they need to go, on time, every time.
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="mt-1 mr-4 w-8 h-8 bg-lime-400/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-lime-400 font-bold">3</span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-1">Community</h3>
                  <p className="text-gray-300">
                    We invest in our drivers, passengers, and the cities we operate in.
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="mt-1 mr-4 w-8 h-8 bg-lime-400/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-lime-400 font-bold">4</span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-1">Sustainability</h3>
                  <p className="text-gray-300">
                    We're committed to reducing our environmental impact with every ride.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-lime-400 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Ready to Experience Mega City Cab?</h2>
          <p className="text-gray-800 text-lg mb-8 max-w-2xl mx-auto">
          Book your ride today and join millions of passengers who trust us for their daily commute. Whether you're heading to work, running errands, or exploring the city, our app makes it easy to get where you need to go.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a href='/Cabs'>
          <button className="bg-gray-900 text-white py-3 px-8 rounded-lg font-semibold hover:bg-lime-500 hover:text-gray-900 transform hover:scale-105 transition-all duration-300 flex items-center space-x-2">
            <span>Book a Ride</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
          </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUsPage;