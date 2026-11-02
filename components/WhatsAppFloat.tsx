import React, { useState, useEffect } from 'react';

export const WhatsAppFloat = () => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(true);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  if (!show) return null;

  return (
    <a
      href="https://wa.me/919217225060"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 w-14 h-14 bg-emerald-500 rounded-full flex items-center justify-center z-50 hover:scale-110 transition-transform cursor-pointer"
    >
      <div className="absolute inset-0 rounded-full border-2 border-emerald-400 animate-ping opacity-75"></div>
      <svg className="w-8 h-8 text-white relative z-10" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12.031 0C5.385 0 0 5.388 0 12.031c0 2.12.551 4.195 1.597 6.012L.15 24l6.108-1.554C8.038 23.418 10.016 24 12.031 24 18.679 24 24 18.614 24 11.969 24 5.32 18.679 0 12.031 0zm.014 22.016c-1.802 0-3.565-.48-5.11-1.39l-.367-.216-3.791.99.996-3.69-.236-.375c-1-1.592-1.528-3.41-1.528-5.304 0-5.556 4.516-10.076 10.063-10.076 5.55 0 10.066 4.518 10.066 10.077 0 5.555-4.516 10.075-10.093 10.075v-.001zm5.545-7.558c-.304-.152-1.797-.887-2.076-.988-.278-.101-.482-.152-.685.152-.203.303-.787.988-.964 1.19-.177.202-.355.228-.659.076-1.503-.748-2.67-1.442-3.65-2.614-.247-.297-.484-.666-.346-.948.24-.482.478-.607.72-.98.076-.117.038-.228-.013-.329-.114-.216-.684-1.644-.937-2.253-.243-.591-.497-.506-.684-.515-.178-.009-.38-.011-.584-.011-.202 0-.532.076-.81.38-.278.303-1.063 1.037-1.063 2.53 0 1.492 1.088 2.934 1.24 3.137.152.202 2.138 3.264 5.176 4.573.722.311 1.285.498 1.724.638.723.23 1.381.197 1.902.12.584-.086 1.797-.734 2.05-1.443.253-.709.253-1.316.177-1.443-.076-.127-.278-.202-.582-.354z"/>
      </svg>
    </a>
  );
};
