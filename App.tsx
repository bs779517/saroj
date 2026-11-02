import React, { useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Services from './components/Services';
import DietPlanner from './components/DietPlanner';
import BMICalculator from './components/BMICalculator';
import Store from './components/Store';
import Pricing from './components/Pricing';
import Testimonials from './components/Testimonials';
import Footer from './components/Footer';
import { ScrollProgress } from './components/ScrollProgress';
import { BackToTop } from './components/BackToTop';
import { WhatsAppFloat } from './components/WhatsAppFloat';

const App: React.FC = () => {
  
  useEffect(() => {
    // Basic Tawk.to script injection logic could go here
    const script = document.createElement("script");
    script.async = true;
    script.src = 'https://embed.tawk.to/YOUR_WIDGET_ID/default';
    script.charset = 'UTF-8';
    script.setAttribute('crossorigin', '*');
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a16] text-white font-sans selection:bg-emerald-500/30 selection:text-emerald-200">
      <ScrollProgress />
      <Navbar />
      <main>
        <Hero />
        <Services />
        <DietPlanner />
        <BMICalculator />
        <Store />
        <Pricing />
        <Testimonials />
      </main>
      <Footer />
      <WhatsAppFloat />
      <BackToTop />
    </div>
  );
};

export default App;