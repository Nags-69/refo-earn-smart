import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface ScrollCardProps {
  children: React.ReactNode;
  index: number;
  totalCards?: number;
  className?: string;
}

const ScrollCard = ({ children, index, className }: ScrollCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [scale, setScale] = useState(1);

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
      const topOffset = 60 + index * 20;
      
      // Calculate how much the card is "stuck" at the top
      // When the card is at its sticky position, reduce scale based on distance from viewport top
      if (rect.top <= topOffset + 10) {
        // Card is stuck - calculate scale based on how far it is from ideal position
        const distanceFromTop = Math.max(0, topOffset - rect.top + 50);
        const scaleReduction = Math.min(distanceFromTop / 800, 0.08); // Max 8% scale reduction
        setScale(1 - scaleReduction);
      } else {
        setScale(1);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [index]);

  // Each card sticks at a slightly higher position so they stack
  const topOffset = 60 + index * 20;

  return (
    <div
      ref={cardRef}
      className={cn(
        "sticky w-full max-w-5xl mx-auto origin-top",
        "transition-opacity duration-700 ease-[cubic-bezier(0.25,0.46,0.45,0.94)]",
        isVisible 
          ? "opacity-100" 
          : "opacity-0 translate-y-16",
        className
      )}
      style={{
        top: `${topOffset}px`,
        zIndex: 10 + index,
        transform: `scale(${scale})`,
        transition: 'transform 0.15s ease-out, opacity 0.7s cubic-bezier(0.25,0.46,0.45,0.94)',
      }}
    >
      <div 
        className="rounded-3xl transition-shadow duration-300"
        style={{
          boxShadow: `0 ${10 + index * 5}px ${30 + index * 10}px -10px rgba(0,0,0,${0.2 + index * 0.05})`,
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default ScrollCard;