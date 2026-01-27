# Split-Screen Homepage Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Transform homepage hero into split-screen layout with 3D spaceship (left) and name/intro (right)

**Architecture:** Create new SpaceshipScene component using React Three Fiber to display spaceship.glb with mouse parallax. Restructure HomePage hero section into flex container with left (spaceship) and right (text) sections. Maintain existing animations and CTAs.

**Tech Stack:** React, TypeScript, @react-three/fiber, @react-three/drei, Tailwind CSS, Framer Motion

---

## Prerequisites Check

### Task 0: Verify Dependencies

**Files:**
- Read: `package.json`

**Step 1: Check @react-three dependencies**

Already verified: @react-three/fiber (^8.18.0) and @react-three/drei (^9.122.0) are installed.

**Step 2: Check spaceship model size**

Note: spaceship.glb is 32MB - large but acceptable for portfolio site. We'll implement loading state.

**Step 3: Proceed with implementation**

Dependencies confirmed. Ready to start.

---

## Task 1: Copy Spaceship Model

**Files:**
- Copy: `Threlte-in-practice-spaceship/static/models/spaceship.glb` → `public/models/spaceship.glb`

**Step 1: Create models directory**

```bash
mkdir -p public/models
```

Expected: Directory created

**Step 2: Copy spaceship model**

```bash
cp Threlte-in-practice-spaceship/static/models/spaceship.glb public/models/spaceship.glb
```

Expected: File copied (32MB)

**Step 3: Verify model exists**

```bash
ls -lh public/models/spaceship.glb
```

Expected: `-rw-r--r-- ... 32M ... public/models/spaceship.glb`

**Step 4: Commit**

```bash
git add public/models/spaceship.glb
git commit -m "feat: add spaceship 3D model for hero section"
```

---

## Task 2: Create SpaceshipScene Component (Part 1: Setup)

**Files:**
- Create: `src/components/SpaceshipScene.tsx`

**Step 1: Create component file with basic structure**

```typescript
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import { useRef, useEffect, useState } from 'react';
import { useInView } from 'framer-motion';
import * as THREE from 'three';

interface SpaceshipSceneProps {
  className?: string;
}

const SpaceshipScene: React.FC<SpaceshipSceneProps> = ({ className }) => {
  const canvasRef = useRef(null);
  const isInView = useInView(canvasRef);

  return (
    <div
      ref={canvasRef}
      className={`w-full h-full ${className || ''}`}
      aria-hidden="true"
    >
      <Canvas
        frameloop={isInView ? 'always' : 'demand'}
        camera={{ position: [0, 0, 5], fov: 50 }}
        gl={{ alpha: true, antialias: true }}
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        <directionalLight position={[-5, -5, 5]} intensity={0.5} />
      </Canvas>
    </div>
  );
};

export default SpaceshipScene;
```

**Step 2: Save file**

Save to `src/components/SpaceshipScene.tsx`

**Step 3: Commit**

```bash
git add src/components/SpaceshipScene.tsx
git commit -m "feat: create SpaceshipScene component with basic Canvas setup"
```

---

## Task 3: Create SpaceshipScene Component (Part 2: Model Loading)

**Files:**
- Modify: `src/components/SpaceshipScene.tsx`

**Step 1: Add Spaceship mesh component**

Add this component inside the file, before SpaceshipScene:

```typescript
interface SpaceshipModelProps {
  mousePositionRef: React.MutableRefObject<{ x: number; y: number }>;
  prefersReducedMotion: boolean;
}

const SpaceshipModel: React.FC<SpaceshipModelProps> = ({
  mousePositionRef,
  prefersReducedMotion
}) => {
  const meshRef = useRef<THREE.Group>(null);
  const { scene } = useGLTF('/models/spaceship.glb');

  useFrame((_state, delta) => {
    if (meshRef.current && !prefersReducedMotion) {
      // Mouse parallax rotation
      const targetRotationY = mousePositionRef.current.x * 0.3;
      const targetRotationX = -mousePositionRef.current.y * 0.2;

      // Smooth interpolation
      meshRef.current.rotation.y += (targetRotationY - meshRef.current.rotation.y) * 0.05;
      meshRef.current.rotation.x += (targetRotationX - meshRef.current.rotation.x) * 0.05;
    }
  });

  return (
    <primitive
      ref={meshRef}
      object={scene.clone()}
      scale={1.5}
      position={[0, 0, 0]}
    />
  );
};
```

**Step 2: Add preload call at bottom of file**

Add after the export statement:

```typescript
// Preload the model to prevent loading flicker
useGLTF.preload('/models/spaceship.glb');
```

**Step 3: Commit**

```bash
git add src/components/SpaceshipScene.tsx
git commit -m "feat: add SpaceshipModel component with GLTF loading"
```

---

## Task 4: Create SpaceshipScene Component (Part 3: Mouse Parallax)

**Files:**
- Modify: `src/components/SpaceshipScene.tsx`

**Step 1: Add prefers-reduced-motion hook**

Add this hook before SpaceshipScene component:

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

**Step 2: Add mouse tracking to SpaceshipScene**

Update SpaceshipScene component to include:

```typescript
const SpaceshipScene: React.FC<SpaceshipSceneProps> = ({ className }) => {
  const canvasRef = useRef(null);
  const isInView = useInView(canvasRef);
  const mousePositionRef = useRef({ x: 0, y: 0 });
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) return;

    const handleMouseMove = (e: MouseEvent) => {
      mousePositionRef.current = {
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: -(e.clientY / window.innerHeight) * 2 + 1,
      };
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [prefersReducedMotion]);

  return (
    <div
      ref={canvasRef}
      className={`w-full h-full ${className || ''}`}
      aria-hidden="true"
    >
      <Canvas
        frameloop={isInView ? 'always' : 'demand'}
        camera={{ position: [0, 0, 5], fov: 50 }}
        gl={{ alpha: true, antialias: true }}
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        <directionalLight position={[-5, -5, 5]} intensity={0.5} />
        <SpaceshipModel
          mousePositionRef={mousePositionRef}
          prefersReducedMotion={prefersReducedMotion}
        />
      </Canvas>
    </div>
  );
};
```

**Step 3: Commit**

```bash
git add src/components/SpaceshipScene.tsx
git commit -m "feat: add mouse parallax interaction to spaceship"
```

---

## Task 5: Update HomePage Layout (Part 1: Import and Structure)

**Files:**
- Modify: `src/pages/HomePage.tsx:1-25`

**Step 1: Replace Hero3DPlayground import with SpaceshipScene**

Change line 6 from:
```typescript
import Hero3DPlayground from "@/components/Hero3DPlayground";
```

To:
```typescript
import SpaceshipScene from "@/components/SpaceshipScene";
```

**Step 2: Restructure hero section**

Replace the hero section (lines 24-82) with:

```tsx
{/* Hero Zone - Split Screen */}
<section className="flex flex-col md:flex-row min-h-screen">
  {/* Left Section - 3D Spaceship */}
  <div className="relative w-full md:w-1/2 h-[50vh] md:h-screen bg-gradient-to-br from-purple-900/20 via-black to-black">
    <SpaceshipScene />
  </div>

  {/* Right Section - Text Content */}
  <div className="relative w-full md:w-1/2 flex flex-col items-center justify-center px-6 py-12 md:py-0 bg-black">
    <motion.div
      className="text-center space-y-6 max-w-2xl"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <h1 className="text-5xl md:text-7xl font-bold text-white drop-shadow-lg">
        Hi, I'm Wesley Chou
      </h1>

      <div className="text-2xl md:text-4xl text-white/90">
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
            className="inline-flex items-center gap-2 px-4 py-3 md:px-6 md:py-4 text-lg md:text-xl font-semibold bg-purple-600 text-white rounded-lg shadow-lg hover:shadow-xl transition-shadow"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            View Experience
            <FaArrowRight />
          </motion.button>
        </Link>

        <a href="mailto:wcia013twe@gmail.com">
          <motion.button
            className="inline-flex items-center gap-2 px-4 py-3 md:px-6 md:py-4 text-lg md:text-xl font-semibold bg-transparent border-2 border-white text-white rounded-lg hover:bg-white/10 transition-colors"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            Contact Me
            <MdEmail />
          </motion.button>
        </a>
      </motion.div>
    </motion.div>

    <div className="absolute bottom-8">
      <ScrollIndicator />
    </div>
  </div>
</section>
```

**Step 3: Verify the file compiles**

```bash
npm run build
```

Expected: Build succeeds (warnings about large model are ok)

**Step 4: Commit**

```bash
git add src/pages/HomePage.tsx
git commit -m "feat: restructure hero section with split-screen layout"
```

---

## Task 6: Test Spaceship Display

**Files:**
- Test: Visual inspection in browser

**Step 1: Start development server**

```bash
npm run dev
```

Expected: Server starts on localhost

**Step 2: Open browser and navigate to homepage**

Check:
- Spaceship loads and displays on left half (desktop)
- Name and text display on right half (desktop)
- Mouse movement causes spaceship to rotate slightly
- Layout stacks vertically on mobile (resize browser)

**Step 3: Test reduced motion**

Open DevTools → Run in console:
```javascript
matchMedia('(prefers-reduced-motion: reduce)').matches
```

Or toggle in browser settings. Verify spaceship stays static.

**Step 4: Document findings**

If spaceship doesn't display correctly (too big/small/wrong angle), note adjustments needed for next task.

---

## Task 7: Adjust Spaceship Camera and Scale

**Files:**
- Modify: `src/components/SpaceshipScene.tsx`

**Step 1: Adjust camera position if needed**

Based on visual testing, modify camera settings in Canvas:
- If spaceship too close: increase Z in `position: [0, 0, 8]`
- If spaceship too far: decrease Z in `position: [0, 0, 3]`
- Adjust FOV between 40-60 for perspective

Example adjustment:
```typescript
<Canvas
  frameloop={isInView ? 'always' : 'demand'}
  camera={{ position: [0, 0, 6], fov: 45 }}
  gl={{ alpha: true, antialias: true }}
>
```

**Step 2: Adjust spaceship scale if needed**

In SpaceshipModel component, modify scale prop:
- If spaceship too small: increase to `scale={2.0}` or higher
- If spaceship too large: decrease to `scale={1.0}` or lower
- Adjust position Y to center vertically: `position={[0, -0.5, 0]}`

**Step 3: Test in browser**

```bash
npm run dev
```

Verify spaceship is properly framed and centered.

**Step 4: Commit**

```bash
git add src/components/SpaceshipScene.tsx
git commit -m "fix: adjust spaceship camera and scale for optimal viewing"
```

---

## Task 8: Add Loading State

**Files:**
- Modify: `src/components/SpaceshipScene.tsx`

**Step 1: Add loading state to SpaceshipScene**

Add state and loading component:

```typescript
const SpaceshipScene: React.FC<SpaceshipSceneProps> = ({ className }) => {
  const canvasRef = useRef(null);
  const isInView = useInView(canvasRef);
  const mousePositionRef = useRef({ x: 0, y: 0 });
  const prefersReducedMotion = usePrefersReducedMotion();
  const [isLoading, setIsLoading] = useState(true);

  // ... existing mouse tracking useEffect ...

  return (
    <div
      ref={canvasRef}
      className={`relative w-full h-full ${className || ''}`}
      aria-hidden="true"
    >
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-10">
          <div className="text-white text-xl">Loading spaceship...</div>
        </div>
      )}
      <Canvas
        frameloop={isInView ? 'always' : 'demand'}
        camera={{ position: [0, 0, 6], fov: 45 }}
        gl={{ alpha: true, antialias: true }}
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        <directionalLight position={[-5, -5, 5]} intensity={0.5} />
        <SpaceshipModel
          mousePositionRef={mousePositionRef}
          prefersReducedMotion={prefersReducedMotion}
          onLoad={() => setIsLoading(false)}
        />
      </Canvas>
    </div>
  );
};
```

**Step 2: Add onLoad prop to SpaceshipModel**

Update SpaceshipModel interface and implementation:

```typescript
interface SpaceshipModelProps {
  mousePositionRef: React.MutableRefObject<{ x: number; y: number }>;
  prefersReducedMotion: boolean;
  onLoad?: () => void;
}

const SpaceshipModel: React.FC<SpaceshipModelProps> = ({
  mousePositionRef,
  prefersReducedMotion,
  onLoad
}) => {
  const meshRef = useRef<THREE.Group>(null);
  const { scene } = useGLTF('/models/spaceship.glb');

  useEffect(() => {
    if (onLoad) {
      onLoad();
    }
  }, [onLoad]);

  // ... rest of component ...
};
```

**Step 3: Test loading state**

```bash
npm run dev
```

Open browser with throttled network (DevTools → Network → Slow 3G). Verify loading message appears.

**Step 4: Commit**

```bash
git add src/components/SpaceshipScene.tsx
git commit -m "feat: add loading state for spaceship model"
```

---

## Task 9: Improve Mobile Responsiveness

**Files:**
- Modify: `src/pages/HomePage.tsx`

**Step 1: Adjust mobile spaceship height**

Update left section in hero:

```tsx
<div className="relative w-full md:w-1/2 h-[60vh] md:h-screen bg-gradient-to-br from-purple-900/20 via-black to-black">
  <SpaceshipScene />
</div>
```

Change from `h-[50vh]` to `h-[60vh]` for better mobile visibility.

**Step 2: Adjust text section padding on mobile**

Update right section:

```tsx
<div className="relative w-full md:w-1/2 flex flex-col items-center justify-center px-6 py-16 md:py-0 bg-black min-h-[40vh] md:min-h-screen">
```

Add `min-h-[40vh]` and increase `py-12` to `py-16` for better spacing.

**Step 3: Test on mobile**

```bash
npm run dev
```

Use DevTools device emulation. Test on:
- iPhone SE (small)
- iPad (tablet)
- Desktop

Verify layout works on all sizes.

**Step 4: Commit**

```bash
git add src/pages/HomePage.tsx
git commit -m "fix: improve mobile responsiveness for split-screen layout"
```

---

## Task 10: Performance Optimization

**Files:**
- Modify: `src/components/SpaceshipScene.tsx`

**Step 1: Add proper cleanup**

Update mouse tracking effect:

```typescript
useEffect(() => {
  if (prefersReducedMotion) return;

  const handleMouseMove = (e: MouseEvent) => {
    // Only update if canvas is in view
    if (isInView) {
      mousePositionRef.current = {
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: -(e.clientY / window.innerHeight) * 2 + 1,
      };
    }
  };

  window.addEventListener('mousemove', handleMouseMove, { passive: true });
  return () => window.removeEventListener('mousemove', handleMouseMove);
}, [prefersReducedMotion, isInView]);
```

**Step 2: Add passive event listener**

Note the `{ passive: true }` option added above for better scroll performance.

**Step 3: Test performance**

```bash
npm run dev
```

Open DevTools → Performance tab. Record while interacting. Check:
- FPS stays at 60
- No jank during mouse movement
- Canvas pauses when scrolled out of view

**Step 4: Commit**

```bash
git add src/components/SpaceshipScene.tsx
git commit -m "perf: optimize mouse tracking with passive listeners"
```

---

## Task 11: Accessibility Improvements

**Files:**
- Modify: `src/pages/HomePage.tsx`

**Step 1: Add descriptive region labels**

Update hero section:

```tsx
<section
  className="flex flex-col md:flex-row min-h-screen"
  aria-label="Hero section with 3D spaceship and introduction"
>
```

**Step 2: Add skip link for keyboard users**

Add at the very top of HomePage return, before Helmet:

```tsx
<a
  href="#main-content"
  className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-purple-600 focus:text-white focus:rounded"
>
  Skip to main content
</a>
```

**Step 3: Add id to feature cards section**

Update feature cards section:

```tsx
<section
  id="main-content"
  className="relative z-10 max-w-7xl mx-auto px-6 py-20"
>
```

**Step 4: Test keyboard navigation**

```bash
npm run dev
```

Test:
- Tab through all interactive elements
- Press Enter on buttons
- Verify skip link appears on Tab press

**Step 5: Commit**

```bash
git add src/pages/HomePage.tsx
git commit -m "a11y: add skip link and improve ARIA labels"
```

---

## Task 12: Final Visual Polish

**Files:**
- Modify: `src/components/SpaceshipScene.tsx`

**Step 1: Add subtle floating animation**

Update SpaceshipModel useFrame:

```typescript
useFrame((_state, delta) => {
  if (meshRef.current) {
    // Subtle floating animation
    if (!prefersReducedMotion) {
      meshRef.current.position.y = Math.sin(_state.clock.elapsedTime * 0.5) * 0.1;
    }

    // Mouse parallax rotation
    if (!prefersReducedMotion) {
      const targetRotationY = mousePositionRef.current.x * 0.3;
      const targetRotationX = -mousePositionRef.current.y * 0.2;

      meshRef.current.rotation.y += (targetRotationY - meshRef.current.rotation.y) * 0.05;
      meshRef.current.rotation.x += (targetRotationX - meshRef.current.rotation.x) * 0.05;
    }
  }
});
```

**Step 2: Enhance lighting**

Update Canvas lighting in SpaceshipScene:

```tsx
<ambientLight intensity={0.6} />
<directionalLight position={[10, 10, 5]} intensity={1.2} color="#ffffff" />
<directionalLight position={[-5, -5, 5]} intensity={0.6} color="#a78bfa" />
<pointLight position={[0, 5, 0]} intensity={0.5} color="#9333ea" />
```

**Step 3: Test visual improvements**

```bash
npm run dev
```

Verify:
- Spaceship has subtle up/down motion
- Lighting highlights model details
- Purple accent lights match brand

**Step 4: Commit**

```bash
git add src/components/SpaceshipScene.tsx
git commit -m "feat: add floating animation and enhanced lighting"
```

---

## Task 13: Cross-Browser Testing

**Files:**
- Test: Manual testing in multiple browsers

**Step 1: Test in Chrome/Edge**

```bash
npm run dev
```

Open in Chrome. Verify:
- Spaceship renders correctly
- Mouse parallax works
- Layout responsive
- No console errors

**Step 2: Test in Firefox**

Open same URL in Firefox. Verify same items.

**Step 3: Test in Safari (if available)**

Open in Safari. Check WebGL support and rendering.

**Step 4: Document any issues**

Create issue list if browser-specific problems found. Most likely all will work since React Three Fiber handles cross-browser compatibility.

---

## Task 14: Build and Production Test

**Files:**
- Test: Production build

**Step 1: Create production build**

```bash
npm run build
```

Expected: Build completes successfully (warnings about 32MB model are acceptable)

**Step 2: Preview production build**

```bash
npm run preview
```

Expected: Production server starts

**Step 3: Test production version**

Open browser to preview URL. Verify:
- Spaceship loads correctly
- All interactions work
- Performance is good (check DevTools)
- No console errors

**Step 4: Document build size**

Check `dist` folder size. Note if spaceship.glb significantly increases bundle.

---

## Task 15: Final Commit and Cleanup

**Files:**
- Clean: Remove unused Hero3DPlayground component (optional)

**Step 1: Check if Hero3DPlayground is used elsewhere**

```bash
grep -r "Hero3DPlayground" src/
```

Expected: Only found in HomePage.tsx (already removed)

**Step 2: Remove old component (optional)**

```bash
git rm src/components/Hero3DPlayground.tsx
```

**Step 3: Run final build check**

```bash
npm run build
```

Expected: Success

**Step 4: Final commit**

```bash
git add -A
git commit -m "chore: remove unused Hero3DPlayground component"
```

---

## Success Criteria Checklist

Test all criteria before marking complete:

- [ ] Spaceship.glb loads and displays on left half (desktop)
- [ ] Name and text display on right half (desktop)
- [ ] Split-screen layout is 50/50 on desktop
- [ ] Layout stacks vertically on mobile (spaceship top, text bottom)
- [ ] Mouse parallax works smoothly (spaceship follows cursor)
- [ ] Reduced motion is respected (no animation when preference set)
- [ ] Loading state shows while model loads
- [ ] Performance is 60fps during interaction
- [ ] Keyboard navigation works for all buttons
- [ ] Skip link appears on Tab press
- [ ] Works in Chrome, Firefox, Safari
- [ ] Production build succeeds
- [ ] No console errors
- [ ] Feature cards and footer sections unaffected

---

## Notes

**Large Model File:** The 32MB spaceship.glb will increase initial load time. Consider these future optimizations:
- Compress model using gltf-pipeline
- Implement progressive loading
- Add better loading animations
- Consider CDN hosting

**Camera Angles:** Exact camera position may need tweaking based on spaceship orientation. Adjust in Task 7.

**Browser Support:** React Three Fiber requires WebGL2. Ensure fallback message for unsupported browsers if needed.
