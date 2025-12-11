import React, { useEffect, useState } from 'react';

const StarryBackground: React.FC = () => {
  const [stars, setStars] = useState<{ id: number; left: string; top: string; size: string; delay: string }[]>([]);

  useEffect(() => {
    // Generate static stars to avoid hydration mismatch, but randomized
    const newStars = Array.from({ length: 50 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      size: `${Math.random() * 3 + 1}px`,
      delay: `${Math.random() * 5}s`,
    }));
    setStars(newStars);
  }, []);

  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none bg-gradient-to-b from-vg-blue-dark via-vg-blue-mid to-vg-blue-dark">
      {/* The Moon / Swirl */}
      <div className="absolute top-10 right-10 w-32 h-32 rounded-full bg-vg-yellow opacity-80 blur-[40px] animate-pulse"></div>
      <div className="absolute top-12 right-12 w-24 h-24 rounded-full bg-white opacity-90 blur-[10px]"></div>

      {/* Decorative Swirls (CSS Art) */}
      <div className="absolute top-1/4 left-0 w-[500px] h-[500px] border-2 border-white/5 rounded-full blur-3xl swirl animate-float"></div>
      <div className="absolute bottom-0 right-0 w-[600px] h-[400px] bg-vg-blue-light/10 blur-[100px] rounded-full"></div>

      {/* Stars */}
      {stars.map((star) => (
        <div
          key={star.id}
          className="star animate-twinkle"
          style={{
            left: star.left,
            top: star.top,
            width: star.size,
            height: star.size,
            animationDelay: star.delay,
          }}
        />
      ))}
    </div>
  );
};

export default StarryBackground;