'use client';

import { useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float, MeshDistortMaterial, PresentationControls, Sparkles } from '@react-three/drei';
import type { Group, Mesh } from 'three';
import type { Theme } from '@/lib/theme';

const ACCENT = '#6366f1';
const ACCENT_LIGHT = '#a5b4fc';
const CYAN = '#22d3ee';

/** The glowing, liquid core. Hover makes it ripple harder, click changes its colour. */
function Core({ light }: { light: boolean }) {
  const mesh = useRef<Mesh>(null);
  const shell = useRef<Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const [alt, setAlt] = useState(false);

  useFrame((_, delta) => {
    if (mesh.current) {
      mesh.current.rotation.y += delta * 0.25;
      const target = hovered ? 1.12 : 1;
      const s = mesh.current.scale.x + (target - mesh.current.scale.x) * Math.min(1, delta * 6);
      mesh.current.scale.setScalar(s);
    }
    if (shell.current) {
      shell.current.rotation.y -= delta * 0.12;
      shell.current.rotation.x += delta * 0.06;
    }
  });

  return (
    <group>
      <mesh
        ref={mesh}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        onClick={() => setAlt((v) => !v)}
      >
        <icosahedronGeometry args={[1.25, 24]} />
        <MeshDistortMaterial
          color={alt ? CYAN : ACCENT}
          emissive={alt ? '#0e7490' : '#312e81'}
          emissiveIntensity={0.6}
          roughness={0.15}
          metalness={0.7}
          distort={hovered ? 0.55 : 0.35}
          speed={hovered ? 3.5 : 1.8}
        />
      </mesh>
      {/* Wireframe shell */}
      <mesh ref={shell}>
        <icosahedronGeometry args={[1.95, 1]} />
        <meshBasicMaterial color={light ? '#4f46e5' : ACCENT_LIGHT} wireframe transparent opacity={light ? 0.28 : 0.16} />
      </mesh>
    </group>
  );
}

/** A thin ring with a small "satellite" travelling around it. */
function Orbit({
  radius,
  tilt,
  speed,
  color,
}: {
  radius: number;
  tilt: [number, number, number];
  speed: number;
  color: string;
}) {
  const pivot = useRef<Group>(null);
  useFrame((_, delta) => {
    if (pivot.current) pivot.current.rotation.z += delta * speed;
  });

  return (
    <group rotation={tilt}>
      <mesh>
        <torusGeometry args={[radius, 0.008, 8, 128]} />
        <meshBasicMaterial color={color} transparent opacity={0.45} />
      </mesh>
      <group ref={pivot}>
        <mesh position={[radius, 0, 0]}>
          <sphereGeometry args={[0.075, 16, 16]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={2.5} />
        </mesh>
      </group>
    </group>
  );
}

/** Small shapes drifting around the core. */
function FloatingShapes() {
  return (
    <>
      <Float speed={2} rotationIntensity={1.6} floatIntensity={1.4}>
        <mesh position={[-2.6, 1.5, -0.6]}>
          <octahedronGeometry args={[0.32]} />
          <meshStandardMaterial color={CYAN} roughness={0.2} metalness={0.8} />
        </mesh>
      </Float>
      <Float speed={1.6} rotationIntensity={2} floatIntensity={1.2}>
        <mesh position={[2.7, -1.3, -0.4]}>
          <torusGeometry args={[0.26, 0.1, 16, 32]} />
          <meshStandardMaterial color="#f472b6" roughness={0.25} metalness={0.7} />
        </mesh>
      </Float>
      <Float speed={1.8} rotationIntensity={1.4} floatIntensity={1.6}>
        <mesh position={[2.3, 1.9, -1]}>
          <boxGeometry args={[0.36, 0.36, 0.36]} />
          <meshStandardMaterial color={ACCENT_LIGHT} roughness={0.2} metalness={0.8} />
        </mesh>
      </Float>
      <Float speed={2.2} rotationIntensity={1.8} floatIntensity={1.2}>
        <mesh position={[-2.2, -1.8, 0.2]}>
          <tetrahedronGeometry args={[0.3]} />
          <meshStandardMaterial color="#fbbf24" roughness={0.3} metalness={0.6} />
        </mesh>
      </Float>
    </>
  );
}

/** Leans the whole scene gently toward the pointer and keeps it inside the canvas. */
function PointerRig({ children }: { children: React.ReactNode }) {
  const group = useRef<Group>(null);
  // Shrink the scene on narrow canvases so the outer ring always fits.
  const viewportWidth = useThree((state) => state.viewport.width);
  const scale = Math.max(0.5, Math.min(1, viewportWidth / 7.2));
  useFrame((state, delta) => {
    if (!group.current) return;
    const k = Math.min(1, delta * 3);
    group.current.rotation.y += (state.pointer.x * 0.25 - group.current.rotation.y) * k;
    group.current.rotation.x += (-state.pointer.y * 0.18 - group.current.rotation.x) * k;
  });
  return (
    <group ref={group} scale={scale}>
      {children}
    </group>
  );
}

export default function HeroScene({ active = true, theme = 'dark' }: { active?: boolean; theme?: Theme }) {
  const light = theme === 'light';
  return (
    <Canvas
      dpr={[1, 1.75]}
      camera={{ position: [0, 0, 7.5], fov: 42 }}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      frameloop={active ? 'always' : 'never'}
    >
      <ambientLight intensity={0.5} />
      <directionalLight position={[4, 5, 5]} intensity={2.2} />
      <pointLight position={[-5, -2, 2]} intensity={40} color={CYAN} />
      <pointLight position={[5, 3, -3]} intensity={40} color="#f472b6" />

      <PointerRig>
        <PresentationControls
          global={false}
          cursor
          snap
          polar={[-0.5, 0.5]}
          azimuth={[-1, 1]}
          config={{ mass: 1, tension: 170, friction: 22 }}
        >
          <Core light={light} />
          <Orbit radius={2.35} tilt={[Math.PI / 2.3, 0.2, 0]} speed={0.6} color={ACCENT_LIGHT} />
          <Orbit radius={2.75} tilt={[Math.PI / 1.7, -0.6, 0.3]} speed={-0.4} color={CYAN} />
          <Orbit radius={3.1} tilt={[Math.PI / 3.2, 0.9, -0.2]} speed={0.28} color="#f472b6" />
          <FloatingShapes />
        </PresentationControls>
      </PointerRig>

      <Sparkles count={90} scale={[10, 7, 6]} size={light ? 3 : 2.2} speed={0.35} color={light ? '#6366f1' : ACCENT_LIGHT} opacity={light ? 0.55 : 0.7} />
    </Canvas>
  );
}
