import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface ScrollCardProps {
  children: React.ReactNode;
  index: number;
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
        threshold: 0.1,
        rootMargin: "-10px",
      }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Calculate top offset for stacking effect - each card stacks 20px lower
  const topOffset = 20 + index * 20;

  return (
    <div
      ref={cardRef}
      className={cn(
        "sticky w-full max-w-5xl mx-auto transition-all duration-700 ease-out",
        isVisible 
          ? "opacity-100 translate-y-0 scale-100" 
          : "opacity-0 translate-y-20 scale-[0.98]",
        className
      )}
      style={{
        top: `${topOffset}px`,
        zIndex: 10 + index,
      }}
    >
      {children}
    </div>
  );
};

export default ScrollCard;