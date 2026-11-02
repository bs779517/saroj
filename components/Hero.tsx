import React, { useEffect, useState, useRef } from 'react';
import { Sparkles } from 'lucide-react';

const AnimatedCounter = ({ target, duration = 2000 }: { target: number; duration?: number }) => {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    let startTime: number | null = null;
    let animationFrame: number;
    let observer: IntersectionObserver;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
      const percentage = Math.min(progress / duration, 1);
      
      setCount(Math.floor(target * percentage));
      
      if (percentage < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        animationFrame = requestAnimationFrame(animate);
        observer.disconnect();
      }
    }, { threshold: 0.3 });

    if (ref.current) observer.observe(ref.current);

    return () => {
      if (animationFrame) cancelAnimationFrame(animationFrame);
      if (observer) observer.disconnect();
    };
  }, [target, duration]);

  return <span ref={ref} style={{ fontVariantNumeric: 'tabular-nums' }}>{count}</span>;
};

const Hero: React.FC = () => {
  return (
    <section className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden pt-24 pb-12">
      {/* Background Orbs */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-emerald-500/30 rounded-full blur-[120px] animate-float z-0"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/20 rounded-full blur-[120px] animate-float-delayed z-0"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[150px] animate-float-slow z-0"></div>

      <div className="relative z-10 text-center px-4 max-w-5xl mx-auto flex flex-col items-center">
        
        {/* Badge */}
        <div className="inline-flex flex-row items-center gap-2 glass-premium px-4 py-2 rounded-full mb-6 animate-fade-in-up">
          <Sparkles className="w-4 h-4 text-emerald-400" />
          <span className="text-emerald-400 font-semibold text-sm">Certified Coach & Ayurveda Expert</span>
        </div>

        {/* H1 */}
        <h1 className="mb-6 font-extrabold tracking-tight leading-none text-white text-5xl sm:text-6xl lg:text-7xl animate-fade-in-up animation-delay-200 text-shadow-emerald gradient-text pb-2">
          Train Like a Champion
        </h1>

        {/* Description */}
        <p className="mb-10 text-lg sm:text-xl font-normal text-white/60 max-w-2xl mx-auto animate-fade-in-up animation-delay-400 font-sans">
          Transform your body and mind with expert Ayurveda guidance and personalized fitness strategies tailored to your unique goals.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 mb-16 animate-fade-in-up animation-delay-600">
          <a href="https://wa.me/919217225060" target="_blank" rel="noreferrer" className="inline-flex justify-center items-center py-4 px-8 text-base font-bold text-center text-white rounded-xl bg-emerald-600 btn-glow hover:scale-105 transition-transform">
            Chat on WhatsApp
            <svg className="w-5 h-5 ml-2" fill="currentColor" viewBox="0 0 24 24"><path d="M12.031 0C5.385 0 0 5.388 0 12.031c0 2.12.551 4.195 1.597 6.012L.15 24l6.108-1.554C8.038 23.418 10.016 24 12.031 24 18.679 24 24 18.614 24 11.969 24 5.32 18.679 0 12.031 0zm.014 22.016c-1.802 0-3.565-.48-5.11-1.39l-.367-.216-3.791.99.996-3.69-.236-.375c-1-1.592-1.528-3.41-1.528-5.304 0-5.556 4.516-10.076 10.063-10.076 5.55 0 10.066 4.518 10.066 10.077 0 5.555-4.516 10.075-10.093 10.075v-.001zm5.545-7.558c-.304-.152-1.797-.887-2.076-.988-.278-.101-.482-.152-.685.152-.203.303-.787.988-.964 1.19-.177.202-.355.228-.659.076-1.503-.748-2.67-1.442-3.65-2.614-.247-.297-.484-.666-.346-.948.24-.482.478-.607.72-.98.076-.117.038-.228-.013-.329-.114-.216-.684-1.644-.937-2.253-.243-.591-.497-.506-.684-.515-.178-.009-.38-.011-.584-.011-.202 0-.532.076-.81.38-.278.303-1.063 1.037-1.063 2.53 0 1.492 1.088 2.934 1.24 3.137.152.202 2.138 3.264 5.176 4.573.722.311 1.285.498 1.724.638.723.23 1.381.197 1.902.12.584-.086 1.797-.734 2.05-1.443.253-.709.253-1.316.177-1.443-.076-.127-.278-.202-.582-.354z"/></svg>
          </a>
          <a href="#planner" className="inline-flex justify-center items-center py-4 px-8 text-base font-bold text-center text-white rounded-xl glass-premium hover:bg-white/15 hover:scale-105 transition-all">
            Try AI Planner
            <Sparkles className="w-5 h-5 ml-2" />
          </a>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full animate-fade-in-up animation-delay-800">
          <div className="glass-card rounded-2xl p-6 text-center border-t border-emerald-500/20">
            <h3 className="text-4xl md:text-5xl font-extrabold text-white mb-2"><AnimatedCounter target={500} />+</h3>
            <p className="text-emerald-400 font-medium">Happy Clients</p>
          </div>
          <div className="glass-card rounded-2xl p-6 text-center border-t border-purple-500/20">
            <h3 className="text-4xl md:text-5xl font-extrabold text-white mb-2"><AnimatedCounter target={10} />+</h3>
            <p className="text-purple-400 font-medium">Years Experience</p>
          </div>
          <div className="glass-card rounded-2xl p-6 text-center border-t border-blue-500/20">
            <h3 className="text-4xl md:text-5xl font-extrabold text-white mb-2"><AnimatedCounter target={98} />%</h3>
            <p className="text-blue-400 font-medium">Success Rate</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;