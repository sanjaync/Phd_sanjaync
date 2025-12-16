/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useMemo, useEffect, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Cylinder, Environment, Cloud, Sparkles } from "@react-three/drei";
import * as THREE from "three";
import "../types";

// ------------------------------
// 2D Balance Animation (SVG) — clean, centered, no title
// ------------------------------
const OptimalityBalance2D: React.FC = () => {
  const [angle, setAngle] = useState(0);

  useEffect(() => {
    let raf = 0;
    const start = performance.now();

    const loop = (now: number) => {
      const t = (now - start) / 1000;

      // Gentle “weight-scale” rocking: ±5°
      const a = Math.sin(t * 0.85) * (5 * Math.PI / 180);
      setAngle(a);

      raf = requestAnimationFrame(loop);
    };

    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  const deg = (angle * 180) / Math.PI;
  const panCounterDeg = -deg;

  // small gravity-like drop
  const drop = 8;
  const leftDrop = deg > 0 ? drop : 0;
  const rightDrop = deg > 0 ? 0 : drop;

  return (
    <div className="w-full h-full flex items-center justify-center bg-[#F5F4F0]">
      <svg viewBox="0 0 700 420" className="w-full h-full">
        <defs>
          <filter id="txtShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="1" stdDeviation="1.2" floodColor="rgba(0,0,0,0.22)" />
          </filter>
        </defs>

        <style>
          {`
            .label {
              font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial;
              font-weight: 700;
              fill: #ffffff;
              stroke: rgba(0,0,0,0.35);
              stroke-width: 3.2px;
              paint-order: stroke fill;
              filter: url(#txtShadow);
              letter-spacing: 0.2px;
            }
            .symbol {
              font-family: ui-serif, Georgia, "Times New Roman", Times, serif;
              font-weight: 800;
              fill: #ffffff;
              stroke: rgba(0,0,0,0.35);
              stroke-width: 3.2px;
              paint-order: stroke fill;
              filter: url(#txtShadow);
            }
          `}
        </style>

        {/* Center the whole scale nicely */}
        <g transform="translate(0 10)">
          {/* Stand (static) */}
          <g>
            <line x1="350" y1="105" x2="350" y2="310" stroke="#2F3B37" strokeWidth="14" strokeLinecap="round" />
            <line x1="265" y1="310" x2="435" y2="310" stroke="#2F3B37" strokeWidth="14" strokeLinecap="round" />
            <circle cx="350" cy="105" r="16" fill="#2F3B37" />
          </g>

          {/* Beam group rotates about pivot */}
          <g transform={`rotate(${deg} 350 105)`}>
            {/* Beam */}
            <line x1="170" y1="150" x2="530" y2="150" stroke="#2F3B37" strokeWidth="14" strokeLinecap="round" />

            {/* Left hangers */}
            <line x1="230" y1="150" x2="215" y2="245" stroke="#2F3B37" strokeWidth="6" strokeLinecap="round" />
            <line x1="280" y1="150" x2="265" y2="245" stroke="#2F3B37" strokeWidth="6" strokeLinecap="round" />

            {/* Right hangers */}
            <line x1="420" y1="150" x2="435" y2="245" stroke="#2F3B37" strokeWidth="6" strokeLinecap="round" />
            <line x1="470" y1="150" x2="485" y2="245" stroke="#2F3B37" strokeWidth="6" strokeLinecap="round" />

            {/* LEFT PAN (blue) */}
            <g transform={`translate(250 ${252 + leftDrop}) rotate(${panCounterDeg}) translate(-250 -${252 + leftDrop})`}>
              <path
                d="M185 245 Q250 305 315 245"
                fill="none"
                stroke="#1F6FB2"
                strokeWidth="14"
                strokeLinecap="round"
              />
              <path
                d="M195 250 Q250 295 305 250 L305 292 Q250 332 195 292 Z"
                fill="#1F6FB2"
                opacity="0.96"
              />
              <text x="250" y="278" textAnchor="middle" fontSize="24" className="symbol">
                ⟨T⟩
              </text>
              <text x="250" y="310" textAnchor="middle" fontSize="20" className="label">
                Water uptake
              </text>
            </g>

            {/* RIGHT PAN (purple) */}
            <g transform={`translate(450 ${252 + rightDrop}) rotate(${panCounterDeg}) translate(-450 -${252 + rightDrop})`}>
              <path
                d="M385 245 Q450 305 515 245"
                fill="none"
                stroke="#6B2D5C"
                strokeWidth="14"
                strokeLinecap="round"
              />
              <path
                d="M395 250 Q450 295 505 250 L505 292 Q450 332 395 292 Z"
                fill="#6B2D5C"
                opacity="0.96"
              />
              <text x="450" y="278" textAnchor="middle" fontSize="24" className="symbol">
                ⟨θ⟩
              </text>
              <text x="450" y="310" textAnchor="middle" fontSize="20" className="label">
                Water stress
              </text>
            </g>
          </g>
        </g>
      </svg>
    </div>
  );
};

// --- PARTICLES (RAIN) ---
const Rain = ({ count = 200 }: { count?: number }) => {
  const mesh = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const particles = useMemo(() => {
    return Array.from({ length: count }).map(() => ({
      speed: 0.1 + Math.random() * 0.1,
      xOffset: Math.random() * 30 - 15,
      zOffset: Math.random() * 30 - 15,
      yOffset: Math.random() * 30,
    }));
  }, [count]);

  useFrame(() => {
    if (!mesh.current) return;
    particles.forEach((p, i) => {
      p.yOffset -= p.speed;
      if (p.yOffset < -5) p.yOffset = 25;

      dummy.position.set(p.xOffset, p.yOffset, p.zOffset);
      dummy.rotation.z = 0.1;
      dummy.scale.set(0.02, 0.8, 0.02);
      dummy.updateMatrix();
      mesh.current!.setMatrixAt(i, dummy.matrix);
    });
    mesh.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, count]}>
      <cylinderGeometry args={[0.05, 0.05, 1]} />
      <meshBasicMaterial color="#AEC6CF" transparent opacity={0.32} />
    </instancedMesh>
  );
};

// --- STYLIZED TREE (for hero scene) ---
const Tree = ({
  position,
  scale = 1,
  color = "#556B2F",
}: {
  position: [number, number, number];
  scale?: number;
  color?: string;
}) => {
  return (
    <group position={position} scale={scale}>
      <Cylinder args={[0.08, 0.15, 1.5, 7]} position={[0, 0.75, 0]} castShadow receiveShadow>
        <meshStandardMaterial color="#5D4037" roughness={1} />
      </Cylinder>

      <group>
        <Cylinder args={[0, 0.9, 1.4, 7]} position={[0, 1.6, 0]} castShadow receiveShadow>
          <meshStandardMaterial color={color} roughness={0.8} />
        </Cylinder>
        <Cylinder args={[0, 0.7, 1.2, 7]} position={[0, 2.3, 0]} rotation={[0, 0.5, 0]} castShadow receiveShadow>
          <meshStandardMaterial color={color} roughness={0.8} />
        </Cylinder>
        <Cylinder args={[0, 0.5, 1.0, 7]} position={[0, 2.9, 0]} rotation={[0, 1, 0]} castShadow receiveShadow>
          <meshStandardMaterial color={color} roughness={0.8} />
        </Cylinder>
      </group>
    </group>
  );
};

// --- HERO SCENE (unchanged 3D) ---
export const EcoHeroScene: React.FC = () => {
  return (
    <div className="absolute inset-0 z-0 opacity-100 pointer-events-none">
      <Canvas camera={{ position: [0, 3, 10], fov: 35 }} shadows>
        <color attach="background" args={["#F9F8F4"]} />
        <ambientLight intensity={0.8} />
        <directionalLight
          position={[10, 10, 5]}
          intensity={1.2}
          color="#FFF8E7"
          castShadow
          shadow-mapSize={[1024, 1024]}
        />
        <fog attach="fog" args={["#F9F8F4", 5, 25]} />

        <Float speed={1.5} rotationIntensity={0.05} floatIntensity={0.2} floatingRange={[0, 0.5]}>
          <group position={[0, -1.5, 0]}>
            <Tree position={[0, 0, 0]} scale={1.3} />
            <Tree position={[-2.5, 0, -1.5]} scale={0.9} color="#6B8E23" />
            <Tree position={[2.5, 0, -1]} scale={1.1} color="#556B2F" />
            <Tree position={[-1.5, 0, 2]} scale={0.7} color="#8FBC8F" />
            <Tree position={[2, 0, 1.5]} scale={0.8} color="#6B8E23" />
          </group>
        </Float>

        <Sparkles count={50} scale={10} size={2} speed={0.4} opacity={0.5} color="#C5A059" />
        <Cloud opacity={0.3} speed={0.1} bounds={[20, 2, 2]} segments={10} position={[0, 5, -8]} color="#ececec" />
        <Rain count={100} />
        <Environment preset="park" blur={1} />
      </Canvas>
    </div>
  );
};

// --- WATER BALANCE SCENE (2D, clean) ---
export const WaterBalanceScene: React.FC = () => {
  return (
    <div className="w-full h-full absolute inset-0">
      <OptimalityBalance2D />
    </div>
  );
};
