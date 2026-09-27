export default function HowItWorks() {
  const steps = [
    {
      step: "1",
      title: "Choose a Template",
      desc: "Select your preferred political or special occasion poster template from our collection."
    },
    {
      step: "2",
      title: "Provide Info & Photos",
      desc: "Enter your name, designation, party, and upload your photo or leader's photo."
    },
    {
      step: "3",
      title: "Download & Share",
      desc: "Instantly generate and download your high-quality, print-ready poster."
    }
  ];

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-950 text-gray-100">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <span className="text-blue-400 font-semibold text-sm uppercase tracking-wider bg-blue-950/60 border border-blue-800/50 px-3 py-1 rounded-full">
            Simple Process
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white mt-3 mb-4">
            Create Your Poster in Just 3 Steps
          </h2>
          <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
            Easily craft professional political posters in moments without any design experience.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {steps.map((item, idx) => (
            <div 
              key={idx} 
              className="bg-gray-900 border border-gray-800 p-6 sm:p-8 rounded-2xl shadow-lg hover:border-blue-500/50 transition-all duration-300 flex flex-col items-center text-center group"
            >
              {/* Step Number Badge */}
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-blue-600 text-white rounded-2xl flex items-center justify-center mb-6 text-lg sm:text-xl font-bold shadow-md group-hover:scale-110 transition-transform duration-300">
                {item.step}
              </div>
              
              {/* Title */}
              <h3 className="font-bold text-lg sm:text-xl text-white mb-3">
                {item.title}
              </h3>
              
              {/* Description */}
              <p className="text-gray-400 text-xs sm:text-sm leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}