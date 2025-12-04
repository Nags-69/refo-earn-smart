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

  // Each card sticks at a slightly higher position so they stack
  const topOffset = 60 + index * 20;

  return (
    <div
      ref={cardRef}
      className={cn(
        "sticky w-full max-w-5xl mx-auto",
        "transition-all duration-700 ease-[cubic-bezier(0.25,0.46,0.45,0.94)]",
        isVisible 
          ? "opacity-100 translate-y-0" 
          : "opacity-0 translate-y-16",
        className
      )}
      style={{
        top: `${topOffset}px`,
        zIndex: 10 + index,
      }}
    >
      <div 
        className="transition-shadow duration-500 rounded-3xl"
        style={{
          boxShadow: `0 ${10 + index * 5}px ${30 + index * 10}px -10px rgba(0,0,0,0.3)`,
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default ScrollCard;