import React, { useState, useEffect, useRef } from 'react';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';

const testimonials = [
  { name: "Priya Sharma", emoji: "👩", result: "Lost 12kg in 3 months", text: "Coach Saroj completely transformed my lifestyle. The diet wasn't restrictive, it was liberating." },
  { name: "Rahul Verma", emoji: "👨", result: "Gained 8kg muscle in 4 months", text: "The strength training protocols are incredible. Combined with the Ayurveda tips, I've never felt better." },
  { name: "Sunita Devi", emoji: "👩", result: "Complete lifestyle transformation", text: "Healing my gut naturally changed everything. The morning yoga sessions bring peace to my entire day." },
  { name: "Amit Patel", emoji: "👨", result: "Marathon ready in 6 months", text: "From zero stamina to running half marathons. The guidance is spot on and the nutrition plan fueled my runs perfectly." },
  { name: "Neha Gupta", emoji: "👩", result: "PCOD reversed naturally", text: "Through the customized diet chart and specific yogasanas, my cycles are finally totally regular." }
];

const Testimonials: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [visibleCount, setVisibleCount] = useState(1);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleResize = () => {
      setVisibleCount(window.innerWidth >= 768 ? 3 : 1);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const totalSlides = Math.ceil(testimonials.length / visibleCount);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  useEffect(() => {
    if (!isHovered) {
      timerRef.current = setInterval(nextSlide, 4000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isHovered, totalSlides]);

  return (
    <section id="testimonials" className="py-24 relative w-full overflow-hidden bg-[#1a1a2e]">
      <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-[120px] pointer-events-none z-0"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex glass-premium px-4 py-2 rounded-full mb-4">
            <span className="text-blue-400 font-semibold text-sm">Success Stories</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-extrabold text-white">
            Client <span className="gradient-text">Transformations</span>
          </h2>
        </div>

        <div 
          className="relative max-w-5xl mx-auto"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Controls */}
          <button onClick={prevSlide} className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-12 z-20 w-12 h-12 glass-premium rounded-full flex items-center justify-center hover:bg-white/10 transition-colors text-white">
            <ChevronLeft className="w-6 h-6" />
          </button>
          
          <button onClick={nextSlide} className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-12 z-20 w-12 h-12 glass-premium rounded-full flex items-center justify-center hover:bg-white/10 transition-colors text-white">
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Carousel Viewport */}
          <div className="overflow-hidden no-scrollbar">
            <div 
              className="flex transition-transform duration-700 ease-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {/* Grouping items for slides */}
              {Array.from({ length: totalSlides }).map((_, slideIdx) => (
                <div key={slideIdx} className="w-full shrink-0 flex gap-6 px-2">
                  {testimonials.slice(slideIdx * visibleCount, (slideIdx + 1) * visibleCount).map((t, i) => (
                    <div key={i} className="flex-1 glass-card p-8 rounded-3xl border border-white/10 h-full flex flex-col justify-between">
                      <div>
                        <div className="flex gap-1 mb-6 text-yellow-400">
                          <Star className="w-5 h-5 fill-current" />
                          <Star className="w-5 h-5 fill-current" />
                          <Star className="w-5 h-5 fill-current" />
                          <Star className="w-5 h-5 fill-current" />
                          <Star className="w-5 h-5 fill-current" />
                        </div>
                        <p className="text-white/60 mb-6 italic leading-relaxed text-lg font-sans">"{t.text}"</p>
                      </div>
                      
                      <div className="mt-auto">
                        <div className="inline-block bg-emerald-500/15 text-emerald-400 text-sm font-semibold px-3 py-1.5 rounded-lg mb-4">
                          {t.result}
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-xl shadow-lg">
                            {t.emoji}
                          </div>
                          <h4 className="font-bold text-white tracking-wide">{t.name}</h4>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* Dots */}
          <div className="flex justify-center mt-10 gap-2">
            {Array.from({ length: totalSlides }).map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  currentIndex === idx ? 'w-8 gradient-animate' : 'w-2 bg-white/20 hover:bg-white/40'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;