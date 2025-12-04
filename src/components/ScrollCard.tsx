import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface ScrollCardProps {
  children: React.ReactNode;
  index: number;
  totalCards?: number;
  className?: string;
}

const ScrollCard = ({ children, index, totalCards = 5, className }: ScrollCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [scale, setScale] = useState(1);
  const [brightness, setBrightness] = useState(1);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      {
        threshold: 0.05,
        rootMargin: "100px",
      }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (!cardRef.current) return;
      
      const rect = cardRef.current.getBoundingClientRect();
      const topOffset = 80 + index * 30; // Increased spacing between stacked cards
      
      // Calculate how much the card is "stuck" at the top
      if (rect.top <= topOffset + 20) {
        // Card is stuck - calculate scale based on how far it is from ideal position
        const distanceFromTop = Math.max(0, topOffset - rect.top + 80);
        const scaleReduction = Math.min(distanceFromTop / 500, 0.12); // Max 12% scale reduction
        const brightnessReduction = Math.min(distanceFromTop / 800, 0.15); // Slight dimming
        setScale(1 - scaleReduction);
        setBrightness(1 - brightnessReduction);
      } else {
        setScale(1);
        setBrightness(1);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [index]);

  // Each card sticks at a progressively higher position so they stack visually
  const topOffset = 80 + index * 30;

  return (
    <div
      ref={cardRef}
      className={cn(
        "sticky w-full max-w-5xl mx-auto origin-top will-change-transform",
        "transition-opacity duration-700 ease-[cubic-bezier(0.25,0.46,0.45,0.94)]",
        isVisible 
          ? "opacity-100" 
          : "opacity-0 translate-y-20",
        className
      )}
      style={{
        top: `${topOffset}px`,
        zIndex: 10 + index,
        transform: `scale(${scale})`,
        filter: `brightness(${brightness})`,
        transition: 'transform 0.2s ease-out, filter 0.2s ease-out, opacity 0.7s cubic-bezier(0.25,0.46,0.45,0.94)',
      }}
    >
      <div 
        className="rounded-3xl transition-shadow duration-300 overflow-hidden"
        style={{
          boxShadow: `
            0 ${15 + index * 8}px ${40 + index * 15}px -15px rgba(0,0,0,${0.15 + index * 0.05}),
            0 ${5 + index * 2}px ${15 + index * 5}px -5px rgba(0,0,0,${0.1 + index * 0.03})
          `,
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default ScrollCard;
