# Skills Page Redesign - 3D Tech Galaxy

**Date:** 2026-01-27
**Status:** Approved Design
**Style:** Interactive & Playful 3D experience

## Overview

Redesign the Skills page with a 3D galaxy of technology, where each of the 5 skill categories becomes a distinct "planet" floating in space. Users can explore the galaxy by rotating the camera, then click any planet to zoom in and see individual technology icons orbiting around it.

## Design Principles

- **Interactive & Playful:** Match homepage's 3D geometric vibe
- **Explorable:** User-controlled camera with smooth transitions
- **Performance First:** Optimize for 60fps, respect reduced-motion
- **Mobile-Friendly:** Touch controls and simplified rendering
- **Clear Navigation:** Intuitive zoom in/out interactions

## Architecture

### Page Structure

1. **Header Zone** (Fixed, ~200px)
   - "Skills" title with SplitText animation
   - Subtitle: "Technology and tools I use to bring ideas to life."

2. **3D Canvas Zone** (Fill remaining viewport)
   - Full Three.js scene with React Three Fiber
   - Two states: Galaxy View (default) and Zoomed View (category detail)

3. **Navigation Controls** (Floating)
   - Exit button (zoomed view only)
   - Optional: Control hints overlay

---

## Galaxy View (Default State)

### 3D Scene Setup

**Camera:**
- Perspective camera, FOV: 75°
- Initial position: `[0, 5, 15]` (slightly elevated, looking at center)
- Orbit controls enabled:
  - Mouse drag to rotate
  - Scroll wheel to zoom
  - Max distance: 30 units
  - Min distance: 10 units
  - Auto-rotate: disabled (user-controlled only)

**Environment:**
- Background: Deep dark gradient (black → dark purple #1a0033)
- Stars: Particle field with 1000-2000 points
  - Random positions in sphere around scene
  - White color with varying opacity (0.3-1.0)
  - Subtle twinkling animation (random opacity shifts)
  - Size: 1-3 pixels

**Planets Layout:**

5 planets in organic circular arrangement:

| Category | Position | Size (radius) | Color | Material |
|----------|----------|---------------|-------|----------|
| Languages & Frontend | `[-8, 2, 0]` | 2.5 | Purple (#9333ea) | Glossy sphere |
| Backend & Databases | `[4, -1, -6]` | 2.0 | Blue (#3b82f6) | Glossy sphere |
| DevOps & Infrastructure | `[6, 1, 4]` | 1.8 | Green (#10b981) | Glossy sphere |
| Tools & Collaboration | `[-5, -2, 5]` | 1.8 | Orange (#f59e0b) | Glossy sphere |
| Leadership | `[0, 3, -4]` | 2.2 | Pink (#ec4899) | Particle nebula |

**Planet Appearance:**
- Sphere geometry with MeshStandardMaterial
- Emissive color matching category color
- Point light at planet center for glow effect
- Slow rotation on Y-axis (0.002 rad/frame)
- Floating label above each planet:
  - Text: Category name
  - Billboard effect (always faces camera)
  - Font: 1.2rem, white with shadow
  - Position: planet.y + radius + 1

**Planet Interactions:**
- Hover:
  - Scale: 1.0 → 1.05 (spring animation)
  - Glow intensity increases (emissive *= 1.3)
  - Cursor: pointer
- Click:
  - Triggers zoom transition to planet detail view
  - Disables orbit controls during transition

---

## Zoomed View (Category Detail)

### Transition Animation

**Sequence (1.2 seconds):**
1. Disable orbit controls
2. Fade out all other planets (opacity: 1 → 0, 0.4s)
3. Move camera to planet front view position:
   - Target: `[planet.x, planet.y, planet.z + 8]`
   - LookAt: planet center
   - Easing: ease-in-out
4. Expand planet scale: 1.0 → 1.5
5. Materialize skill icons in orbit (fade in + scale, 0.3s)
6. Fade in exit button

**Reverse transition (return to galaxy):**
- Same sequence in reverse
- Re-enable orbit controls when complete

### Skill Icons Display

**Orbital Layout:**

Icons orbit around the central planet in 3D space:
- Multiple orbital rings (2-3 depending on item count)
- Ring radii: 4, 6, 8 units from planet center
- Distribute icons evenly around each ring
- Continuous rotation animation (0.005 rad/frame per ring, varying speeds)

**Icon Appearance:**
- Sprite with tech logo texture (using StackIcon images)
- Size: 1.5 x 1.5 units (scales to ~100px on screen)
- Background: Circular card with gradient
  - Background color: rgba(category color, 0.2)
  - Border: 2px solid category color
  - Border radius: 50%
- Glow effect: Point light at icon position
- Billboard: Always faces camera
- Floating animation: Sine wave bob (amplitude: 0.2, frequency: 0.001)

**Icon Interactions:**
- Hover:
  - Scale: 1.0 → 1.15
  - Glow intensity increase
  - Tooltip appears: Technology name in white text above icon
  - Cursor: pointer
- Click (optional for v1):
  - Could show detail panel with related projects

**Skill Data Structure:**

```typescript
interface SkillCategory {
  id: string;
  name: string;
  color: string;
  position: [number, number, number];
  radius: number;
  skills: SkillIcon[];
}

interface SkillIcon {
  name: string;
  icon: ReactNode; // StackIcon or CustomIcon component
}
```

---

## Leadership Category (Special Treatment)

**Planet Appearance:**
- Instead of solid sphere: Particle system (500-800 particles)
- Particles form cloud/nebula shape
- Pink/magenta color gradient
- Particles drift slowly (Perlin noise movement)
- More ethereal feel

**Zoomed View:**
- Skills appear as 3D floating text labels (not icon cards)
- Text pieces: "Mentorship", "High Resiliency", "Shipping Relentlessly", etc.
- Each text floats and rotates slowly in 3D space
- Distribution: Random positions in sphere around nebula
- Hover: Text lights up, comes forward (z-axis)
- Optional: Reset button to regenerate positions with physics scatter

---

## Navigation & Exit

### Exit Button

**Appearance:**
- Position: Fixed top-right (20px from edges)
- Size: 48px x 48px circular button
- Background: rgba(0, 0, 0, 0.6)
- Border: 1px solid rgba(147, 51, 234, 0.5)
- Icon: "X" in white
- Shadow: 0 4px 12px rgba(0, 0, 0, 0.3)

**Behavior:**
- Only visible in zoomed view
- Fade in (0.3s) after zoom completes
- Fade out when returning to galaxy
- Hover: Background lightens, purple border brightens
- Click: Triggers return to galaxy transition

**Background Click to Exit:**
- Clicking on dark space (not planets/icons) also exits
- Hint text: "Click anywhere to return" fades in after 2s, fades out after 5s
- Text position: Bottom center
- Font: 0.9rem, white with opacity 0.6

---

## Performance & Optimization

### 3D Rendering

**Optimizations:**
- Use `<instancedMesh>` for stars (single draw call)
- Level of Detail (LOD): Reduce planet polygon count based on distance
- Frustum culling enabled by default (Three.js)
- Render on demand: Only re-render when camera moves or interactions occur
- Throttle orbit controls to 60fps
- Lazy load: Only create skill icon sprites when zooming into planet

**Loading Strategy:**
- Show loading overlay while Three.js initializes
- Preload all tech icon images before showing scene
- Progressive enhancement: Show static fallback if WebGL not supported

### Mobile Optimizations

**Rendering adjustments:**
- Reduce star particle count: 1000 → 500
- Simplify planet materials: Remove some lighting effects
- Lower texture resolution for icons
- Disable some post-processing effects

**Touch Controls:**
- One-finger drag: Rotate camera (orbit)
- Two-finger pinch: Zoom camera
- Tap planet: Zoom in
- Tap background: Zoom out
- Optional: Device tilt to shift camera (subtle effect)

---

## Accessibility

### Reduced Motion Support

Detect `prefers-reduced-motion` media query:

**When enabled:**
- Fallback to static 2D layout (current ScrollStack approach)
- Show skill cards in vertical stack
- Disable all 3D scene rendering
- Use simple fade transitions instead of zoom animations
- Alternative: Simplified 3D with no continuous animations

### Keyboard Navigation

**Galaxy View:**
- Tab: Cycle through planets
- Enter: Zoom into selected planet
- Arrow keys: Rotate camera (alternative to mouse drag)
- +/-: Zoom camera in/out

**Zoomed View:**
- Tab: Cycle through skill icons
- Enter: Show detail (if implemented)
- Escape: Return to galaxy
- Arrow keys: Rotate orbital view

### Screen Reader Support

- ARIA labels on all interactive elements
- Announce state changes:
  - "Entered Languages & Frontend category"
  - "Returned to galaxy view"
- Alt text on all skill icon images
- Semantic HTML structure for fallback

---

## Technical Stack

### Libraries

- **Three.js + React Three Fiber (@react-three/fiber)**: 3D scene rendering
- **Drei (@react-three/drei)**: Three.js helpers (OrbitControls, Text, Stars, etc.)
- **Framer Motion**: Transition animations (zoom in/out)
- **React Spring (@react-spring/three)**: 3D spring animations (hover effects)
- **Zustand (optional)**: State management for view mode (galaxy vs zoomed)

### Components to Build

1. `TechGalaxy.tsx` - Main container component
2. `GalaxyView.tsx` - Galaxy scene with planets
3. `Planet.tsx` - Individual planet component with hover states
4. `PlanetLabel.tsx` - Billboard text label for planet names
5. `ZoomedView.tsx` - Zoomed category view with orbiting icons
6. `SkillIcon.tsx` - 3D skill icon sprite with interactions
7. `LeadershipNebula.tsx` - Special particle system for Leadership
8. `StarField.tsx` - Background star particles
9. `ExitButton.tsx` - Floating exit button component
10. `ReducedMotionFallback.tsx` - Static 2D fallback

### Data File

Create `src/data/skillsGalaxyData.ts`:
- Export array of SkillCategory objects
- Map current skills from SkillsPage.tsx to new structure
- Include positions, colors, and skill lists

### Components to Modify

- `SkillsPage.tsx` - Replace ScrollStack with TechGalaxy component

---

## Implementation Plan

### Phase 1: Scene Setup & Galaxy View
1. Install dependencies (react-three/fiber, react-three/drei, react-spring/three)
2. Create basic TechGalaxy component with Canvas
3. Build StarField background
4. Create Planet component with basic materials
5. Build GalaxyView with 5 planets positioned correctly
6. Add PlanetLabel billboards
7. Implement OrbitControls
8. Add planet hover effects (scale, glow)

### Phase 2: Zoom Transition & Zoomed View
1. Set up view state management (galaxy vs zoomed)
2. Implement zoom transition animation
3. Create ZoomedView component
4. Build orbital layout system for skill icons
5. Create SkillIcon sprite component
6. Load tech logo textures and render icons
7. Add icon hover effects and tooltips
8. Implement continuous orbital rotation

### Phase 3: Leadership Nebula
1. Build LeadershipNebula particle system
2. Create 3D floating text labels for soft skills
3. Add drift animations
4. Implement hover interactions

### Phase 4: Navigation & Polish
1. Create ExitButton component
2. Implement background click-to-exit
3. Add hint text overlays
4. Implement reverse transition (zoomed → galaxy)
5. Test all interactions

### Phase 5: Accessibility & Performance
1. Build ReducedMotionFallback component
2. Add keyboard navigation
3. Implement ARIA labels and screen reader support
4. Mobile optimizations (particle reduction, touch controls)
5. Performance testing and optimization

### Phase 6: Integration & Testing
1. Create skillsGalaxyData.ts from existing skills
2. Replace SkillsPage.tsx content
3. Cross-browser testing
4. Mobile device testing
5. Accessibility audit

---

## Testing Checklist

- [ ] Galaxy view renders with 5 planets in correct positions
- [ ] Orbit controls allow smooth camera rotation and zoom
- [ ] Planet hover effects work (scale, glow, cursor)
- [ ] Click planet triggers zoom transition
- [ ] Zoomed view shows correct skills for category
- [ ] Skill icons orbit continuously
- [ ] Icon hover shows tooltip with name
- [ ] Exit button returns to galaxy view
- [ ] Background click exits zoomed view
- [ ] Leadership nebula renders as particle cloud
- [ ] Leadership skills appear as 3D text
- [ ] Star field renders and twinkles
- [ ] Reduced-motion shows static fallback
- [ ] Keyboard navigation works (Tab, Enter, Escape, Arrows)
- [ ] Screen reader announces state changes
- [ ] Mobile: Touch controls work (drag, pinch, tap)
- [ ] Mobile: Reduced particle count for performance
- [ ] 60fps maintained on desktop
- [ ] WebGL fallback shows error message gracefully
- [ ] All tech icon images load correctly

---

## Success Criteria

- Skills page creates memorable 3D experience matching homepage vibe
- Users can easily explore all skills through intuitive interactions
- Page maintains 60fps on modern devices
- Mobile experience is smooth with touch controls
- Accessibility features work for all users
- Page loads in < 3 seconds on 3G connection
