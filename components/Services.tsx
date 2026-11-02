import React from 'react';
import { Flower2, Flame, Apple, Dumbbell, Leaf, BrainCircuit, ArrowRight } from 'lucide-react';
import { TiltCard } from './TiltCard';

const Services: React.FC = () => {
  const services = [
    {
      title: "Online Yoga",
      icon: Flower2,
      desc: "Personalized yoga sessions for flexibility, strength, and inner peace",
      color: "from-emerald-400 to-teal-500",
      link: "https://wa.me/919217225060"
    },
    {
      title: "Weight Loss",
      icon: Flame,
      desc: "Transform your body with cardio, HIIT, and nutrition plans",
      color: "from-orange-400 to-red-500",
      link: "https://wa.me/919217225060"
    },
    {
      title: "Diet Charts",
      icon: Apple,
      desc: "Custom diet plans tailored to your body type and goals",
      color: "from-green-400 to-emerald-500",
      link: "https://wa.me/919217225060"
    },
    {
      title: "Strength Training",
      icon: Dumbbell,
      desc: "Progressive overload programs for building lean muscle",
      color: "from-blue-400 to-indigo-500",
      link: "https://wa.me/919217225060"
    },
    {
      title: "Ayurveda Guide",
      icon: Leaf,
      desc: "Ancient Indian remedies for holistic wellness and vitality",
      color: "from-lime-400 to-green-500",
      link: "https://wa.me/919217225060"
    },
    {
      title: "Mental Toughness",
      icon: BrainCircuit,
      desc: "Build unbreakable mental resilience through mindfulness",
      color: "from-purple-400 to-violet-500",
      link: "https://wa.me/919217225060"
    }
  ];

  return (
    <section id="services" className="relative py-24 w-full overflow-hidden">
      {/* Background orb */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none z-0"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex glass-premium px-4 py-2 rounded-full mb-4">
            <span className="text-emerald-400 font-semibold text-sm">What We Offer</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-extrabold text-white">
            Our Premium <span className="gradient-text">Services</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, idx) => {
            const Icon = service.icon;
            return (
              <TiltCard key={idx} tiltAmount={10} className="h-full">
                <div className="card-premium glass-card h-full rounded-2xl p-8 flex flex-col items-start text-left border border-white/10 group">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 bg-gradient-to-br ${service.color} transform transition-transform duration-300 group-hover:scale-110 shadow-lg`}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3 tracking-tight" style={{ transform: 'translateZ(15px)' }}>
                    {service.title}
                  </h3>
                  <p className="text-white/60 mb-8 leading-relaxed font-sans" style={{ transform: 'translateZ(10px)' }}>
                    {service.desc}
                  </p>
                  <a
                    href={service.link}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-auto inline-flex items-center text-white font-semibold flex-row gap-1.5 transition-all group-hover:gap-3 group-hover:text-emerald-400"
                  >
                    Learn More <ArrowRight className="w-5 h-5" />
                  </a>
                </div>
              </TiltCard>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Services;