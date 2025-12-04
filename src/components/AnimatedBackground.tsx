import { useEffect, useRef } from "react";

interface Dash {
  x: number;
  y: number;
  originX: number;
  originY: number;
  angle: number;
  length: number;
  opacity: number;
}

const AnimatedBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let dashes: Dash[] = [];
    let mouseX = -1000;
    let mouseY = -1000;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initDashes();
    };

    const initDashes = () => {
      const dashCount = Math.floor((canvas.width * canvas.height) / 8000);
      dashes = [];
      
      for (let i = 0; i < dashCount; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        dashes.push({
          x,
          y,
          originX: x,
          originY: y,
          angle: Math.random() * Math.PI * 2,
          length: Math.random() * 12 + 6,
          opacity: Math.random() * 0.5 + 0.3,
        });
      }
    };

    const drawDash = (d: Dash) => {
      ctx.save();
      ctx.translate(d.x, d.y);
      ctx.rotate(d.angle);
      ctx.beginPath();
      ctx.moveTo(-d.length / 2, 0);
      ctx.lineTo(d.length / 2, 0);
      ctx.strokeStyle = `hsla(217, 91%, 60%, ${d.opacity})`;
      ctx.lineWidth = 2;
      ctx.lineCap = "round";
      ctx.stroke();
      ctx.restore();
    };

    const updateDash = (d: Dash) => {
      const dx = d.x - mouseX;
      const dy = d.y - mouseY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const maxDist = 200;

      if (dist < maxDist && dist > 0) {
        // Push away from cursor
        const force = (maxDist - dist) / maxDist;
        const pushX = (dx / dist) * force * 60;
        const pushY = (dy / dist) * force * 60;
        d.x = d.originX + pushX;
        d.y = d.originY + pushY;
        
        // Rotate towards movement direction
        const targetAngle = Math.atan2(pushY, pushX);
        d.angle += (targetAngle - d.angle) * 0.1;
      } else {
        // Return to origin smoothly
        d.x += (d.originX - d.x) * 0.05;
        d.y += (d.originY - d.y) * 0.05;
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      dashes.forEach(d => {
        updateDash(d);
        drawDash(d);
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

    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseleave", handleMouseLeave);

    resize();
    animate();

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
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
