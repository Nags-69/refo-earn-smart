import { useEffect, useRef } from "react";

interface Dot {
  x: number;
  y: number;
  originX: number;
  originY: number;
  radius: number;
  color: string;
  phase: number;
  speed: number;
  depth: number; // For parallax - 0 to 1, where 0 is far and 1 is close
}

const AnimatedBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const scrollYRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let dots: Dot[] = [];
    let mouseX = -1000;
    let mouseY = -1000;
    let time = 0;

    const colors = [
      "hsla(217, 91%, 60%, 0.7)",   // Blue
      "hsla(262, 83%, 58%, 0.7)",   // Purple
      "hsla(330, 81%, 60%, 0.7)",   // Pink
      "hsla(199, 89%, 48%, 0.7)",   // Cyan
      "hsla(173, 80%, 40%, 0.7)",   // Teal
      "hsla(271, 76%, 53%, 0.7)",   // Violet
    ];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initDots();
    };

    const initDots = () => {
      const dotCount = Math.floor((canvas.width * canvas.height) / 5000);
      dots = [];
      
      for (let i = 0; i < dotCount; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height * 3; // Extend vertically for scroll
        const depth = Math.random(); // Random depth for parallax
        
        dots.push({
          x,
          y,
          originX: x,
          originY: y,
          radius: Math.random() * 1.5 + 0.8 + depth * 0.5, // Closer dots are slightly larger
          color: colors[Math.floor(Math.random() * colors.length)],
          phase: Math.random() * Math.PI * 2,
          speed: Math.random() * 0.5 + 0.3,
          depth,
        });
      }
    };

    const drawDot = (d: Dot) => {
      // Apply parallax offset based on scroll and depth
      const parallaxFactor = 0.3 + d.depth * 0.4; // 0.3 to 0.7 - closer dots move faster
      const parallaxY = d.y - scrollYRef.current * parallaxFactor;
      
      // Only draw if visible in viewport
      if (parallaxY < -50 || parallaxY > canvas.height + 50) return;
      
      // Adjust opacity based on depth for extra depth feel
      const opacity = 0.4 + d.depth * 0.4;
      const colorWithOpacity = d.color.replace(/[\d.]+\)$/, `${opacity})`);
      
      ctx.beginPath();
      ctx.arc(d.x, parallaxY, d.radius, 0, Math.PI * 2);
      ctx.fillStyle = colorWithOpacity;
      ctx.fill();
    };

    const updateDot = (d: Dot) => {
      const floatX = Math.sin(time * d.speed + d.phase) * 15;
      const floatY = Math.cos(time * d.speed * 0.8 + d.phase) * 12;
      
      let targetX = d.originX + floatX;
      let targetY = d.originY + floatY;
      
      // Adjust mouse interaction for parallax
      const parallaxFactor = 0.3 + d.depth * 0.4;
      const adjustedY = d.y - scrollYRef.current * parallaxFactor;
      
      const dx = d.x - mouseX;
      const dy = adjustedY - mouseY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const maxDist = 120;

      if (dist < maxDist && dist > 0) {
        const force = (maxDist - dist) / maxDist;
        const pushX = (dx / dist) * force * 60;
        const pushY = (dy / dist) * force * 60;
        targetX += pushX;
        targetY += pushY;
      }
      
      d.x += (targetX - d.x) * 0.08;
      d.y += (targetY - d.y) * 0.08;
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      time += 0.02;
      
      // Sort dots by depth so farther dots render first
      const sortedDots = [...dots].sort((a, b) => a.depth - b.depth);
      
      sortedDots.forEach(d => {
        updateDot(d);
        drawDot(d);
      });
      
      animationId = requestAnimationFrame(animate);
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    const handleMouseLeave = () => {
      mouseX = -1000;
      mouseY = -1000;
    };

    const handleScroll = () => {
      scrollYRef.current = window.scrollY;
    };

    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseleave", handleMouseLeave);
    window.addEventListener("scroll", handleScroll, { passive: true });

    resize();
    animate();

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("scroll", handleScroll);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
    />
  );
};

export default AnimatedBackground;