'use client';

import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  radius: number;
  vx: number;
  vy: number;
  alpha: number;
  color: string;
}

export const HeroFlaskCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = 440);
    let height = (canvas.height = 480);

    let mouse = { x: width / 2, y: height / 2, targetX: width / 2, targetY: height / 2 };
    let waveOffset = 0;

    // Generate floating energy & bubble particles
    const particles: Particle[] = [];
    const colors = ['#A78BFA', '#8B5CF6', '#C4B5FD', '#7C3AED', '#EDE9FE'];

    for (let i = 0; i < 35; i++) {
      particles.push({
        x: 180 + Math.random() * 80,
        y: 260 + Math.random() * 120,
        radius: 1.5 + Math.random() * 2.5,
        vx: (Math.random() - 0.5) * 0.8,
        vy: -0.6 - Math.random() * 1.4,
        alpha: 0.3 + Math.random() * 0.7,
        color: colors[Math.floor(Math.random() * colors.length)]
      });
    }

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.targetX = e.clientX - rect.left;
      mouse.targetY = e.clientY - rect.top;
    };

    window.addEventListener('mousemove', handleMouseMove);

    const render = () => {
      // Smooth mouse follow
      mouse.x += (mouse.targetX - mouse.x) * 0.05;
      mouse.y += (mouse.targetY - mouse.y) * 0.05;

      const tilt = ((mouse.x - width / 2) / width) * 15;

      ctx.clearRect(0, 0, width, height);

      // 1. Ambient laboratory glow
      const radialGlow = ctx.createRadialGradient(
        width / 2 + tilt,
        280,
        10,
        width / 2,
        280,
        180
      );
      radialGlow.addColorStop(0, 'rgba(139, 92, 246, 0.22)');
      radialGlow.addColorStop(0.5, 'rgba(124, 58, 237, 0.08)');
      radialGlow.addColorStop(1, 'rgba(9, 8, 14, 0)');
      ctx.fillStyle = radialGlow;
      ctx.fillRect(0, 0, width, height);

      // Save state for flask rotation tilt
      ctx.save();
      ctx.translate(width / 2, 240);
      ctx.rotate((tilt * Math.PI) / 180);
      ctx.translate(-width / 2, -240);

      // Flask Coordinates
      const neckLeft = 195;
      const neckRight = 245;
      const neckTop = 90;
      const neckBottom = 190;
      const baseLeft = 110;
      const baseRight = 330;
      const baseBottom = 400;

      // 2. Liquid Body Inside Flask (Wave effect)
      ctx.save();
      // Clip to interior of flask
      ctx.beginPath();
      ctx.moveTo(neckLeft + 4, neckBottom);
      ctx.lineTo(baseLeft + 6, baseBottom - 8);
      ctx.quadraticCurveTo(baseLeft + 6, baseBottom, baseLeft + 25, baseBottom);
      ctx.lineTo(baseRight - 25, baseBottom);
      ctx.quadraticCurveTo(baseRight - 6, baseBottom, baseRight - 6, baseBottom - 8);
      ctx.lineTo(neckRight - 4, neckBottom);
      ctx.closePath();
      ctx.clip();

      // Liquid gradient
      const liquidGrad = ctx.createLinearGradient(0, 260, 0, baseBottom);
      liquidGrad.addColorStop(0, 'rgba(167, 139, 250, 0.7)');
      liquidGrad.addColorStop(0.6, 'rgba(124, 58, 237, 0.85)');
      liquidGrad.addColorStop(1, 'rgba(88, 28, 135, 0.95)');

      // Draw undulating liquid surface
      waveOffset += 0.04;
      ctx.beginPath();
      const liquidSurfaceY = 270;
      ctx.moveTo(baseLeft, baseBottom);
      ctx.lineTo(baseLeft, liquidSurfaceY);
      for (let x = baseLeft; x <= baseRight; x += 10) {
        const y = liquidSurfaceY + Math.sin((x + waveOffset * 60) * 0.03) * 6;
        ctx.lineTo(x, y);
      }
      ctx.lineTo(baseRight, baseBottom);
      ctx.closePath();
      ctx.fillStyle = liquidGrad;
      ctx.fill();

      // 3. Render and animate interior bubbles
      particles.forEach((p) => {
        p.y += p.vy;
        p.x += p.vx + Math.sin(waveOffset + p.y * 0.05) * 0.3;

        // Reset bubble if it rises above liquid
        if (p.y < liquidSurfaceY) {
          p.y = baseBottom - 10 - Math.random() * 20;
          p.x = 170 + Math.random() * 100;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.fill();
      });
      ctx.globalAlpha = 1.0;

      ctx.restore(); // Exit liquid clip

      // 4. Flask Glass Outline with High-Precision Laboratory Lines
      ctx.strokeStyle = 'rgba(167, 139, 250, 0.6)';
      ctx.lineWidth = 3;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      ctx.beginPath();
      // Lip rim
      ctx.ellipse(width / 2, neckTop, 30, 7, 0, 0, Math.PI * 2);
      ctx.stroke();

      // Flask walls
      ctx.beginPath();
      ctx.moveTo(neckLeft, neckTop);
      ctx.lineTo(neckLeft, neckBottom);
      ctx.lineTo(baseLeft, baseBottom - 12);
      ctx.quadraticCurveTo(baseLeft, baseBottom, baseLeft + 25, baseBottom);
      ctx.lineTo(baseRight - 25, baseBottom);
      ctx.quadraticCurveTo(baseRight, baseBottom, baseRight, baseBottom - 12);
      ctx.lineTo(neckRight, neckBottom);
      ctx.lineTo(neckRight, neckTop);
      ctx.stroke();

      // 5. Volume measurement ticks on neck
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
      ctx.lineWidth = 1.5;
      for (let i = 0; i < 4; i++) {
        const tickY = neckTop + 25 + i * 18;
        ctx.beginPath();
        ctx.moveTo(neckLeft + 6, tickY);
        ctx.lineTo(neckLeft + (i % 2 === 0 ? 16 : 10), tickY);
        ctx.stroke();
      }

      // 6. Specular reflection curve (light reflection on glass)
      const reflectionGrad = ctx.createLinearGradient(0, 160, 0, 380);
      reflectionGrad.addColorStop(0, 'rgba(255, 255, 255, 0.45)');
      reflectionGrad.addColorStop(0.5, 'rgba(255, 255, 255, 0.15)');
      reflectionGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');

      ctx.beginPath();
      ctx.moveTo(neckLeft + 6, neckBottom + 10);
      ctx.lineTo(baseLeft + 20, baseBottom - 25);
      ctx.strokeStyle = reflectionGrad;
      ctx.lineWidth = 4;
      ctx.stroke();

      ctx.restore(); // Restore tilt

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div className="relative flex items-center justify-center select-none pointer-events-auto">
      {/* Outer ambient pulsing halo */}
      <div className="absolute inset-0 bg-purple-600/10 blur-3xl rounded-full scale-90 -z-10 animate-pulse-subtle" />
      <canvas
        ref={canvasRef}
        className="w-[320px] h-[350px] sm:w-[380px] sm:h-[420px] md:w-[440px] md:h-[480px] max-w-full drop-shadow-[0_20px_50px_rgba(124,58,237,0.25)]"
      />
    </div>
  );
};
