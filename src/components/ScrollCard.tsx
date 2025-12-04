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
      const topOffset = 80 + index * 30;
      
      if (rect.top <= topOffset + 20) {
        const distanceFromTop = Math.max(0, topOffset - rect.top + 80);
        const scaleReduction = Math.min(distanceFromTop / 500, 0.1);
        setScale(1 - scaleReduction);
      } else {
        setScale(1);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [index]);

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
        transition: 'transform 0.2s ease-out, opacity 0.7s cubic-bezier(0.25,0.46,0.45,0.94)',
      }}
    >
      <div 
        className="rounded-3xl transition-shadow duration-300 overflow-hidden"
        style={{
          boxShadow: `0 ${15 + index * 8}px ${40 + index * 15}px -15px rgba(0,0,0,${0.12 + index * 0.04})`,
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default ScrollCard;
