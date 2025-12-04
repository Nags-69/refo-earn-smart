import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface ScrollCardProps {
  children: React.ReactNode;
  index: number;
  totalCards: number;
  className?: string;
}

const ScrollCard = ({ children, index, totalCards, className }: ScrollCardProps) => {
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
        threshold: 0.1,
        rootMargin: "0px",
      }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Each card sticks at a slightly higher position so they stack
  const topOffset = 40 + index * 30;

  return (
    <div
      ref={cardRef}
      className={cn(
        "sticky w-full max-w-5xl mx-auto transition-all duration-500 ease-out",
        isVisible 
          ? "opacity-100 translate-y-0" 
          : "opacity-0 translate-y-10",
        className
      )}
      style={{
        top: `${topOffset}px`,
        zIndex: 10 + index,
        marginBottom: index < totalCards - 1 ? '100vh' : '0',
      }}
    >
      {children}
    </div>
  );
};

export default ScrollCard;