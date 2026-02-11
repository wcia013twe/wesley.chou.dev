# Homepage Redesign Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Redesign the portfolio homepage with an interactive 3D geometric playground, hoverable feature cards, and practical animations creating a memorable first impression.

**Architecture:** Single-page scroll experience with three zones: (1) Hero with Three.js 3D canvas and text overlay, (2) Feature cards with hover effects using Framer Motion, (3) Compact footer. Uses existing design system (Tailwind, Headless UI) and adds React Three Fiber for 3D.

**Tech Stack:** React, TypeScript, Three.js, @react-three/fiber, @react-three/drei, Framer Motion, Tailwind CSS, React Router

---

## Setup Phase

### Task 1: Install Dependencies

**Files:**
- Modify: `package.json`

**Step 1: Install React Three Fiber ecosystem**

```bash
npm install @react-three/fiber @react-three/drei framer-motion
```

Expected: Packages installed successfully

**Step 2: Verify installation**

```bash
grep "@react-three" package.json
```

Expected: Shows @react-three/fiber and @react-three/drei in dependencies

**Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: install React Three Fiber and Framer Motion

Add dependencies for 3D geometric playground and animations.

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Component Building Phase

### Task 2: Create 3D Geometric Playground Component

**Files:**
- Create: `src/components/Hero3DPlayground.tsx`

**Step 1: Create base component with Three.js canvas**

```typescript
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { useRef } from 'react';

interface Hero3DPlaygroundProps {
  className?: string;
}

const Hero3DPlayground: React.FC<Hero3DPlaygroundProps> = ({ className }) => {
  return (
    <div className={`fixed inset-0 -z-10 ${className || ''}`}>
      <Canvas
        camera={{ position: [0, 0, 8], fov: 45 }}
        gl={{ alpha: true, antialias: true }}
      >
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        {/* Shapes will be added in next step */}
      </Canvas>
    </div>
  );
};

export default Hero3DPlayground;
```

**Step 2: Test component renders without errors**

Run: `npm run dev`
Navigate to: http://localhost:5173
Expected: Dev server starts, no console errors

**Step 3: Commit**

```bash
git add src/components/Hero3DPlayground.tsx
git commit -m "feat: add base 3D canvas component

Initialize Three.js canvas with React Three Fiber.

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

### Task 3: Add Floating Geometric Shapes

**Files:**
- Modify: `src/components/Hero3DPlayground.tsx`

**Step 1: Create FloatingShape component**

Add this inside Hero3DPlayground.tsx before the main component:

```typescript
import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import * as THREE from 'three';

interface FloatingShapeProps {
  geometry: 'box' | 'sphere' | 'torus' | 'icosahedron';
  position: [number, number, number];
  rotationSpeed: [number, number, number];
  material: 'standard' | 'wireframe';
}

const FloatingShape: React.FC<FloatingShapeProps> = ({
  geometry,
  position,
  rotationSpeed,
  material,
}) => {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += rotationSpeed[0] * delta;
      meshRef.current.rotation.y += rotationSpeed[1] * delta;
      meshRef.current.rotation.z += rotationSpeed[2] * delta;
    }
  });

  const renderGeometry = () => {
    switch (geometry) {
      case 'box':
        return <boxGeometry args={[1, 1, 1]} />;
      case 'sphere':
        return <sphereGeometry args={[0.6, 32, 32]} />;
      case 'torus':
        return <torusGeometry args={[0.6, 0.2, 16, 100]} />;
      case 'icosahedron':
        return <icosahedronGeometry args={[0.7, 0]} />;
    }
  };

  const renderMaterial = () => {
    if (material === 'wireframe') {
      return <meshBasicMaterial color="#9333ea" wireframe />;
    }
    return <meshStandardMaterial color="#a78bfa" metalness={0.5} roughness={0.2} />;
  };

  return (
    <mesh ref={meshRef} position={position}>
      {renderGeometry()}
      {renderMaterial()}
    </mesh>
  );
};
```

**Step 2: Add shapes to canvas**

Update the Canvas content in Hero3DPlayground component:

```typescript
<Canvas
  camera={{ position: [0, 0, 8], fov: 45 }}
  gl={{ alpha: true, antialias: true }}
>
  <ambientLight intensity={0.5} />
  <pointLight position={[10, 10, 10]} intensity={1} />

  {/* Floating shapes */}
  <FloatingShape
    geometry="box"
    position={[-3, 2, 0]}
    rotationSpeed={[0.5, 0.3, 0]}
    material="wireframe"
  />
  <FloatingShape
    geometry="sphere"
    position={[3, -1, -2]}
    rotationSpeed={[0.2, 0.4, 0.1]}
    material="standard"
  />
  <FloatingShape
    geometry="torus"
    position={[0, -2, 1]}
    rotationSpeed={[0.3, 0.2, 0.5]}
    material="wireframe"
  />
  <FloatingShape
    geometry="icosahedron"
    position={[-2, -1, -1]}
    rotationSpeed={[0.1, 0.5, 0.2]}
    material="standard"
  />
  <FloatingShape
    geometry="box"
    position={[2, 2, -1]}
    rotationSpeed={[0.4, 0.1, 0.3]}
    material="standard"
  />
</Canvas>
```

**Step 3: Test shapes render and rotate**

Run: `npm run dev`
Expected: See 5 rotating geometric shapes on screen

**Step 4: Commit**

```bash
git add src/components/Hero3DPlayground.tsx
git commit -m "feat: add floating geometric shapes

Add 5 rotating shapes (box, sphere, torus, icosahedron) with
wireframe and solid materials.

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

### Task 4: Add Mouse Parallax Effect

**Files:**
- Modify: `src/components/Hero3DPlayground.tsx`

**Step 1: Add mouse tracking state**

Add at the top of Hero3DPlayground component:

```typescript
import { useState, useEffect } from 'react';

const Hero3DPlayground: React.FC<Hero3DPlaygroundProps> = ({ className }) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: -(e.clientY / window.innerHeight) * 2 + 1,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);
```

**Step 2: Update FloatingShape to respond to mouse**

Modify FloatingShape component's useFrame:

```typescript
import { useSpring, animated } from '@react-spring/three';

const FloatingShape: React.FC<FloatingShapeProps & { mousePos: { x: number; y: number } }> = ({
  geometry,
  position,
  rotationSpeed,
  material,
  mousePos,
}) => {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (meshRef.current) {
      // Rotation
      meshRef.current.rotation.x += rotationSpeed[0] * delta;
      meshRef.current.rotation.y += rotationSpeed[1] * delta;
      meshRef.current.rotation.z += rotationSpeed[2] * delta;

      // Mouse parallax with elastic following
      const targetX = position[0] + mousePos.x * 0.5;
      const targetY = position[1] + mousePos.y * 0.5;

      meshRef.current.position.x += (targetX - meshRef.current.position.x) * 0.05;
      meshRef.current.position.y += (targetY - meshRef.current.position.y) * 0.05;
    }
  });
```

**Step 3: Pass mousePosition to all FloatingShape instances**

Update each FloatingShape to include `mousePos={mousePosition}` prop.

**Step 4: Test mouse parallax**

Run: `npm run dev`
Move mouse: Shapes should subtly follow cursor with elastic easing
Expected: Smooth parallax effect, not janky

**Step 5: Commit**

```bash
git add src/components/Hero3DPlayground.tsx
git commit -m "feat: add mouse parallax to 3D shapes

Shapes follow cursor with elastic physics for interactive feel.

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

### Task 5: Create FeatureCard Component

**Files:**
- Create: `src/components/FeatureCard.tsx`

**Step 1: Create base card with image background**

```typescript
import { motion } from 'framer-motion';
import { useState } from 'react';

interface FeatureCardProps {
  title: string;
  description: string;
  imageSrc: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ title, description, imageSrc }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      className="relative h-[400px] rounded-xl overflow-hidden cursor-pointer border border-purple-500/20"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
    >
      {/* Background Image */}
      <motion.div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${imageSrc})` }}
        animate={{ scale: isHovered ? 1.1 : 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="absolute inset-0 bg-black/40" />
      </motion.div>

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col justify-end p-6">
        <h3 className="text-3xl font-semibold text-white mb-4">{title}</h3>

        <motion.p
          className="text-lg text-white/90 leading-relaxed"
          initial={{ opacity: 0, height: 0 }}
          animate={{
            opacity: isHovered ? 1 : 0,
            height: isHovered ? 'auto' : 0
          }}
          transition={{ duration: 0.3 }}
        >
          {description}
        </motion.p>
      </div>
    </motion.div>
  );
};

export default FeatureCard;
```

**Step 2: Test component in isolation**

Create temporary test in HomePage to verify:
```tsx
<FeatureCard
  title="Test Card"
  description="Test description"
  imageSrc="assets/gallery/pfp.jpg"
/>
```

**Step 3: Verify hover effects work**

Run: `npm run dev`
Hover over card: Should elevate, zoom background, reveal description
Expected: Smooth 300ms transitions

**Step 4: Commit**

```bash
git add src/components/FeatureCard.tsx
git commit -m "feat: add FeatureCard with hover effects

Card elevates, zooms background, and reveals text on hover.

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

### Task 6: Add Scroll-Triggered Animations to Cards

**Files:**
- Modify: `src/components/FeatureCard.tsx`

**Step 1: Add Intersection Observer for scroll triggers**

```typescript
import { motion, useInView } from 'framer-motion';
import { useRef, useState } from 'react';

const FeatureCard: React.FC<FeatureCardProps> = ({ title, description, imageSrc }) => {
  const [isHovered, setIsHovered] = useState(false);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <motion.div
      ref={ref}
      className="relative h-[400px] rounded-xl overflow-hidden cursor-pointer border border-purple-500/20 shadow-lg hover:shadow-2xl"
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ y: -8 }}
    >
```

**Step 2: Test scroll animation**

Run: `npm run dev`
Scroll down: Cards should fade in with slight upward motion
Expected: Animation triggers at 20% visibility

**Step 3: Commit**

```bash
git add src/components/FeatureCard.tsx
git commit -m "feat: add scroll-triggered fade-in to cards

Cards animate into view when scrolled to.

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

### Task 7: Create ScrollIndicator Component

**Files:**
- Create: `src/components/ScrollIndicator.tsx`

**Step 1: Create animated scroll indicator**

```typescript
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

const ScrollIndicator: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setIsVisible(false);
      }
    };

    const timer = setTimeout(() => setIsVisible(false), 3000);

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(timer);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <motion.div
      className="fixed bottom-8 left-1/2 -translate-x-1/2 z-20 hidden md:block"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
        className="flex flex-col items-center gap-2 text-white/60"
      >
        <span className="text-sm">Scroll</span>
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </motion.div>
    </motion.div>
  );
};

export default ScrollIndicator;
```

**Step 2: Test indicator appears and disappears**

Run: `npm run dev`
Expected: Indicator bounces at bottom, fades after scroll or 3s

**Step 3: Commit**

```bash
git add src/components/ScrollIndicator.tsx
git commit -m "feat: add animated scroll indicator

Bouncing scroll prompt that fades on scroll or after 3s.

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Integration Phase

### Task 8: Redesign HomePage with New Components

**Files:**
- Modify: `src/pages/HomePage.tsx`

**Step 1: Import new components**

```typescript
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { MdEmail } from "react-icons/md";
import { FaArrowRight } from "react-icons/fa";
import Hero3DPlayground from "@/components/Hero3DPlayground";
import FeatureCard from "@/components/FeatureCard";
import ScrollIndicator from "@/components/ScrollIndicator";
import TextType from "@/components/TextType";
```

**Step 2: Replace HomePage content with new structure**

```typescript
const HomePage = () => {
  return (
    <div className="">
      <Helmet>
        <title>Home | Wesley Chou</title>
        <meta
          name="description"
          content="Portfolio of Wesley Chou - Software Engineer, AR Researcher, and Founder"
        />
      </Helmet>

      {/* 3D Background */}
      <Hero3DPlayground />

      {/* Hero Zone */}
      <section className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6">
        <motion.div
          className="text-center space-y-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-7xl font-bold text-white drop-shadow-lg">
            Hi, I'm Wesley Chou
          </h1>

          <div className="text-4xl text-white/90">
            <TextType
              text={[
                "Software Engineer",
                "AR Researcher",
                "Founder",
              ]}
              typingSpeed={50}
              pauseDuration={1500}
              showCursor={true}
              cursorCharacter="|"
            />
          </div>

          {/* CTA Buttons */}
          <motion.div
            className="flex flex-wrap gap-4 justify-center pt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Link to="/experience">
              <motion.button
                className="inline-flex items-center gap-2 px-6 py-4 text-xl font-semibold bg-purple-600 text-white rounded-lg shadow-lg hover:shadow-xl transition-shadow"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                View Experience
                <FaArrowRight />
              </motion.button>
            </Link>

            <a href="mailto:wcia013twe@gmail.com">
              <motion.button
                className="inline-flex items-center gap-2 px-6 py-4 text-xl font-semibold bg-transparent border-2 border-white text-white rounded-lg hover:bg-white/10 transition-colors"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                Contact Me
                <MdEmail />
              </motion.button>
            </a>
          </motion.div>
        </motion.div>

        <ScrollIndicator />
      </section>

      {/* Feature Cards Zone */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FeatureCard
            title="About Me"
            description="My name is Wei-Lin, but you can call me Wes! I'm a Computer Science senior at University of Central Florida, working at the intersection of software engineering, AI, and entrepreneurship."
            imageSrc="assets/gallery/pfp.jpg"
          />

          <FeatureCard
            title="My Journey"
            description="In my short two years at UCF, I have deepened my passion for technology, particularly through exploring machine learning, modern software development, and entrepreneurial ventures."
            imageSrc="assets/gallery/korea.jpg"
          />

          <FeatureCard
            title="My Interests"
            description="I am an outgoing engineer who is passionate about all things AI and latest tech trends. When I step away from the keyboard, I love hiking, volleyball, playing board games, or planning my next trip abroad!"
            imageSrc="assets/gallery/duck.jpeg"
          />
        </div>
      </section>
    </div>
  );
};

export default HomePage;
```

**Step 3: Remove old components no longer needed**

Remove imports for:
- `SplitText` (replaced with simpler animation)
- `FloatingScrollPrompt` (replaced with ScrollIndicator)
- `StickyGallery` (replaced with FeatureCard backgrounds)

**Step 4: Test complete homepage**

Run: `npm run dev`
Navigate to homepage
Expected:
- 3D shapes rotating and responding to mouse
- Hero text fades in with typewriter effect
- CTAs work (View Experience → /experience, Contact → mailto)
- Scroll indicator bounces then fades
- Feature cards fade in on scroll with hover effects

**Step 5: Commit**

```bash
git add src/pages/HomePage.tsx
git commit -m "feat: redesign homepage with 3D playground and feature cards

Replace old layout with interactive 3D background, simplified hero,
and hoverable feature cards. Remove SplitText, FloatingScrollPrompt,
and StickyGallery components.

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

### Task 9: Add Stagger Animation to Feature Cards

**Files:**
- Modify: `src/pages/HomePage.tsx`

**Step 1: Add stagger delay to cards**

Wrap the cards grid in a motion container with stagger children:

```typescript
<motion.div
  className="grid grid-cols-1 md:grid-cols-3 gap-6"
  initial="hidden"
  whileInView="visible"
  viewport={{ once: true, amount: 0.2 }}
  variants={{
    visible: {
      transition: {
        staggerChildren: 0.15,
      },
    },
  }}
>
```

**Step 2: Update FeatureCard to use parent variants**

Modify FeatureCard.tsx to accept and use variants from parent:

```typescript
// Remove the isInView logic, use parent-controlled animation instead
<motion.div
  variants={{
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  }}
  transition={{ duration: 0.6, ease: 'easeOut' }}
  // rest of props...
>
```

**Step 3: Test stagger effect**

Run: `npm run dev`
Scroll to cards: Should animate in sequence with 150ms delay
Expected: Smooth stagger, not all at once

**Step 4: Commit**

```bash
git add src/pages/HomePage.tsx src/components/FeatureCard.tsx
git commit -m "feat: add stagger animation to feature cards

Cards animate in sequence for polished effect.

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

### Task 10: Add Reduced Motion Support

**Files:**
- Modify: `src/components/Hero3DPlayground.tsx`
- Modify: `src/components/FeatureCard.tsx`
- Modify: `src/components/ScrollIndicator.tsx`

**Step 1: Add media query hook**

Create helper at top of Hero3DPlayground.tsx:

```typescript
const usePrefersReducedMotion = () => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  return prefersReducedMotion;
};
```

**Step 2: Disable mouse parallax when reduced motion preferred**

In Hero3DPlayground component:

```typescript
const prefersReducedMotion = usePrefersReducedMotion();

// In handleMouseMove, wrap with check:
useEffect(() => {
  if (prefersReducedMotion) return;

  const handleMouseMove = (e: MouseEvent) => {
    // ... existing code
  };
```

**Step 3: Pass reduced motion flag to shapes**

In FloatingShape's useFrame, skip parallax:

```typescript
if (!prefersReducedMotion) {
  const targetX = position[0] + mousePos.x * 0.5;
  const targetY = position[1] + mousePos.y * 0.5;

  meshRef.current.position.x += (targetX - meshRef.current.position.x) * 0.05;
  meshRef.current.position.y += (targetY - meshRef.current.position.y) * 0.05;
}
```

**Step 4: Update FeatureCard animations**

Replace complex transitions with simple fades:

```typescript
const prefersReducedMotion = usePrefersReducedMotion();

<motion.div
  animate={isInView ? { opacity: 1 } : { opacity: 0 }}
  whileHover={prefersReducedMotion ? {} : { y: -8 }}
  // ... rest
>
```

**Step 5: Hide ScrollIndicator for reduced motion**

```typescript
const prefersReducedMotion = usePrefersReducedMotion();
if (!isVisible || prefersReducedMotion) return null;
```

**Step 6: Test with reduced motion enabled**

In browser DevTools:
1. Open Command Palette (Cmd+Shift+P)
2. Type "Emulate CSS prefers-reduced-motion"
3. Select "prefers-reduced-motion: reduce"

Expected: No parallax, simple fades, no bounce

**Step 7: Commit**

```bash
git add src/components/Hero3DPlayground.tsx src/components/FeatureCard.tsx src/components/ScrollIndicator.tsx
git commit -m "feat: add reduced motion support

Respect prefers-reduced-motion by disabling parallax and complex
animations, using simple fades instead.

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

### Task 11: Optimize 3D Performance

**Files:**
- Modify: `src/components/Hero3DPlayground.tsx`

**Step 1: Add Intersection Observer to pause when offscreen**

```typescript
import { useInView } from 'framer-motion';

const Hero3DPlayground: React.FC<Hero3DPlaygroundProps> = ({ className }) => {
  const ref = useRef(null);
  const isInView = useInView(ref);

  return (
    <div ref={ref} className={`fixed inset-0 -z-10 ${className || ''}`}>
      <Canvas
        frameloop={isInView ? 'always' : 'demand'}
        // ... rest
      >
```

**Step 2: Add performance monitoring**

In FloatingShape, add will-change hint:

```typescript
<mesh
  ref={meshRef}
  position={position}
  // @ts-ignore - Three.js accepts style-like props
  style={{ willChange: 'transform' }}
>
```

**Step 3: Test performance**

Run: `npm run dev`
Open DevTools → Performance tab
Record while scrolling and moving mouse
Expected: Maintain 60fps, no dropped frames

**Step 4: Commit**

```bash
git add src/components/Hero3DPlayground.tsx
git commit -m "perf: optimize 3D rendering

Pause animation when offscreen, add will-change hints.

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

### Task 12: Add Mobile Device Tilt Support

**Files:**
- Modify: `src/components/Hero3DPlayground.tsx`

**Step 1: Add device orientation listener**

```typescript
const [deviceTilt, setDeviceTilt] = useState({ x: 0, y: 0 });

useEffect(() => {
  const handleOrientation = (e: DeviceOrientationEvent) => {
    if (e.beta !== null && e.gamma !== null) {
      // Normalize to -1 to 1 range
      const x = Math.max(-1, Math.min(1, e.gamma / 45));
      const y = Math.max(-1, Math.min(1, e.beta / 45));
      setDeviceTilt({ x, y });
    }
  };

  // Request permission on iOS 13+
  if (typeof DeviceOrientationEvent !== 'undefined' &&
      typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
    (DeviceOrientationEvent as any).requestPermission()
      .then((response: string) => {
        if (response === 'granted') {
          window.addEventListener('deviceorientation', handleOrientation);
        }
      });
  } else {
    window.addEventListener('deviceorientation', handleOrientation);
  }

  return () => window.removeEventListener('deviceorientation', handleOrientation);
}, []);
```

**Step 2: Use device tilt when mouse position is default**

```typescript
const effectivePosition = mousePosition.x === 0 && mousePosition.y === 0
  ? deviceTilt
  : mousePosition;

// Pass effectivePosition to FloatingShape components
```

**Step 3: Test on mobile device**

Run: `npm run dev`
Scan QR code from Vite dev server
Tilt device: Shapes should respond to device orientation
Expected: Smooth tilt response on mobile

**Step 4: Commit**

```bash
git add src/components/Hero3DPlayground.tsx
git commit -m "feat: add device tilt support for mobile

Shapes respond to device orientation on mobile devices.

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Polish Phase

### Task 13: Fix Email Link

**Files:**
- Modify: `src/pages/HomePage.tsx`

**Step 1: Update mailto link with user's email**

Replace placeholder email:

```typescript
<a href="mailto:wcia013twe@gmail.com">
```

Verify this matches the email in the resume or navbar.

**Step 2: Test mailto link**

Run: `npm run dev`
Click "Contact Me"
Expected: Opens default email client with correct address

**Step 3: Commit**

```bash
git add src/pages/HomePage.tsx
git commit -m "fix: use correct email in Contact Me button

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

### Task 14: Responsive Design Fixes

**Files:**
- Modify: `src/pages/HomePage.tsx`
- Modify: `src/components/FeatureCard.tsx`

**Step 1: Adjust hero text sizes for mobile**

```typescript
<h1 className="text-5xl md:text-7xl font-bold text-white drop-shadow-lg">
  Hi, I'm Wesley Chou
</h1>

<div className="text-2xl md:text-4xl text-white/90">
```

**Step 2: Adjust button sizes for mobile**

```typescript
<motion.button
  className="inline-flex items-center gap-2 px-4 py-3 md:px-6 md:py-4 text-lg md:text-xl font-semibold bg-purple-600 text-white rounded-lg shadow-lg hover:shadow-xl transition-shadow"
```

**Step 3: Test on mobile viewport**

Run: `npm run dev`
DevTools → Toggle device toolbar (Cmd+Shift+M)
Test iPhone SE, iPad, Desktop sizes
Expected: Text readable, buttons tappable, cards stack properly

**Step 4: Commit**

```bash
git add src/pages/HomePage.tsx
git commit -m "feat: improve mobile responsiveness

Adjust text and button sizes for smaller screens.

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

### Task 15: Final Testing and Build

**Files:**
- None (testing only)

**Step 1: Test all interactions**

Checklist:
- [ ] 3D shapes rotate smoothly
- [ ] Mouse parallax works on desktop
- [ ] Device tilt works on mobile
- [ ] Hero text fades in with typewriter
- [ ] View Experience navigates to /experience
- [ ] Contact Me opens email client
- [ ] Scroll indicator appears and fades
- [ ] Feature cards fade in on scroll
- [ ] Feature cards elevate and zoom on hover
- [ ] Reduced motion disables complex animations
- [ ] Mobile layout looks good
- [ ] No console errors

**Step 2: Run production build**

```bash
npm run build
```

Expected: Build succeeds with no errors

**Step 3: Test production build**

```bash
npm run preview
```

Navigate to preview URL
Test all interactions again
Expected: Everything works in production mode

**Step 4: Commit if any fixes needed**

If issues found, fix and commit:

```bash
git add <fixed-files>
git commit -m "fix: <description>

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Completion

### Task 16: Final Review and PR Preparation

**Files:**
- None (review only)

**Step 1: Review all commits**

```bash
git log --oneline origin/main..HEAD
```

Expected: ~15 commits with clear messages

**Step 2: Verify no untracked files**

```bash
git status
```

Expected: Working tree clean

**Step 3: Push branch**

```bash
git push -u origin feature/homepage-redesign
```

**Step 4: Create PR (optional)**

If using GitHub:
```bash
gh pr create --title "Homepage Redesign: Interactive 3D & Feature Cards" --body "$(cat <<'EOF'
## Summary
Redesigned homepage with interactive 3D geometric playground, hoverable feature cards, and practical animations.

## Changes
- Added 3D geometric shapes with mouse parallax using React Three Fiber
- Created hoverable feature cards with zoom effects
- Simplified hero with typewriter effect
- Added scroll indicator
- Implemented reduced motion support
- Added mobile device tilt support
- Optimized performance with Intersection Observer

## Test Plan
- [x] 3D shapes rotate and respond to mouse
- [x] Feature cards hover effects work smoothly
- [x] CTAs navigate correctly
- [x] Reduced motion respected
- [x] Mobile responsive
- [x] Production build successful

🤖 Generated with [Claude Code](https://claude.com/claude-code)
EOF
)"
```

**Step 5: Document for user**

Report to user:
- Homepage redesigned successfully
- All animations working
- Mobile responsive
- Production build tested
- Branch: feature/homepage-redesign
- Ready for merge or PR review

---

## Notes for Implementation

### Testing Strategy
- Visual testing throughout (no unit tests for UI-heavy components)
- Browser DevTools for performance monitoring
- Mobile device testing for tilt support
- Reduced motion testing with DevTools emulation

### Performance Targets
- 60fps animation on desktop
- < 3s load time on 3G
- Lighthouse score 90+

### Dependencies Rationale
- `@react-three/fiber`: Declarative Three.js in React
- `@react-three/drei`: Helper components (OrbitControls, etc)
- `framer-motion`: Production-ready animations with good DX
- Existing stack: Tailwind, React Router, Headless UI

### Accessibility
- Reduced motion support (Task 10)
- Keyboard navigation on all CTAs
- ARIA labels maintained
- Sufficient color contrast on overlays

### Common Pitfalls
- Three.js performance: Use frameloop='demand' when offscreen
- Mouse parallax jank: Throttle or use RAF, not direct state updates
- Image loading flash: Ensure lazy loading on FeatureCards
- Device orientation permissions: Handle iOS 13+ permission requests
