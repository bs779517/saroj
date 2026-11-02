import React, { useRef, useState, MouseEvent } from 'react';

interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
  tiltAmount?: number;
}

export const TiltCard: React.FC<TiltCardProps> = ({ children, className = '', tiltAmount = 10 }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [glarePosition, setGlarePosition] = useState({ x: 50, y: 50 });

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const rotateY = ((mouseX / width) - 0.5) * (tiltAmount * 2);
    const rotateX = ((mouseY / height) - 0.5) * -(tiltAmount * 2);

    setRotation({ x: rotateX, y: rotateY });
    setGlarePosition({ x: (mouseX / width) * 100, y: (mouseY / height) * 100 });
  };

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotation({ x: 0, y: 0 });
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`relative rounded-xl overflow-hidden ${className}`}
      style={{
        perspective: '1000px',
        transformStyle: 'preserve-3d',
        transition: isHovered ? 'none' : 'transform 150ms ease-out',
        transform: isHovered
          ? `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg) scale3d(1.02, 1.02, 1.02)`
          : 'rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
      }}
    >
      {/* Glare effect */}
      <div
        className="absolute inset-0 pointer-events-none z-50 transition-opacity duration-300"
        style={{
          opacity: isHovered ? 1 : 0,
          background: `radial-gradient(circle at ${glarePosition.x}% ${glarePosition.y}%, rgba(255,255,255,0.2) 0%, transparent 50%)`,
        }}
      />
      
      {/* Content wrapper with translateZ for depth */}
      <div style={{ transform: 'translateZ(10px)', transformStyle: 'preserve-3d' }} className="h-full">
        {children}
      </div>
    </div>
  );
};
