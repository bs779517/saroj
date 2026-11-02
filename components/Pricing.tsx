import React from 'react';
import { Check } from 'lucide-react';
import { TiltCard } from './TiltCard';

const plans = [
  {
    name: "Yoga Sessions",
    price: "₹999/month",
    gradient: "from-emerald-400 to-teal-500",
    features: ["Personal yoga sessions", "Flexibility training", "Breathing exercises", "Weekly progress tracking", "Diet recommendations", "24/7 chat support"],
    isPopular: false
  },
  {
    name: "Weight Loss Pro",
    price: "₹2,499/month",
    gradient: "from-purple-400 to-violet-500",
    features: ["Custom workout plans", "Nutrition coaching", "BMI monitoring", "Weekly check-ins", "Supplement guidance", "Progress photos", "Community access", "Priority support"],
    isPopular: true
  },
  {
    name: "Personal Training",
    price: "₹4,999/month",
    gradient: "from-orange-400 to-red-500",
    features: ["1-on-1 coaching", "Custom meal plans", "Daily workout", "Body composition analysis", "Monthly assessments", "Competition prep", "Supplement stack", "Video consultations", "VIP support"],
    isPopular: false
  }
];

const Pricing: React.FC = () => {
  return (
    <section id="pricing" className="py-24 relative w-full overflow-hidden">
      <div className="absolute top-1/2 left-1/2 w-[800px] h-[800px] bg-emerald-500/5 rounded-full blur-[150px] -translate-x-1/2 -translate-y-1/2 pointer-events-none z-0"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20 animate-fade-in-up">
          <div className="inline-flex glass-premium px-4 py-2 rounded-full mb-4">
            <span className="text-orange-400 font-semibold text-sm">Investment in Yourself</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-extrabold text-white">
            Transform Your <span className="gradient-text">Life</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto items-center">
            {plans.map((plan, idx) => (
                <div key={idx} className={`${plan.isPopular ? 'md:-mt-8' : ''}`}>
                  <TiltCard tiltAmount={plan.isPopular ? 8 : 12} className="h-full">
                    <div className={`relative p-8 rounded-3xl flex flex-col h-full card-premium border ${plan.isPopular ? 'bg-[#1a1a2e] border-white/20' : 'glass-card border-white/10'}`}>
                        {plan.isPopular && (
                            <>
                              {/* Animated border line */}
                              <div className="absolute top-0 left-0 w-full h-[2px] gradient-animate"></div>
                              <div className="absolute top-0 right-0 transform translate-x-2 -translate-y-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider shadow-lg">
                                  POPULAR
                              </div>
                            </>
                        )}
                        
                        <div style={{ transform: 'translateZ(20px)' }}>
                          <h3 className="text-xl font-bold text-white/80 uppercase tracking-widest text-sm mb-4">{plan.name}</h3>
                          <div className="mb-8">
                              <span className={`text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r ${plan.gradient}`}>{plan.price.split('/')[0]}</span>
                              <span className="text-white/50 font-medium">/{plan.price.split('/')[1]}</span>
                          </div>
                        </div>

                        <ul className="mb-10 space-y-4 flex-1" style={{ transform: 'translateZ(15px)' }}>
                            {plan.features.map((feature, i) => (
                                <li key={i} className="flex items-start text-white/80">
                                    <div className={`flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-br ${plan.gradient} flex items-center justify-center mr-3 mt-0.5`}>
                                      <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />
                                    </div>
                                    <span className="font-medium text-sm leading-relaxed tracking-wide">{feature}</span>
                                </li>
                            ))}
                        </ul>
                        
                        <div style={{ transform: 'translateZ(25px)' }} className="mt-auto">
                          <a 
                              href={`https://wa.me/919217225060?text=I am interested in the ${plan.name} plan`}
                              target="_blank"
                              rel="noreferrer"
                              className={`block w-full py-4 rounded-xl font-bold text-center transition-all ${plan.isPopular ? 'bg-gradient-to-r from-purple-600 to-violet-600 text-white btn-glow transform hover:scale-105' : 'bg-white/10 text-white hover:bg-white/20 border border-white/10'}`}
                          >
                              Choose Plan
                          </a>
                        </div>
                    </div>
                  </TiltCard>
                </div>
            ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing;