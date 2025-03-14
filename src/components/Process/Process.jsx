import React from 'react';
import { Car, Navigation, CreditCard, ThumbsUp } from 'lucide-react';

const HowWeWork = () => {
  const steps = [
    {
      icon: <Car className="w-8 h-8" />,
      title: "Book Your Ride",
      // description: "Schedule your journey through our easy booking system",
      isHighlighted: true
    },
    {
      icon: <Navigation className="w-8 h-8" />,
      title: "Get Your Vehicle",
      // description: "Your assigned driver arrives at your location promptly",
      isHighlighted: true
    },
    {
      icon: <CreditCard className="w-8 h-8" />,
      title: "Easy Payment",
      // description: "Multiple payment options for your convenience",
      isHighlighted: true
    },
    {
      icon: <ThumbsUp className="w-8 h-8" />,
      title: "Enjoy the Journey",
      // description: "Experience a comfortable and safe ride",
      isHighlighted: true
    }
  ];

  return (
    <section className="relative py-20 bg-gray-900">
      {/* Gradient Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-lime-400/20 rounded-full filter blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-lime-400/10 rounded-full filter blur-[150px] animate-pulse delay-700" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 bg-lime-400/10 rounded-full text-lime-400 text-sm font-medium mb-6">
            Our Process
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Easy Steps to Book Your 
            <span className="text-lime-400"> Cab</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Experience hassle-free transportation with our simple booking process. We ensure a smooth journey from start to finish.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="relative group">
              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 left-full w-full h-[2px] bg-gradient-to-r from-lime-400/50 to-transparent -translate-y-1/2 z-0" />
              )}
              
              {/* Step Card */}
              <div className={`relative z-10 p-8 rounded-2xl transition-all duration-300 
                            group-hover:scale-105 bg-white border-2 border-lime-400
                            shadow-xl shadow-lime-400/20 hover:shadow-lime-400/30
                            ${step.isHighlighted ? 'bg-gradient-to-b from-white to-lime-50' : ''}`}>
                <div className="space-y-6">
                  {/* Icon Container */}
                  <div className={`w-16 h-16 rounded-xl flex items-center justify-center
                                ${step.isHighlighted 
                                  ? 'bg-lime-400 text-white' 
                                  : 'bg-lime-400/10 text-lime-400 group-hover:bg-lime-400 group-hover:text-white transition-colors duration-300'}`}>
                    {step.icon}
                  </div>
                  
                  {/* Step Number */}
                  <div className="text-sm font-medium text-lime-400">
                    Step {index + 1}
                  </div>
                  
                  {/* Content */}
                  <div>
                    <h3 className="text-xl font-semibold mb-2 text-gray-900">
                      {step.title}
                    </h3>
                    <p className="text-gray-600">
                      {step.description}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowWeWork;