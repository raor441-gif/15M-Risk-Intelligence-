import React, { useEffect, useRef } from 'react';

interface DynamicBackgroundProps {
  /**
   * 'full': high-impact prominence for the public Landing Page / Welcome Screen.
   * 'subtle': restrained, soft-contrast ambient treatment for the application dashboard.
   */
  variant?: 'full' | 'subtle';
}

interface Point3D {
  x: number;
  y: number;
  z: number;
  size: number;
  baseAlpha: number;
  pulseSpeed: number;
  pulsePhase: number;
}

interface OrbitRing {
  radiusX: number;
  radiusY: number;
  tiltAngle: number;
  rotationY: number;
  speed: number;
  color: string;
  particlePos: number;
  particleSpeed: number;
}

interface NetworkArc {
  p1: { lat: number; lon: number };
  p2: { lat: number; lon: number };
  packetPos: number;
  speed: number;
  color: string;
}

export const DynamicBackground: React.FC<DynamicBackgroundProps> = ({
  variant = 'subtle',
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = 0;
    let height = 0;
    let globeRadius = 0;
    let globeCenterX = 0;
    let globeCenterY = 0;

    // Check prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Global rotation state
    let angleY = 0;
    const rotationSpeed = prefersReducedMotion ? 0 : 0.0018;

    // 1. Generate 3D Globe Surface Points (representing global supply nodes and continental clusters)
    const points: Point3D[] = [];
    const numPoints = 280;

    // Golden spiral point distribution on sphere for uniform aesthetic coverage
    const phi = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < numPoints; i++) {
      const y = 1 - (i / (numPoints - 1)) * 2; // from 1 to -1
      const radiusAtY = Math.sqrt(1 - y * y);
      const theta = phi * i;

      const x = Math.cos(theta) * radiusAtY;
      const z = Math.sin(theta) * radiusAtY;

      // Group some into denser clusters simulating Europe, Asia-Pacific, North America
      const isHub = i % 8 === 0;

      points.push({
        x,
        y,
        z,
        size: isHub ? 2.4 : 1.2,
        baseAlpha: isHub ? 0.9 : 0.45,
        pulseSpeed: 0.02 + Math.random() * 0.03,
        pulsePhase: Math.random() * Math.PI * 2,
      });
    }

    // 2. Orbital Rings (elliptical trajectories around the globe)
    const orbits: OrbitRing[] = [
      {
        radiusX: 1.25,
        radiusY: 0.42,
        tiltAngle: -0.45,
        rotationY: 0,
        speed: 0.002,
        color: '#00D2FF',
        particlePos: 0.1,
        particleSpeed: 0.004,
      },
      {
        radiusX: 1.42,
        radiusY: 0.38,
        tiltAngle: 0.62,
        rotationY: 0,
        speed: -0.0015,
        color: '#19B6A4',
        particlePos: 0.6,
        particleSpeed: 0.0035,
      },
      {
        radiusX: 1.15,
        radiusY: 0.55,
        tiltAngle: 0.18,
        rotationY: 0,
        speed: 0.0012,
        color: '#00A6CC',
        particlePos: 0.85,
        particleSpeed: 0.005,
      },
    ];

    // 3. Network Connection Arcs between strategic coordinates
    const arcs: NetworkArc[] = [
      // Sweden (Nordvolt) -> Netherlands (Sourcing Champions HQ)
      { p1: { lat: 64, lon: 20 }, p2: { lat: 52, lon: 4.9 }, packetPos: 0, speed: 0.007, color: '#19B6A4' },
      // Taiwan (Hexaprime) -> Germany (Munich)
      { p1: { lat: 24, lon: 121 }, p2: { lat: 48, lon: 11.5 }, packetPos: 0.3, speed: 0.006, color: '#00D2FF' },
      // India (Sundara) -> Netherlands
      { p1: { lat: 20, lon: 85 }, p2: { lat: 52, lon: 4.9 }, packetPos: 0.6, speed: 0.005, color: '#00A6CC' },
      // Portugal (Tavira) -> Germany
      { p1: { lat: 41, lon: -8.6 }, p2: { lat: 48, lon: 11.5 }, packetPos: 0.8, speed: 0.008, color: '#10B981' },
      // Singapore -> Amsterdam
      { p1: { lat: 1.3, lon: 103.8 }, p2: { lat: 52, lon: 4.9 }, packetPos: 0.45, speed: 0.0055, color: '#00D2FF' },
    ];

    // Convert lat/lon to sphere x,y,z
    const latLonToVec3 = (lat: number, lon: number) => {
      const phi = (90 - lat) * (Math.PI / 180);
      const theta = (lon + 180) * (Math.PI / 180);
      return {
        x: -(Math.sin(phi) * Math.cos(theta)),
        y: Math.cos(phi),
        z: Math.sin(phi) * Math.sin(theta),
      };
    };

    // 4. Ambient Floating Dust Particles
    const dustParticles: Array<{ x: number; y: number; vx: number; vy: number; r: number; alpha: number }> = [];
    for (let i = 0; i < 50; i++) {
      dustParticles.push({
        x: Math.random(),
        y: Math.random(),
        vx: (Math.random() - 0.5) * 0.0003,
        vy: (Math.random() - 0.5) * 0.0003,
        r: Math.random() * 1.5 + 0.5,
        alpha: Math.random() * 0.5 + 0.2,
      });
    }

    // Resize handler
    const handleResize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.scale(dpr, dpr);

      // Positioning: Large abstract globe on the left
      // For mobile: centered or slightly tucked to the top/left
      // For desktop: partially off-screen on the left
      if (width < 768) {
        globeRadius = Math.min(width, height) * 0.48;
        globeCenterX = width * 0.35;
        globeCenterY = height * 0.4;
      } else if (width < 1280) {
        globeRadius = Math.min(width, height) * 0.58;
        globeCenterX = width * 0.22;
        globeCenterY = height * 0.52;
      } else {
        globeRadius = Math.min(width, height) * 0.64;
        globeCenterX = width * 0.18;
        globeCenterY = height * 0.52;
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    // Visibility change handler to save battery / CPU when tab is hidden
    let isTabVisible = true;
    const handleVisibilityChange = () => {
      isTabVisible = !document.hidden;
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Global opacity multiplier based on variant
    // Full on landing/welcome; subtle on dashboard to preserve 100% data legibility
    const opacityMult = variant === 'full' ? 1.0 : 0.42;

    // Render loop
    const render = () => {
      if (!isTabVisible) {
        animationFrameId = requestAnimationFrame(render);
        return;
      }

      ctx.clearRect(0, 0, width, height);

      // 1. Deep Midnight Navy Background Gradient with subtle radial underglow
      const bgGrad = ctx.createLinearGradient(0, 0, width, height);
      bgGrad.addColorStop(0, '#040B16'); // Near black navy
      bgGrad.addColorStop(0.5, '#071526'); // Deep midnight navy
      bgGrad.addColorStop(1, '#0A1C30'); // Oceanic deep navy
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Globe atmospheric glow on the left
      const atmosphereGlow = ctx.createRadialGradient(
        globeCenterX,
        globeCenterY,
        globeRadius * 0.2,
        globeCenterX,
        globeCenterY,
        globeRadius * 1.5
      );
      atmosphereGlow.addColorStop(0, `rgba(0, 166, 204, ${0.16 * opacityMult})`);
      atmosphereGlow.addColorStop(0.5, `rgba(25, 182, 164, ${0.08 * opacityMult})`);
      atmosphereGlow.addColorStop(0.85, `rgba(2, 89, 123, ${0.04 * opacityMult})`);
      atmosphereGlow.addColorStop(1, 'rgba(4, 11, 22, 0)');

      ctx.fillStyle = atmosphereGlow;
      ctx.beginPath();
      ctx.arc(globeCenterX, globeCenterY, globeRadius * 1.5, 0, Math.PI * 2);
      ctx.fill();

      // Subtle globe horizon silhouette
      const horizonGrad = ctx.createRadialGradient(
        globeCenterX - globeRadius * 0.3,
        globeCenterY - globeRadius * 0.3,
        globeRadius * 0.1,
        globeCenterX,
        globeCenterY,
        globeRadius
      );
      horizonGrad.addColorStop(0, `rgba(0, 132, 168, ${0.18 * opacityMult})`);
      horizonGrad.addColorStop(0.7, `rgba(10, 28, 48, ${0.25 * opacityMult})`);
      horizonGrad.addColorStop(1, `rgba(0, 210, 255, ${0.04 * opacityMult})`);

      ctx.fillStyle = horizonGrad;
      ctx.beginPath();
      ctx.arc(globeCenterX, globeCenterY, globeRadius, 0, Math.PI * 2);
      ctx.fill();

      // Outer globe rim glow ring
      ctx.strokeStyle = `rgba(0, 210, 255, ${0.25 * opacityMult})`;
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.arc(globeCenterX, globeCenterY, globeRadius, 0, Math.PI * 2);
      ctx.stroke();

      // Tilted axis rotation
      const tilt = 0.41; // ~23.5 degrees tilt
      const cosTilt = Math.cos(tilt);
      const sinTilt = Math.sin(tilt);

      const cosY = Math.cos(angleY);
      const sinY = Math.sin(angleY);

      // Helper function to project a 3D unit point onto 2D screen
      const projectPoint = (vec: { x: number; y: number; z: number }) => {
        // Y-axis rotation
        const rx = vec.x * cosY - vec.z * sinY;
        const rz = vec.x * sinY + vec.z * cosY;
        const ry = vec.y;

        // Tilted axis (Z/X tilt)
        const ty = ry * cosTilt - rz * sinTilt;
        const tz = ry * sinTilt + rz * cosTilt;

        // Perspective depth
        const fov = 3.2;
        const scale = fov / (fov + tz);

        return {
          px: globeCenterX + rx * globeRadius * scale,
          py: globeCenterY + ty * globeRadius * scale,
          scale,
          z: tz,
          isFront: tz > -0.2,
        };
      };

      // 2. Render Latitude & Longitude Digital Grid Rings
      ctx.lineWidth = 0.75;
      const latSteps = [-0.6, -0.3, 0, 0.3, 0.6];
      for (const lat of latSteps) {
        const ringRad = Math.sqrt(1 - lat * lat);
        ctx.beginPath();
        let first = true;
        for (let a = 0; a <= Math.PI * 2 + 0.1; a += 0.12) {
          const pt = projectPoint({
            x: Math.cos(a) * ringRad,
            y: lat,
            z: Math.sin(a) * ringRad,
          });
          if (pt.isFront) {
            if (first) {
              ctx.moveTo(pt.px, pt.py);
              first = false;
            } else {
              ctx.lineTo(pt.px, pt.py);
            }
          } else {
            first = true;
          }
        }
        ctx.strokeStyle = `rgba(0, 166, 204, ${0.08 * opacityMult})`;
        ctx.stroke();
      }

      // 3. Render Network Connection Arcs between Global Procurement Hubs
      for (const arc of arcs) {
        const v1 = latLonToVec3(arc.p1.lat, arc.p1.lon);
        const v2 = latLonToVec3(arc.p2.lat, arc.p2.lon);

        const proj1 = projectPoint(v1);
        const proj2 = projectPoint(v2);

        if (proj1.isFront || proj2.isFront) {
          // Mid-point arched in 3D above the surface
          const midVec = {
            x: (v1.x + v2.x) * 0.58,
            y: (v1.y + v2.y) * 0.58,
            z: (v1.z + v2.z) * 0.58,
          };
          const dist = Math.hypot(midVec.x, midVec.y, midVec.z) || 1;
          const arcElevation = 1.25; // Arches above globe
          midVec.x = (midVec.x / dist) * arcElevation;
          midVec.y = (midVec.y / dist) * arcElevation;
          midVec.z = (midVec.z / dist) * arcElevation;

          const projMid = projectPoint(midVec);

          // Draw quadratic curve
          ctx.beginPath();
          ctx.moveTo(proj1.px, proj1.py);
          ctx.quadraticCurveTo(projMid.px, projMid.py, proj2.px, proj2.py);
          ctx.strokeStyle = `rgba(0, 210, 255, ${0.22 * opacityMult})`;
          ctx.lineWidth = 1;
          ctx.stroke();

          // Animate light packet traveling along the arc
          if (!prefersReducedMotion) {
            arc.packetPos = (arc.packetPos + arc.speed) % 1;
          }
          const t = arc.packetPos;
          // Quadratic Bezier interpolation
          const pktX = (1 - t) * (1 - t) * proj1.px + 2 * (1 - t) * t * projMid.px + t * t * proj2.px;
          const pktY = (1 - t) * (1 - t) * proj1.py + 2 * (1 - t) * t * projMid.py + t * t * proj2.py;

          // Glowing packet dot + trail
          ctx.fillStyle = '#FFFFFF';
          ctx.beginPath();
          ctx.arc(pktX, pktY, 2.2, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = `rgba(0, 210, 255, ${0.7 * opacityMult})`;
          ctx.beginPath();
          ctx.arc(pktX, pktY, 4.5, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // 4. Render 3D Globe Particle Points (Supply Nodes)
      for (const pt of points) {
        const proj = projectPoint(pt);

        // Pulse calculation
        pt.pulsePhase += pt.pulseSpeed;
        const pulse = 0.8 + Math.sin(pt.pulsePhase) * 0.2;

        // Depth-based opacity (closer to camera is brighter)
        const depthAlpha = Math.max(0.08, (proj.z + 1) * 0.5);
        const finalAlpha = pt.baseAlpha * depthAlpha * pulse * opacityMult;

        if (proj.isFront) {
          ctx.fillStyle = `rgba(0, 210, 255, ${finalAlpha})`;
          ctx.beginPath();
          ctx.arc(proj.px, proj.py, pt.size * proj.scale * pulse, 0, Math.PI * 2);
          ctx.fill();

          // Hub nodes have a subtle halo
          if (pt.size > 2) {
            ctx.fillStyle = `rgba(25, 182, 164, ${finalAlpha * 0.4})`;
            ctx.beginPath();
            ctx.arc(proj.px, proj.py, pt.size * proj.scale * 2.2, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }

      // 5. Render Glowing Elliptical Orbits with Moving Light Trails
      for (const orbit of orbits) {
        ctx.save();
        ctx.translate(globeCenterX, globeCenterY);
        ctx.rotate(orbit.tiltAngle);

        // Orbit ellipse path
        ctx.beginPath();
        const rx = globeRadius * orbit.radiusX;
        const ry = globeRadius * orbit.radiusY;
        ctx.ellipse(0, 0, rx, ry, 0, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(0, 166, 204, ${0.18 * opacityMult})`;
        ctx.lineWidth = 1;
        ctx.stroke();

        // Animate satellite photon along ellipse
        if (!prefersReducedMotion) {
          orbit.particlePos = (orbit.particlePos + orbit.particleSpeed) % 1;
        }
        const angle = orbit.particlePos * Math.PI * 2;
        const px = Math.cos(angle) * rx;
        const py = Math.sin(angle) * ry;

        // Light trail (fading segment behind particle)
        const trailLength = 0.12;
        const trailSteps = 10;
        for (let i = 0; i < trailSteps; i++) {
          const trailAngle = angle - (i / trailSteps) * trailLength * Math.PI * 2;
          const tx = Math.cos(trailAngle) * rx;
          const ty = Math.sin(trailAngle) * ry;
          const trailAlpha = (1 - i / trailSteps) * 0.5 * opacityMult;

          ctx.fillStyle = `rgba(0, 210, 255, ${trailAlpha})`;
          ctx.beginPath();
          ctx.arc(tx, ty, 1.8 * (1 - i / trailSteps) + 0.8, 0, Math.PI * 2);
          ctx.fill();
        }

        // Glowing Photon Head
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.arc(px, py, 2.5, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = `rgba(25, 182, 164, ${0.8 * opacityMult})`;
        ctx.beginPath();
        ctx.arc(px, py, 5.5, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
      }

      // 6. Ambient Floating Dust Particles (Micro-stars in deep space)
      for (const p of dustParticles) {
        if (!prefersReducedMotion) {
          p.x += p.vx;
          p.y += p.vy;
          if (p.x < 0) p.x = 1;
          if (p.x > 1) p.x = 0;
          if (p.y < 0) p.y = 1;
          if (p.y > 1) p.y = 0;
        }

        ctx.fillStyle = `rgba(0, 166, 204, ${p.alpha * 0.4 * opacityMult})`;
        ctx.beginPath();
        ctx.arc(p.x * width, p.y * height, p.r, 0, Math.PI * 2);
        ctx.fill();
      }

      // Advance rotation angle
      if (!prefersReducedMotion) {
        angleY += rotationSpeed;
      }

      animationFrameId = requestAnimationFrame(render);
    };

    // Kick off animation loop
    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [variant]);

  return (
    <div 
      className={`fixed inset-0 pointer-events-none z-0 overflow-hidden select-none transition-opacity duration-700 ${
        variant === 'full' ? 'opacity-100' : 'opacity-35'
      }`} 
      aria-hidden="true"
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full block"
      />
    </div>
  );
};
