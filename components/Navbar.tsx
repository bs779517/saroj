import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Services', href: '#services' },
    { name: 'Diet Plan', href: '#tools' },
    { name: 'Body Report', href: '#bmicalculator' },
    { name: 'Store', href: '#store' },
    { name: 'Pricing', href: '#pricing' },
  ];

  return (
    <nav className={`fixed w-full z-50 top-0 start-0 transition-all duration-500 ${scrolled ? 'glass-nav py-3' : 'py-5'}`}>
      <div className="max-w-7xl mx-auto px-4 flex flex-wrap items-center justify-between">
        <a href="#" className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl gradient-animate flex items-center justify-center font-bold text-xl text-white shadow-lg">
            S
          </div>
          <span className="self-center text-2xl font-black whitespace-nowrap gradient-text tracking-tighter">
            SAROJFIT
          </span>
        </a>
        
        <div className="flex md:order-2 space-x-3 md:space-x-0">
          <a
            href="https://wa.me/919217225060"
            target="_blank"
            rel="noreferrer"
            className="hidden md:inline-flex text-white bg-emerald-600 font-bold rounded-xl text-sm px-5 py-2.5 text-center transition-transform hover:scale-105 btn-glow"
          >
            Contact Me
          </a>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="inline-flex items-center p-2 w-10 h-10 justify-center rounded-lg md:hidden text-white hover:bg-white/10 transition-colors"
          >
            {isOpen ? <X /> : <Menu />}
          </button>
        </div>
        
        <div className={`w-full md:block md:w-auto md:order-1 overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-80 mt-4' : 'max-h-0 md:max-h-80'}`}>
          <ul className="flex flex-col p-4 md:p-0 font-medium md:space-x-8 md:flex-row glass md:bg-transparent md:border-0 rounded-xl">
            {navLinks.map((link) => (
              <li key={link.name}>
                <a href={link.href} className="group relative py-2 block text-white md:p-0 font-medium" onClick={() => setIsOpen(false)}>
                  {link.name}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-emerald-500 transition-all duration-300 group-hover:w-full"></span>
                </a>
              </li>
            ))}
            <li className="mt-4 md:hidden">
              <a
                href="https://wa.me/919217225060"
                target="_blank"
                rel="noreferrer"
                className="block w-full text-white bg-emerald-600 font-bold rounded-xl text-sm px-5 py-2.5 text-center btn-glow"
              >
                Contact Me
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;