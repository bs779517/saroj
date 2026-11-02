import React, { useRef } from 'react';

const products = [
  { name: "Vestige Spirulina", emoji: "🌿", price: "₹503", desc: "Premium spirulina for immunity and detox", gradient: "from-emerald-400 to-teal-500" },
  { name: "Vestige Flax Oil", emoji: "🍈", price: "₹756", desc: "Omega-3 rich cold pressed flaxseed oil", gradient: "from-amber-400 to-yellow-500" },
  { name: "Veslim Shake", emoji: "🥤", price: "₹2,327", desc: "Meal replacement shake for weight management", gradient: "from-blue-400 to-indigo-500" },
  { name: "Vestige Noni", emoji: "🍇", price: "₹701", desc: "Ayurvedic wellness juice for vitality", gradient: "from-purple-400 to-violet-500" },
  { name: "Calcium", emoji: "🦴", price: "₹314", desc: "Essential calcium for strong bones", gradient: "from-sky-400 to-cyan-500" },
  { name: "Glucosamine", emoji: "🦴", price: "₹1,019", desc: "Joint care and flexibility support", gradient: "from-rose-400 to-pink-500" }
];

const Store: React.FC = () => {
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <section id="store" className="py-24 relative w-full overflow-hidden bg-[#0f0c29]">
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/20 rounded-full blur-[150px] pointer-events-none z-0"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <div className="inline-flex glass-premium px-4 py-2 rounded-full mb-4">
            <span className="text-purple-400 font-semibold text-sm">Ayurvedic Supplements</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-2">
            Wellness <span className="gradient-text">Store</span>
          </h2>
          <p className="text-white/60 sm:hidden animate-pulse">Scroll horizontally to see more →</p>
        </div>

        <div 
            ref={scrollRef}
            className="flex overflow-x-auto gap-6 pb-12 pt-4 px-4 -mx-4 no-scrollbar snap-x snap-mandatory"
        >
            {products.map((item, idx) => (
                <div key={idx} className={`min-w-[280px] sm:min-w-[300px] snap-center rounded-3xl p-6 flex flex-col card-premium bg-gradient-to-br ${item.gradient} shadow-2xl shrink-0 border border-white/20 relative z-10`}>
                    <div className="text-5xl mb-6 bg-white/20 w-20 h-20 flex items-center justify-center rounded-2xl shadow-inner backdrop-blur-md">
                        {item.emoji}
                    </div>
                    <h3 className="font-bold text-2xl text-white mb-2 tracking-tight">{item.name}</h3>
                    <p className="text-white/90 text-sm mb-6 flex-1 font-medium">{item.desc}</p>
                    
                    <div className="flex items-center justify-between mt-auto">
                      <p className="font-heading text-3xl font-bold text-white tracking-tight">{item.price}</p>
                      <a 
                          href={`https://wa.me/919217225060?text=I want to order ${item.name} for ${item.price}`} 
                          target="_blank"
                          rel="noreferrer"
                          className="bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/40 text-white font-bold py-2 px-4 rounded-xl transition-colors shadow-sm"
                      >
                          Order Now
                      </a>
                    </div>
                </div>
            ))}
        </div>
      </div>
    </section>
  );
};

export default Store;