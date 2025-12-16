/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  Environment,
  Float,
  Sparkles,
  Line,
  Html,
} from "@react-three/drei";
import * as THREE from "three";
import "../types";

// ------------------------------
// Helpers
// ------------------------------
function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

type RootSegment = {
  a: THREE.Vector3;
  b: THREE.Vector3;
  r0: number;
  r1: number;
  phase: number;
  strength: number;
};

// ------------------------------
// Simple plant stem + leaves (stylized but not cartoon)
// ------------------------------
const Plant: React.FC = () => {
  const stemRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (stemRef.current) {
      stemRef.current.rotation.z = Math.sin(t * 0.6) * 0.04;
    }
  });

  return (
    <group position={[0, 0.15, 0]}>
      {/* stem */}
      <mesh ref={stemRef} position={[0, 0.6, 0]}>
        <cylinderGeometry args={[0.035, 0.05, 1.2, 18]} />
        <meshStandardMaterial color="#2f4f3a" roughness={0.8} />
      </mesh>

      {/* leaves (simple planes) */}
      {[
        { p: [0.18, 0.85, 0.02], r: [0, 0.2, 0.9] },
        { p: [-0.18, 0.7, -0.02], r: [0, -0.2, -0.9] },
        { p: [0.15, 0.55, -0.03], r: [0, 0.4, 0.6] },
      ].map((L, i) => (
        <mesh key={i} position={L.p as any} rotation={L.r as any}>
          <planeGeometry args={[0.34, 0.18]} />
          <meshStandardMaterial
            color="#3f7a4b"
            roughness={0.7}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}

      {/* small canopy hint */}
      <mesh position={[0, 1.25, 0]}>
        <sphereGeometry args={[0.35, 24, 24]} />
        <meshStandardMaterial color="#4b8a56" roughness={0.85} transparent opacity={0.45} />
      </mesh>
    </group>
  );
};

// ------------------------------
// Procedural branching roots (looks like roots, not a single line)
// ------------------------------
const Roots: React.FC<{ depth?: number }> = ({ depth = 1.9 }) => {
  const group = useRef<THREE.Group>(null);

  // Build a root graph: 1 taproot + laterals + sub-laterals
  const segments: RootSegment[] = useMemo(() => {
    const segs: RootSegment[] = [];
    const origin = new THREE.Vector3(0, 0.15, 0);

    // taproot backbone
    const tapCount = 9;
    let prev = origin.clone();
    for (let i = 1; i <= tapCount; i++) {
      const y = origin.y - (depth * i) / tapCount;
      const wobble = (i / tapCount) * 0.12;
      const next = new THREE.Vector3(
        Math.sin(i * 0.9) * wobble,
        y,
        Math.cos(i * 0.7) * wobble * 0.6
      );
      segs.push({
        a: prev.clone(),
        b: next.clone(),
        r0: lerp(0.06, 0.02, (i - 1) / tapCount),
        r1: lerp(0.05, 0.015, i / tapCount),
        phase: Math.random() * Math.PI * 2,
        strength: 0.35,
      });
      prev = next;
    }

    // laterals from several tap nodes
    const lateralAnchors = [2, 3, 4, 6, 7];
    lateralAnchors.forEach((idx, k) => {
      const anchorT = idx / tapCount;
      const anchor = new THREE.Vector3(
        Math.sin(idx * 0.9) * (anchorT * 0.12),
        origin.y - depth * anchorT,
        Math.cos(idx * 0.7) * (anchorT * 0.12) * 0.6
      );

      const side = k % 2 === 0 ? 1 : -1;
      const baseLen = lerp(0.6, 0.25, anchorT);
      const branches = 2 + (k % 2);

      for (let b = 0; b < branches; b++) {
        const ang = side * lerp(0.9, 1.4, Math.random());
        const tiltDown = lerp(0.15, 0.45, Math.random());
        const len = baseLen * lerp(0.75, 1.1, Math.random());

        const end = new THREE.Vector3(
          anchor.x + Math.cos(ang) * len,
          anchor.y - tiltDown * len,
          anchor.z + Math.sin(ang) * (len * 0.45)
        );

        segs.push({
          a: anchor.clone(),
          b: end.clone(),
          r0: lerp(0.03, 0.015, anchorT),
          r1: lerp(0.02, 0.008, anchorT),
          phase: Math.random() * Math.PI * 2,
          strength: 0.55,
        });

        // sub-laterals from lateral
        const subCount = 2 + (Math.random() > 0.5 ? 1 : 0);
        for (let s = 0; s < subCount; s++) {
          const t = lerp(0.35, 0.85, Math.random());
          const mid = new THREE.Vector3().lerpVectors(anchor, end, t);
          const subAng = ang + side * lerp(0.6, 1.0, Math.random()) * 0.5;
          const subLen = len * lerp(0.25, 0.45, Math.random());

          const subEnd = new THREE.Vector3(
            mid.x + Math.cos(subAng) * subLen,
            mid.y - subLen * lerp(0.25, 0.55, Math.random()),
            mid.z + Math.sin(subAng) * (subLen * 0.45)
          );

          segs.push({
            a: mid.clone(),
            b: subEnd.clone(),
            r0: lerp(0.012, 0.006, anchorT),
            r1: lerp(0.007, 0.003, anchorT),
            phase: Math.random() * Math.PI * 2,
            strength: 0.8,
          });
        }
      }
    });

    return segs;
  }, [depth]);

  // animate roots subtly (alive, not wiggly cartoon)
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (!group.current) return;
    group.current.rotation.y = Math.sin(t * 0.15) * 0.08;
  });

  return (
    <group ref={group} position={[0, 0, 0]}>
      {segments.map((seg, i) => (
        <RootTube key={i} seg={seg} />
      ))}

      {/* Uptake glow near fine roots (eco meaning) */}
      <mesh position={[0, -0.75, 0]}>
        <sphereGeometry args={[0.95, 24, 24]} />
        <meshStandardMaterial
          color="#2aa7ff"
          emissive="#2aa7ff"
          emissiveIntensity={0.55}
          transparent
          opacity={0.06}
        />
      </mesh>
    </group>
  );
};

const RootTube: React.FC<{ seg: RootSegment }> = ({ seg }) => {
  const ref = useRef<THREE.Mesh>(null);

  const curve = useMemo(() => {
    // add slight curvature for organic look
    const mid = new THREE.Vector3().addVectors(seg.a, seg.b).multiplyScalar(0.5);
    mid.x += (seg.b.x - seg.a.x) * 0.15;
    mid.z += (seg.b.z - seg.a.z) * 0.15;
    return new THREE.CatmullRomCurve3([seg.a, mid, seg.b]);
  }, [seg.a, seg.b]);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (!ref.current) return;
    // tiny breathing scale (very subtle)
    const s = 1 + Math.sin(t * 0.8 + seg.phase) * 0.01 * seg.strength;
    ref.current.scale.set(s, s, s);
  });

  const geom = useMemo(() => {
    // fewer segments for performance, still smooth
    return new THREE.TubeGeometry(curve, 14, seg.r0, 8, false);
  }, [curve, seg.r0]);

  return (
    <mesh ref={ref} geometry={geom} castShadow receiveShadow>
      <meshStandardMaterial
        color="#6b4f3f"
        roughness={0.95}
        metalness={0}
      />
    </mesh>
  );
};

// ------------------------------
// Soil block + subtle moisture gradient
// ------------------------------
const Soil: React.FC = () => {
  return (
    <group>
      {/* soil body */}
      <mesh position={[0, -1.1, 0]} receiveShadow>
        <boxGeometry args={[6.2, 2.6, 3.2]} />
        <meshStandardMaterial color="#8b5a3c" roughness={1} />
      </mesh>

      {/* top soil layer */}
      <mesh position={[0, -0.05, 0]} receiveShadow>
        <boxGeometry args={[6.25, 0.25, 3.25]} />
        <meshStandardMaterial color="#b07a53" roughness={1} />
      </mesh>

      {/* subtle “moist” deeper zone */}
      <mesh position={[0, -1.65, 0]}>
        <boxGeometry args={[6.22, 1.2, 3.22]} />
        <meshStandardMaterial
          color="#3b6f8b"
          transparent
          opacity={0.08}
          roughness={0.2}
        />
      </mesh>
    </group>
  );
};

// ------------------------------
// Flux arrows (2D-ish lines in 3D space)
// ------------------------------
const FluxArrows: React.FC = () => {
  const ref = useRef<THREE.Group>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (!ref.current) return;
    // gentle pulsation in opacity via scale
    const s = 1 + Math.sin(t * 1.2) * 0.03;
    ref.current.scale.set(s, s, s);
  });

  return (
    <group ref={ref}>
      {/* upward flux (T) */}
      <Line
        points={[
          new THREE.Vector3(0.05, -0.7, 0.3),
          new THREE.Vector3(0.05, 0.15, 0.3),
          new THREE.Vector3(0.05, 0.95, 0.3),
        ]}
        color="#2a7bb8"
        lineWidth={2}
        dashed
        dashSize={0.2}
        gapSize={0.12}
      />
      {/* small arrows near canopy (E0 demand) */}
      <Line
        points={[
          new THREE.Vector3(0.65, 1.05, 0.25),
          new THREE.Vector3(1.15, 1.25, 0.2),
        ]}
        color="#5aa6d6"
        lineWidth={2}
      />
      <Line
        points={[
          new THREE.Vector3(0.55, 0.85, 0.25),
          new THREE.Vector3(1.05, 1.05, 0.2),
        ]}
        color="#5aa6d6"
        lineWidth={2}
      />

      {/* optional labels (small, unobtrusive) */}
      <Html position={[0.1, 0.75, 0.35]} center style={{ pointerEvents: "none" }}>
        <div className="text-[11px] font-semibold text-sky-700 bg-white/70 backdrop-blur px-2 py-1 rounded-full border border-sky-200 shadow-sm">
          Water Flux (T)
        </div>
      </Html>
      <Html position={[1.15, 1.35, 0.2]} center style={{ pointerEvents: "none" }}>
        <div className="text-[11px] font-semibold text-sky-700 bg-white/70 backdrop-blur px-2 py-1 rounded-full border border-sky-200 shadow-sm">
          Atmospheric Demand (E₀)
        </div>
      </Html>
      <Html position={[-1.3, -0.9, 0.25]} center style={{ pointerEvents: "none" }}>
        <div className="text-[11px] font-semibold text-amber-800 bg-white/70 backdrop-blur px-2 py-1 rounded-full border border-amber-200 shadow-sm">
          Water Supply (S)
        </div>
      </Html>
    </group>
  );
};

// ------------------------------
// HERO SCENE (eco-themed, clean)
// ------------------------------
export const HeroScene: React.FC = () => {
  return (
    <div className="absolute inset-0 z-0 opacity-100 pointer-events-none">
      <Canvas camera={{ position: [0, 0.9, 5.8], fov: 40 }} shadows>
        {/* soft sky */}
        <color attach="background" args={["#F9F8F4"]} />
        <fog attach="fog" args={["#F9F8F4", 5, 16]} />

        <ambientLight intensity={0.9} />
        <directionalLight position={[6, 7, 4]} intensity={1.2} castShadow />
        <directionalLight position={[-6, 3, -2]} intensity={0.35} />

        <Float speed={0.9} rotationIntensity={0.08} floatIntensity={0.12}>
          <group position={[0, -0.2, 0]}>
            <Soil />
            <Roots />
            <Plant />
            <FluxArrows />
          </group>
        </Float>

        {/* subtle detail */}
        <Sparkles count={55} scale={7} size={2} speed={0.35} opacity={0.28} />
        <Environment preset="park" blur={1} />
      </Canvas>
    </div>
  );
};

// ------------------------------
// Replaces “QuantumComputerScene” with Soil-Plant-Atmosphere “Reservoir Scene”
// (keeps the export name so your imports don’t break)
// ------------------------------
export const QuantumComputerScene: React.FC = () => {
  return (
    <div className="w-full h-full absolute inset-0">
      <Canvas camera={{ position: [0, 0.65, 5.0], fov: 42 }} shadows>
        <color attach="background" args={["#F5F4F0"]} />
        <fog attach="fog" args={["#F5F4F0", 4, 14]} />

        <ambientLight intensity={0.95} />
        <spotLight position={[4, 6, 4]} angle={0.35} penumbra={0.8} intensity={1.5} castShadow />
        <directionalLight position={[-4, 4, -3]} intensity={0.35} />

        <Float rotationIntensity={0.10} floatIntensity={0.10} speed={0.8}>
          <group position={[0, -0.35, 0]}>
            <Soil />
            <Roots depth={2.2} />
            <Plant />
            <FluxArrows />
          </group>
        </Float>

        <Sparkles count={35} scale={6} size={2} speed={0.25} opacity={0.22} />
        <Environment preset="sunset" blur={1} />
      </Canvas>
    </div>
  );
};
