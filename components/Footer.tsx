import React from 'react';
import { Phone, Mail, MapPin, Heart } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-[#0a0a16] text-white pt-20 pb-10 border-t border-white/10 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-emerald-500 to-transparent opacity-50"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid md:grid-cols-4 gap-12 mb-16">
            <div className="col-span-1 md:col-span-2">
                <h2 className="text-3xl font-black tracking-tight mb-4 flex items-center gap-2">
                    <span className="text-emerald-400">SAROJ</span>
                    <span className="text-white">FITNESS</span>
                </h2>
                <p className="text-gray-400 text-base leading-relaxed mb-6 max-w-sm">
                    Holistic transformation combining modern fitness science with ancient Ayurvedic wisdom. Your journey to peak health starts here.
                </p>
                <div className="flex space-x-4">
                    <a href="https://instagram.com" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full glass-card hover:bg-emerald-500/20 hover:border-emerald-500/50 flex items-center justify-center transition-all text-white hover:text-emerald-400">
                        <i className="fab fa-instagram text-xl"></i>
                    </a>
                </div>
            </div>
            
            <div>
                <h3 className="text-lg font-bold text-white mb-6 uppercase tracking-wider text-sm">Quick Links</h3>
                <ul className="space-y-3">
                    <li><a href="#home" className="text-gray-400 hover:text-emerald-400 transition-colors">Home</a></li>
                    <li><a href="#services" className="text-gray-400 hover:text-emerald-400 transition-colors">Services</a></li>
                    <li><a href="#diet" className="text-gray-400 hover:text-emerald-400 transition-colors">Diet Plan</a></li>
                    <li><a href="#bmicalculator" className="text-gray-400 hover:text-emerald-400 transition-colors">BMI Check</a></li>
                    <li><a href="#store" className="text-gray-400 hover:text-emerald-400 transition-colors">Store</a></li>
                </ul>
            </div>

            <div>
                <h3 className="text-lg font-bold text-white mb-6 uppercase tracking-wider text-sm">Contact</h3>
                <ul className="space-y-4">
                    <li className="flex items-start gap-3">
                        <Phone className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                        <a href="tel:+919217225060" className="text-gray-400 hover:text-emerald-400 transition-colors">+91 92172 25060</a>
                    </li>
                    <li className="flex items-start gap-3">
                        <Mail className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                        <a href="mailto:saroj.shila60@gmail.com" className="text-gray-400 hover:text-emerald-400 transition-colors break-words">saroj.shila60@gmail.com</a>
                    </li>
                    <li className="flex items-start gap-3">
                        <MapPin className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                        <span className="text-gray-400">Delhi, India</span>
                    </li>
                </ul>
            </div>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between text-gray-500 text-sm border-t border-white/10 pt-8">
            <p>© {new Date().getFullYear()} Saroj Fitness & Ayurveda. All rights reserved.</p>
            <p className="flex items-center gap-1 mt-4 md:mt-0">
                Made with <Heart className="w-4 h-4 text-red-500 fill-current" /> in India
            </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;