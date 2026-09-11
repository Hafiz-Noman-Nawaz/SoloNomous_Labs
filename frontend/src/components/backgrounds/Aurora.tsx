'use client';

import React, { useEffect, useRef } from 'react';
import { Renderer, Program, Mesh, Color, Triangle } from 'ogl';
import './Aurora.css';

const VERT = `#version 300 es
in vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

const FRAG = `#version 300 es
precision highp float;

uniform float uTime;
uniform float uAmplitude;
uniform vec3 uColorStops[3];
uniform vec2 uResolution;
uniform float uBlend;

out vec4 fragColor;

vec3 permute(vec3 x) {
  return mod(((x * 34.0) + 1.0) * x, 289.0);
}

float snoise(vec2 v) {
  const vec4 C = vec4(
      0.211324865405187, 0.366025403784439,
      -0.577350269189626, 0.024390243902439
  );
  vec2 i  = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod(i, 289.0);

  vec3 p = permute(
      permute(i.y + vec3(0.0, i1.y, 1.0))
    + i.x + vec3(0.0, i1.x, 1.0)
  );

  vec3 m = max(
      0.5 - vec3(
          dot(x0, x0),
          dot(x12.xy, x12.xy),
          dot(x12.zw, x12.zw)
      ), 
      0.0
  );
  m = m * m;
  m = m * m;

  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);

  vec3 g;
  g.x  = a0.x  * x0.x  + h.x  * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

void main() {
  vec2 uv = gl_FragCoord.xy / uResolution.xy;

  // Horizontal gradient ramp across the 3 brand color stops
  vec3 c0 = uColorStops[0];
  vec3 c1 = uColorStops[1];
  vec3 c2 = uColorStops[2];
  
  vec3 ramp;
  if (uv.x < 0.5) {
    ramp = mix(c0, c1, uv.x * 2.0);
  } else {
    ramp = mix(c1, c2, (uv.x - 0.5) * 2.0);
  }

  // Harmonic wave calculations with simplex noise displacement
  float w1 = sin(uv.x * 3.5 + uTime * 0.7) * 0.16 * uAmplitude;
  float w2 = cos(uv.x * 5.2 - uTime * 0.5) * 0.09 * uAmplitude;
  float noise = snoise(vec2(uv.x * 2.0 + uTime * 0.15, uv.y * 1.5 + uTime * 0.08)) * 0.18 * uAmplitude;

  // Primary ribbon centered in upper-mid viewport
  float center1 = 0.50 + w1 + w2 + noise;
  float dist1 = abs(uv.y - center1);
  float ribbonWidth1 = 0.40 + uBlend * 0.20;
  float glow1 = smoothstep(ribbonWidth1, 0.0, dist1);
  glow1 = pow(glow1, 1.3);

  // Secondary undulating ribbon for rich multilayered depth
  float w3 = cos(uv.x * 4.0 + uTime * 0.6) * 0.14 * uAmplitude;
  float center2 = 0.65 + w3 + noise * 0.7;
  float dist2 = abs(uv.y - center2);
  float glow2 = smoothstep(0.32, 0.0, dist2);
  glow2 = pow(glow2, 1.5);

  float totalIntensity = clamp(glow1 * 0.85 + glow2 * 0.55, 0.0, 1.0);

  vec3 finalColor = mix(ramp, c1, glow2 * 0.4);

  // Visible, elegant alpha intensity on light background (#F8FAFC)
  float alpha = clamp(totalIntensity * 0.50, 0.0, 0.75);

  // Premultiplied alpha output for clean WebGL blending
  fragColor = vec4(finalColor * alpha, alpha);
}
`;

export interface AuroraProps {
  colorStops?: string[];
  amplitude?: number;
  blend?: number;
  speed?: number;
  className?: string;
  style?: React.CSSProperties;
}

export const Aurora: React.FC<AuroraProps> = ({
  colorStops = ['#7C3AED', '#0284C7', '#D946EF'],
  amplitude = 1.0,
  blend = 0.55,
  speed = 0.8,
  className = '',
  style
}) => {
  const ctnDom = useRef<HTMLDivElement>(null);
  const propsRef = useRef({ colorStops, amplitude, blend, speed });
  propsRef.current = { colorStops, amplitude, blend, speed };

  useEffect(() => {
    const ctn = ctnDom.current;
    if (!ctn) return;

    let renderer: Renderer;
    try {
      renderer = new Renderer({
        alpha: true,
        premultipliedAlpha: true,
        antialias: true,
        dpr: Math.min(window.devicePixelRatio || 1, 2)
      });
    } catch (e) {
      console.warn('WebGL initialization failed for Aurora:', e);
      return;
    }

    const gl = renderer.gl;
    if (!gl) return;

    gl.clearColor(0, 0, 0, 0);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    const canvas = gl.canvas as HTMLCanvasElement;
    canvas.style.backgroundColor = 'transparent';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.display = 'block';

    let program: Program;

    const colorStopsArray = colorStops.map(hex => {
      const c = new Color(hex);
      return [c.r, c.g, c.b];
    });

    const geometry = new Triangle(gl);
    if ((geometry.attributes as any).uv) {
      delete (geometry.attributes as any).uv;
    }

    program = new Program(gl, {
      vertex: VERT,
      fragment: FRAG,
      uniforms: {
        uTime: { value: 0 },
        uAmplitude: { value: amplitude },
        uColorStops: { value: colorStopsArray },
        uResolution: { value: new Float32Array([1, 1]) },
        uBlend: { value: blend }
      }
    });

    const mesh = new Mesh(gl, { geometry, program });
    ctn.appendChild(canvas);

    const resize = () => {
      if (!ctn) return;
      const width = Math.max(1, Math.floor(ctn.offsetWidth));
      const height = Math.max(1, Math.floor(ctn.offsetHeight));
      renderer.setSize(width, height);
      if (program) {
        const res = program.uniforms.uResolution.value as Float32Array;
        res[0] = gl.drawingBufferWidth;
        res[1] = gl.drawingBufferHeight;
      }
      renderer.render({ scene: mesh });
    };

    window.addEventListener('resize', resize, { passive: true });
    const ro = new ResizeObserver(resize);
    ro.observe(ctn);
    resize();

    let animateId = 0;
    let isVisible = true;
    let isPageVisible = !document.hidden;

    const update = (t: number) => {
      const curSpeed = propsRef.current.speed ?? speed;
      program.uniforms.uTime.value = t * 0.001 * curSpeed * 0.45;
      program.uniforms.uAmplitude.value = propsRef.current.amplitude ?? amplitude;
      program.uniforms.uBlend.value = propsRef.current.blend ?? blend;
      const stops = propsRef.current.colorStops ?? colorStops;
      program.uniforms.uColorStops.value = stops.map(hex => {
        const c = new Color(hex);
        return [c.r, c.g, c.b];
      });
      renderer.render({ scene: mesh });
      animateId = requestAnimationFrame(update);
    };

    const tryStart = () => {
      if (isVisible && isPageVisible && animateId === 0) animateId = requestAnimationFrame(update);
    };
    const tryStop = () => {
      if (animateId !== 0) {
        cancelAnimationFrame(animateId);
        animateId = 0;
      }
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
        isVisible ? tryStart() : tryStop();
      },
      { threshold: 0 }
    );
    io.observe(ctn);

    const onVisibility = () => {
      isPageVisible = !document.hidden;
      isPageVisible ? tryStart() : tryStop();
    };
    document.addEventListener('visibilitychange', onVisibility);

    tryStart();

    return () => {
      tryStop();
      ro.disconnect();
      io.disconnect();
      window.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', onVisibility);
      try {
        if (ctn.contains(canvas)) {
          ctn.removeChild(canvas);
        }
      } catch {}
      gl.getExtension('WEBGL_lose_context')?.loseContext();
    };
  }, [amplitude, blend]);

  return <div ref={ctnDom} className={`aurora-container ${className}`.trim()} style={style} />;
};

export default Aurora;
