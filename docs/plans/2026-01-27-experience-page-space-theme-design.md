# Experience Page Redesign - 3D Timeline Journey

**Date:** 2026-01-27
**Status:** Approved Design
**Style:** Cinematic 3D spiral timeline in space

## Overview

Redesign the Experience page as an immersive 3D journey through a spiral timeline floating in space. Each work experience is a glassmorphic "space station" card positioned along a glowing neon spiral path. Users experience an auto-play cinematic intro, then can scroll to navigate the timeline or click cards to fly in for detailed views.

## Design Principles

- **Cinematic Journey:** Auto-play intro creates memorable first impression
- **Narrative Flow:** Career progression visualized as upward spiral through space
- **Explorable:** Scroll-based navigation with click-to-focus interactions
- **Immersive Atmosphere:** Full space environment with stars, nebula, particles
- **Performance First:** 60fps target, optimized for mobile
- **Accessible:** Keyboard navigation, reduced-motion fallback, screen reader support

## Architecture

### Page Structure

1. **Header Zone** (Fixed, ~200px)
   - "Experience" title with SplitText animation
   - Subtitle: "My journey through the tech industry."
   - Glassmorphic styling matching NavBar

2. **3D Canvas Zone** (Fill viewport)
   - Full React Three Fiber scene
   - Two states: Timeline Journey (default) and Close-Up View (focused card)
   - Z-index layering: Background (nebula, stars) → Timeline path → Cards → UI controls

3. **Navigation Controls** (Floating)
   - Timeline progress indicator (shows position: 2023 → 2025)
   - Exit button (close-up view only)
   - Hint text overlays

---

## 3D Scene Setup

### Camera Configuration

**Camera:**
- Perspective camera, FOV: 75°
- Initial position: Top of spiral `[0, 10, 12]` looking down/along path
- Auto-play: Camera travels down spiral on load (3 seconds)
- Manual control: Scroll wheel moves camera along spiral path
- Smooth easing: All camera movements use lerp (factor: 0.1)

**Camera Behavior:**
- Follows spiral curve exactly
- Always looks slightly ahead on path (tangent + 10 degrees)
- Distance from spiral center: 12 units (wide enough to see cards)
- Smooth damping on all movements

### Spiral Timeline Path

**Mathematical Structure:**
- Start position: `[0, 10, 0]` (top, newest experiences)
- End position: `[0, -10, 0]` (bottom, oldest experiences)
- Radius: 8 units from center axis
- Rotations: 2.5 full rotations over 20-unit vertical span
- Direction: Clockwise when viewed from above
- Cards positioned at even intervals along spiral

**Calculation:**
```typescript
function getSpiralPosition(t: number): Vector3 {
  // t = 0 (top/newest) to 1 (bottom/oldest)
  const angle = t * Math.PI * 2 * 2.5; // 2.5 rotations
  const y = 10 - (t * 20); // Descend from 10 to -10
  const x = Math.cos(angle) * 8;
  const z = Math.sin(angle) * 8;
  return new Vector3(x, y, z);
}
```

---

## Spiral Path Visualization

### Glowing Neon Tube

**Geometry:**
- TubeGeometry following spiral curve
- Radius: 0.15 units (thin cable aesthetic)
- Tubular segments: 128 (smooth curves)
- Radial segments: 8

**Material:**
- MeshStandardMaterial with emissive properties
- Emissive intensity: 0.8
- Metalness: 0.3
- Roughness: 0.4

**Color Gradient:**
Gradient flows along spiral from top to bottom:
- Top (newest): `#9333ea` (Purple)
- Middle: `#3b82f6` (Blue)
- Bottom (oldest): `#ec4899` (Pink)

Implementation: Vertex colors or texture gradient

**Glow Effects:**
- Bloom post-processing for soft halo
- Point lights positioned along tube (every 2 units)
  - Light color: Matches tube segment color
  - Intensity: 0.5
  - Distance: 3 units
  - Decay: 2

**Pulse Animation:**
- Emissive intensity oscillates: 0.6 → 1.0 → 0.6
- Duration: 3 seconds infinite loop
- Easing: sine wave (smooth)
- Creates "breathing" effect

**Energy Flow Particles:**
- 20-30 small glowing orbs flowing along tube
- Travel from bottom to top (past → present)
- Speed: Complete journey in 6 seconds
- Particle size: 3-4px
- Color: Matches tube color at position
- Spacing: Even distribution

**Energy Pulse Effect:**
- Occasional bright pulse travels along tube
- Frequency: Every 4-5 seconds
- Duration: 1 second full path travel
- Intensity: 2x brighter than normal glow
- Creates "power surge" visual

### Connection Nodes

**Node Appearance:**
- Small glowing sphere at each card connection point
- Radius: 0.3 units
- Position: Where card connects to timeline path
- Color: Brighter version of tube color at that position
- Material: Emissive, glowing

**Animation:**
- Pulse synced with tube pulse
- Scale: 1.0 → 1.15 → 1.0
- Opacity: 0.8 → 1.0 → 0.8
- Duration: 3 seconds (matches tube)

---

## Experience Card Design (Space Stations)

### Card Structure

**Dimensions:**
- Width: 6 units in 3D space (~400px when in view)
- Height: Auto-fit content (typically 8-10 units)
- Aspect ratio: Portrait orientation
- Position: 2 units radially outward from spiral path
- Orientation: Billboard effect (always faces camera)

**Positioning:**
- Cards attached to spiral at specific positions (t = 0 to 1)
- Offset perpendicularly from path
- Connection to timeline via node sphere
- Each card at its chronological position

### Glassmorphic Styling

**Container:**
- Background: `bg-black/40 backdrop-blur-xl`
- Border: `3px solid [gradient color from timeline]`
  - Border color matches timeline gradient at card position
- Border radius: `rounded-2xl`
- Shadow: `shadow-lg shadow-[color]/40`
- Inner padding: `p-6`
- Overflow: hidden

**Border Animation (Idle):**
- Subtle pulse: Border opacity 40% → 60% → 40%
- Duration: 2.5 seconds infinite
- Synced with timeline tube pulse
- Creates unified visual rhythm

### Card Content Layout

**Header Section:**

1. **Company Logo**
   - Position: Top-left corner
   - Size: 48px × 48px
   - Container: Circular with `bg-white/10`
   - Border: `2px solid white/20`
   - Image: `object-cover` company logo
   - Margin: `mb-4`

2. **Role Title**
   - Font: `text-2xl font-bold text-white`
   - Margin: `mb-1`
   - Line height: `leading-tight`

3. **Company Name**
   - Font: `text-lg text-white/80`
   - Margin: `mb-2`

4. **Duration**
   - Font: `text-sm text-white/60`
   - Icon: Calendar icon before text (12px)
   - Format: "Jan 2023 - Present" or "Jun 2021 - Dec 2022"
   - Margin: `mb-4`

**Divider:**
- Border: `border-t border-white/20`
- Margin: `my-4`

**Achievements Section:**
- Label: "Key Achievements"
  - Font: `text-sm font-semibold text-white/70 uppercase tracking-wide`
  - Margin: `mb-3`
- List styling:
  - Unordered list with custom bullets
  - Bullet: Glowing dot (4px) matching timeline color
  - Text: `text-base text-white/90`
  - Line height: `leading-relaxed`
  - Spacing: `space-y-2`
  - Maximum 4 bullets shown

**Tech Stack Section:**
- Label: "Technologies"
  - Font: `text-sm font-semibold text-white/70 uppercase tracking-wide`
  - Margin: `mt-5 mb-2`
- Container: `flex flex-wrap gap-2`
- Pills: Same TechPill component from Projects page
  - Background: `bg-gradient-to-r from-gray-800/50 to-gray-700/50`
  - Border: `1px solid white/10`
  - Border bottom: `2px solid [categoryColor]` (accent)
  - Padding: `px-3 py-1`
  - Border radius: `rounded-full`
  - Font: `text-xs text-white/80`

**Tech Category Colors:**
```typescript
const techColors = {
  frontend: '#9333ea',    // Purple
  backend: '#3b82f6',     // Blue
  database: '#10b981',    // Green
  ai: '#ec4899',          // Pink
  devops: '#f59e0b'       // Orange
};
```

---

## Card Interactions & Animations

### Idle State (Timeline Journey)

**Floating Animation:**
- Vertical bob: ±0.2 units
- Duration: 3 seconds per cycle
- Easing: sine wave (smooth)
- Phase offset: Each card starts at different point in cycle
- Creates organic "floating in space" feel

**Ambient Wobble:**
- Gentle rotation: ±2 degrees on Y-axis
- Duration: 4 seconds
- Easing: sine wave
- Independent from floating animation

**Distance-Based Fading:**
- Cards within 5 units of camera: Full opacity (1.0)
- Cards 5-10 units away: Fade to 0.3 opacity
- Cards beyond 10 units: Hidden (culled for performance)
- Smooth opacity transition

**Active Card Highlight:**
- Card closest to camera center: Subtle scale boost (1.05)
- Slight glow increase: `shadow-xl shadow-[color]/50`
- Indicates current timeline position

### Hover State

**Visual Changes:**
- Scale: 1.0 → 1.08 (spring animation)
  - Spring config: tension: 300, friction: 20
- Border:
  - Brightness 150%
  - Width: 3px → 4px
- Glow: Shadow intensity increases
  - From: `shadow-lg shadow-[color]/40`
  - To: `shadow-2xl shadow-[color]/60`
- Z-position: Move 0.5 units toward camera
- Cursor: pointer

**Tech Pills Sequential Animation:**
- Pills brighten one by one
- Stagger delay: 50ms between pills
- Border color: Increase to full opacity
- Scale: 1.0 → 1.02
- Creates cascading effect

**Duration:**
- Hover enter: 300ms ease-out
- Hover exit: 250ms ease-in

### Click Interaction - Fly-To-Closeup

**Phase 1: Preparation (0-200ms)**
- Disable scroll and manual controls
- Other cards fade: opacity → 0.2
- Timeline tube dims: opacity → 0.3
- Background effects dim: 50% opacity
- Clicked card maintains full opacity
- Trigger focus state

**Phase 2: Camera Flight (200-1000ms)**
- Camera flies to close-up position:
  - Target: 3 units in front of card center
  - LookAt: Card center point
  - Path: Bezier curve for smooth motion
- Easing: ease-in-out (cubic-bezier)
- Card scales during flight: 1.08 → 1.3
- Card border glow intensifies progressively

**Phase 3: Content Reveal (1000-1500ms)**
- Card expands vertically if needed (more content visible)
- Achievement bullets animate in:
  - Fade + slide from left
  - Stagger: 100ms between bullets
  - Duration: 400ms per bullet
- Tech pills animate in:
  - Scale from 0 → 1
  - Stagger: 50ms between pills
  - Duration: 300ms per pill
- Exit button fades in (top-right corner)
  - Delay: 1200ms
  - Duration: 300ms

**Close-Up View State:**
- Card fills ~70% of viewport
- All content fully readable
- Subtle breathing animation on border glow
- Background heavily blurred/dimmed
- Exit button visible and interactive

---

## Exit Transition - Return to Timeline

### Camera Return Sequence (1.2 seconds)

**Phase 1: Content Fade Out (0-300ms)**
- Exit button fades out
- Achievement bullets fade out (reverse stagger)
- Tech pills scale down (reverse stagger)
- Card shrinks: 1.3 → 1.05

**Phase 2: Camera Flight Back (300-1000ms)**
- Camera returns to timeline journey position
- Path: Smooth retracing of approach
- Easing: ease-in-out
- Card maintains scale 1.05 during flight

**Phase 3: Timeline Restoration (1000-1200ms)**
- Other cards fade back in: opacity 0.2 → 1.0
- Timeline tube brightens: opacity 0.3 → 1.0
- Background effects return: 50% → 100% opacity
- Clicked card returns to normal scale: 1.05 → 1.0
- Re-enable scroll and manual controls

**Position Memory:**
- System remembers scroll position before close-up
- Camera returns to exact timeline position
- Maintains continuity even if scene shifted
- Smooth return regardless of duration in close-up

**Alternative Exit Methods:**
- Click exit button (top-right)
- Press ESC key
- Click background/empty space
- All trigger same return sequence

---

## Background Effects Layer

### 1. Star Field

**Distribution:**
- Count: 2000 stars (desktop), 1000 (mobile)
- Position: Random points in large sphere (radius: 100 units)
- Covers entire scene volume

**Star Types:**
- 70% small: Size 1-2px, opacity 0.6, white
- 25% medium: Size 2-3px, opacity 0.8, white
- 5% bright: Size 3-4px, opacity 1.0, white

**Rendering:**
- Single InstancedMesh (1 draw call)
- Point sprite material
- Additive blending for glow

**Twinkling Animation:**
- Each star independently: opacity ±0.2
- Duration: Randomized 2-4 seconds per star
- Easing: sine wave
- Staggered timing creates natural effect

**Parallax Effect:**
- Stars drift based on camera movement
- Parallax factor: 0.1x camera movement
- Creates depth perception
- Closer stars move more than distant stars

### 2. Nebula Clouds

**Cloud Configuration:**
- Count: 3-4 large clouds (desktop), 2 (mobile)
- Size: 20-30 units diameter each
- Distribution: Around spiral (background, not blocking)
- Depth: Behind timeline path

**Appearance:**
- Colors: Purple, blue, pink gradients
  - Cloud 1: Purple-dominated (#9333ea → #6b21a8)
  - Cloud 2: Blue-dominated (#3b82f6 → #1e40af)
  - Cloud 3: Pink-dominated (#ec4899 → #be185d)
  - Cloud 4: Mixed purple-blue
- Transparency: 0.15-0.25 opacity (very subtle)
- Soft edges: Radial gradient fade

**Implementation:**
- Sprite-based textures (performant)
- Radial gradient PNG/WebP images
- Billboard orientation (face camera)
- Additive or normal blending

**Animation:**
- Slow drift: 0.01 units/second
- Direction: Random per cloud, wrapping
- Gentle rotation: 0.002 rad/frame
- Pulsing opacity: ±0.05 over 8 seconds
- Creates living atmosphere

### 3. Floating Particles/Dust

**Particle System:**
- Count: 150 particles (desktop), 75 (mobile)
- Size: 2-4px circles
- Distribution: Scattered throughout scene

**Particle Colors:**
- 60% white: `rgba(255, 255, 255, 0.3)`
- 40% colored: Timeline gradient colors at 0.4 opacity
  - Match purple/blue/pink from timeline

**Rendering:**
- InstancedMesh for performance
- Shared sphere geometry (low poly)
- MeshBasicMaterial with transparency

**Movement:**
- Perlin noise drift for organic paths
- Speed: 0.05-0.15 units/second (randomized per particle)
- Direction: Generally upward (past → future metaphor)
- Wrapping: Particles exiting bounds respawn at bottom/sides

**Camera Interaction:**
- Parallax effect: Closer particles move faster
- Creates depth perception
- Particles near camera: Slight blur

**Light Interaction:**
- Particles near timeline tube: Brighten and take on tube color
- Particles near cards: Reflect card glow color
- Creates cohesive lighting environment

### 4. Ambient Lighting

**Directional Light:**
- Position: Top-center, angled down
- Color: Soft white (#ffffff)
- Intensity: 0.3
- Creates subtle top-lighting

**Ambient Light:**
- Color: Deep purple (#1a0033)
- Intensity: 0.2
- Fills shadows with space atmosphere

**Hemisphere Light:**
- Sky color: Dark blue (#0a0a1f)
- Ground color: Dark purple (#1a0033)
- Intensity: 0.4
- Creates atmospheric gradient

---

## Auto-Play Intro Sequence

### Timeline: 0-3.5 Seconds

**Stage 1: Scene Initialization (0-500ms)**

1. **Canvas Fade-In (0-300ms):**
   - Background: Black → Dark gradient
   - Opacity: 0 → 1
   - Easing: ease-in

2. **Star Field Appears (100-400ms):**
   - Stars fade in with twinkling
   - Immediate twinkle animation begins
   - Staggered appearance

3. **Nebula Clouds Materialize (200-600ms):**
   - Clouds fade in slowly
   - Opacity: 0 → 0.2
   - Drift animation begins

4. **Timeline Tube Draws (300-800ms):**
   - Tube "draws" from top to bottom
   - Progress: 0% → 100% of spiral length
   - Emissive glow follows drawing edge
   - Duration: 500ms
   - Creates dramatic reveal

**Stage 2: Cards Materialize (500-1200ms)**

Experience cards fade in sequentially top to bottom:
- Stagger delay: 100ms between cards
- Per card animation:
  - Opacity: 0 → 1
  - Scale: 0.8 → 1.0
  - Slight rotation: rotateX(20deg) → 0
  - Duration: 400ms
  - Easing: ease-out with bounce
- Floating animation begins after fade-in

**Stage 3: Camera Journey (1200-3500ms)**

- Camera starts: Top of spiral `[0, 10, 12]`
- Camera travels: Smooth descent along spiral
- End position: Midpoint of spiral (around y = 2-3)
- Duration: 2.3 seconds
- Easing: ease-in-out (smooth acceleration/deceleration)
- Passes by: 2-3 experience cards during journey
- Effect: Shows overview of timeline structure

**Stage 4: Control Handoff (3500ms+)**

1. **Progress Indicator Fade-In (3500-3800ms):**
   - Bottom-center UI appears
   - Opacity: 0 → 1
   - Slide up slightly
   - Duration: 300ms

2. **Hint Text Appears (4000-4500ms):**
   - "Scroll to explore • Click stations for details"
   - Position: Bottom-center, above progress
   - Fade in: 500ms
   - Stay visible: 4 seconds
   - Fade out: 500ms

3. **Enable User Control (3500ms):**
   - Scroll wheel enabled
   - Click interactions enabled
   - Smooth transition to manual mode

---

## Manual Control System

### Scroll-Based Navigation

**Scroll Mapping:**
- Virtual scroll range: 3000-4000px
- Maps to: Full spiral height (20 units)
- Scroll position → Timeline position (0-1)
- Formula: `timelinePos = scrollTop / maxScroll`

**Camera Positioning:**
- Camera position interpolated along spiral curve
- Uses getSpiralPosition(t) with offset
- Offset: 12 units from spiral center (outward)
- LookAt: Slightly ahead on path (tangent + 10°)

**Smooth Following:**
- Camera lerps to target position
- Lerp factor: 0.1 (smooth damping)
- No jarring jumps
- Velocity-based momentum (optional)

**Scroll Event Handling:**
- Throttled to 60fps (requestAnimationFrame)
- Update camera target on scroll
- Smooth interpolation prevents jank

**Direction:**
- Scroll down: Descend timeline (newer → older)
- Scroll up: Ascend timeline (older → newer)
- Natural spatial metaphor

**Scroll Bounds:**
- Top bound: Newest experience (t = 0)
- Bottom bound: Oldest experience (t = 1)
- Rubber-band effect at extremes (optional)

### Cards in View System

**Active Card Detection:**
- Calculate distance from camera to each card
- Closest card = "active" card
- Active card receives highlight:
  - Scale: 1.05
  - Glow: `shadow-xl shadow-[color]/50`
  - Indicates current position

**Visibility Culling:**
- Distance < 5 units: Full opacity (1.0)
- Distance 5-10 units: Fade opacity (1.0 → 0.3)
- Distance > 10 units: Hidden (culled)
- Smooth opacity transitions
- Performance: Don't render hidden cards

**Focus Management:**
- Keyboard Tab: Cycle through visible cards
- Current focus: Purple ring outline
- Enter key: Fly to focused card

### Click to Jump Navigation

**Direct Access:**
- Click any visible card from any position
- Triggers immediate fly-to-closeup
- Bypasses scroll navigation
- Allows non-linear exploration

**Jump Behavior:**
- Camera flies from current position to card
- Uses same transition as normal click
- Returns to clicked card's timeline position on exit
- Maintains spatial coherence

---

## Navigation UI Components

### Timeline Progress Indicator

**Position & Layout:**
- Fixed: bottom-center of viewport
- Distance from bottom: 32px
- Z-index: 50 (above canvas)
- Centered horizontally

**Container Styling:**
- Background: `bg-black/60 backdrop-blur-lg`
- Border: `1px solid purple-500/30`
- Border radius: `rounded-full`
- Padding: `px-6 py-3`
- Shadow: `shadow-lg shadow-black/20`
- Glassmorphic pill aesthetic

**Content Format:**
- Text: "2023 → 2025" (dynamic year range)
- Font: `text-sm text-white/80 font-medium`
- Center dot indicator: `•` in purple
- Position marker moves with scroll

**Visual Progress:**
```
[2023 ====•==== 2025]
```
- Dot position: Represents current timeline location
- Color: `text-purple-400`
- Scale pulse: 1.0 → 1.1 → 1.0 every 2s

**Animation:**
- Fades in: After auto-play (3.5s)
- Fade duration: 300ms
- Dot smoothly animates as user scrolls
- Position lerp for smooth movement

**Responsive:**
- Mobile: Slightly smaller padding `px-4 py-2`
- Font size maintained for readability

### Exit Button (Close-Up View)

**Position & Appearance:**
- Fixed: top-right corner
- Distance: 24px from top and right
- Z-index: 51 (above progress indicator)
- Size: 56px × 56px circle

**Styling:**
- Background: `bg-black/70 backdrop-blur-md`
- Border: `2px solid purple-500/40`
- Icon: "X" symbol (`text-2xl text-white`)
- Shadow: `shadow-xl shadow-black/30`
- Glassmorphic consistency

**Visibility:**
- Hidden: During timeline journey
- Visible: Only in close-up view
- Fade in: 300ms after camera reaches close-up (delay: 1200ms)
- Fade out: When exit triggered

**Hover State:**
- Rotation: 0deg → 90deg
- Scale: 1.0 → 1.1
- Border: `border-purple-500` (full opacity)
- Glow: `shadow-2xl shadow-purple-500/60`
- Duration: 250ms ease-out
- Cursor: pointer

**Interactions:**
- Click: Trigger return to timeline
- ESC key: Also triggers exit
- Touch: Tap to exit (mobile)

**Accessibility:**
- ARIA label: "Return to timeline"
- Keyboard focus: Purple ring outline
- Tab order: First focusable in close-up

**Responsive:**
- Mobile: 48px × 48px (slightly smaller)
- Touch target: Maintained 48px minimum

### Hint Text Overlays

**"Scroll to explore" Hint**

**Position:**
- Bottom-center viewport
- Above progress indicator (16px gap)
- Centered horizontally

**Content:**
- Text: "Scroll to explore • Click stations for details"
- Font: `text-sm text-white/50`
- Bullet separator: ` • `

**Timing:**
- Appears: 1s after auto-play ends (4.5s total)
- Fade in: 500ms
- Visible duration: 4 seconds
- Fade out: 500ms
- Shows only once per page load

**Animation:**
- Opacity: 0 → 1 → 0
- Slight slide up on fade-in (10px)
- Easing: ease-out

**"Click anywhere to return" Hint**

**Position:**
- Bottom-center in close-up view
- Same position as scroll hint

**Content:**
- Text: "Click anywhere to return"
- Font: `text-sm text-white/50`

**Timing:**
- Appears: 2s after entering close-up
- Fade in: 500ms
- Visible duration: 3 seconds
- Fade out: 500ms

**Animation:**
- Same fade pattern as scroll hint
- Subtle pulsing (optional)

---

## Data Structure

### Experience Interface

```typescript
interface Experience {
  id: string;
  company: string;
  companyLogo: string; // Path to logo image or URL
  role: string;
  startDate: string; // Format: "2023-01" (YYYY-MM)
  endDate: string | 'Present'; // "2024-12" or "Present"
  achievements: string[]; // 3-4 bullet points
  tech: TechItem[];
  spiralPosition: number; // 0-1 (0=top/newest, 1=bottom/oldest)
}

interface TechItem {
  name: string;
  category: 'frontend' | 'backend' | 'database' | 'ai' | 'devops';
  icon?: ReactNode; // Optional tech logo
}
```

### Helper Functions

```typescript
// Format duration display
function formatDuration(start: string, end: string | 'Present'): string {
  // Input: "2023-01", "2024-12" or "Present"
  // Output: "Jan 2023 - Dec 2024" or "Jan 2023 - Present"
}

// Calculate timeline gradient color at position
function getTimelineColor(position: number): string {
  // position: 0 (top) to 1 (bottom)
  // Interpolate: Purple (#9333ea) → Blue (#3b82f6) → Pink (#ec4899)
  // Returns hex color string
}

// Calculate card position in 3D space
function getCardPosition(spiralPosition: number): Vector3 {
  const spiralPoint = getSpiralPosition(spiralPosition);
  // Offset radially outward by 2 units
  const angle = spiralPosition * Math.PI * 2 * 2.5;
  const offsetX = Math.cos(angle) * 2;
  const offsetZ = Math.sin(angle) * 2;
  return new Vector3(
    spiralPoint.x + offsetX,
    spiralPoint.y,
    spiralPoint.z + offsetZ
  );
}
```

### Timeline Configuration

```typescript
interface TimelineConfig {
  // Spiral parameters
  spiralRadius: 8; // units
  spiralHeight: 20; // units (vertical span)
  spiralRotations: 2.5; // full rotations
  topY: 10; // starting height
  bottomY: -10; // ending height

  // Card parameters
  cardRadialOffset: 2; // units outward from path
  cardWidth: 6; // units

  // Camera parameters
  cameraDistance: 12; // units from spiral center
  cameraLookAhead: 10; // degrees ahead on tangent

  // Animation parameters
  introJourneyDuration: 2.3; // seconds
  flyToCardDuration: 0.8; // seconds
  returnToTimelineDuration: 0.7; // seconds
}
```

### Example Data

```typescript
export const experiences: Experience[] = [
  {
    id: 'senior-engineer-2023',
    company: 'Tech Startup Inc',
    companyLogo: '/assets/logos/tech-startup.png',
    role: 'Senior Software Engineer',
    startDate: '2023-06',
    endDate: 'Present',
    achievements: [
      'Architected microservices platform serving 1M+ daily active users',
      'Reduced API response time by 60% through caching and optimization',
      'Mentored team of 5 engineers, conducted code reviews and pair programming',
      'Led migration from monolith to event-driven architecture',
    ],
    tech: [
      { name: 'React', category: 'frontend' },
      { name: 'TypeScript', category: 'frontend' },
      { name: 'Next.js 14', category: 'frontend' },
      { name: 'Node.js', category: 'backend' },
      { name: 'MongoDB', category: 'database' },
      { name: 'Docker', category: 'devops' },
    ],
    spiralPosition: 0, // Top/newest
  },
  {
    id: 'software-engineer-2021',
    company: 'Enterprise Corp',
    companyLogo: '/assets/logos/enterprise-corp.png',
    role: 'Software Engineer',
    startDate: '2021-08',
    endDate: '2023-05',
    achievements: [
      'Developed customer-facing dashboard used by 500+ enterprise clients',
      'Improved test coverage from 40% to 85% through TDD practices',
      'Collaborated with product team on roadmap and feature prioritization',
    ],
    tech: [
      { name: 'React', category: 'frontend' },
      { name: 'JavaScript', category: 'frontend' },
      { name: 'Python', category: 'backend' },
      { name: 'FastAPI', category: 'backend' },
      { name: 'PostgreSQL', category: 'database' },
    ],
    spiralPosition: 0.5, // Middle
  },
  // ... more experiences ordered newest to oldest
];
```

---

## Performance & Optimization

### 3D Rendering Performance

**GPU Acceleration:**
- All animations use GPU-friendly properties:
  - `transform` (translateZ, rotateX/Y/Z, scale)
  - `opacity`
- Apply `will-change: transform` only during active animations
- Remove `will-change` when idle (free GPU memory)
- Force GPU compositing: `transform: translateZ(0)`

**Geometry Optimization:**
- Spiral tube: TubeGeometry with segment count based on device
  - Desktop: 128 segments
  - Mobile: 64 segments
- Cards: Simple PlaneGeometry (2 triangles)
- Use shared geometries where possible
- Dispose geometries when unmounting

**Instance Rendering:**
- Stars: Single InstancedMesh (1 draw call for 2000 stars)
- Particles: Single InstancedMesh (1 draw call for 150 particles)
- Connection nodes: InstancedMesh if many cards
- Massive performance improvement

**Frustum Culling:**
- Enabled by default in Three.js
- Cards beyond camera view not rendered
- Stars/particles outside frustum culled
- Automatic optimization

**Distance-Based Culling:**
- Cards > 10 units from camera: Don't render
- Implemented via opacity (0 = don't render)
- Saves draw calls and GPU time

**Level of Detail (LOD):**
- Distant objects: Lower polygon count
- Close objects: Higher polygon count
- Three.js LOD system for cards (if complex geometry)

**Material Optimization:**
- Share materials between similar objects
- Reuse materials: Don't create per-card
- Use MeshBasicMaterial where lighting unnecessary
- Limit material features (reduce shader complexity)

**Texture Management:**
- Compress company logos: WebP format
- Texture atlas for tech icons
- Lazy load: Load textures when needed
- Dispose unused textures
- Max resolution: 512px for logos

**Post-Processing:**
- Bloom effect: Selective bloom (only emissive objects)
- Use EffectComposer efficiently
- Limit effect passes: Target 1-2 max
- Option to disable on low-end devices

**Rendering Strategy:**
- On-demand rendering: Only render when scene changes
- Invalidate when:
  - Camera moves
  - Animations active
  - User interaction
- Pause when page hidden (Page Visibility API)

**Frame Budget:**
- Target: 60fps (16.67ms per frame)
- Breakdown:
  - Rendering: <10ms
  - JavaScript: <4ms
  - Layout/Paint: <2ms
  - Budget remaining: ~1ms buffer
- Monitor with Performance Observer
- Degrade gracefully if over budget

**Performance Monitoring:**
```typescript
// Real-time FPS tracking
const fpsMonitor = new Stats();
if (averageFPS < 45) {
  // Trigger quality reduction
  reduceEffects();
}
```

**Optimization Checklist:**
- [ ] Use InstancedMesh for repeated objects
- [ ] Enable frustum culling
- [ ] Implement distance-based culling
- [ ] Share materials and geometries
- [ ] Dispose resources on unmount
- [ ] Lazy load textures
- [ ] Throttle scroll handlers (RAF)
- [ ] Use on-demand rendering
- [ ] Monitor frame times
- [ ] Profile with Chrome DevTools

---

## Mobile Optimization

### Rendering Adjustments

**Effect Reduction:**
- Stars: 2000 → 1000
- Particles: 150 → 75
- Nebula clouds: 4 → 2
- Energy flow particles: 30 → 15
- Tube segments: 128 → 64

**Material Simplification:**
- Replace some MeshStandardMaterial with MeshBasicMaterial
- Reduce lighting calculations
- Disable shadows (if any)
- Simplify shaders

**Post-Processing:**
- Disable bloom effect on mobile
- No post-processing passes
- Direct rendering only
- Saves significant GPU time

**Texture Quality:**
- Lower resolution textures: 512px → 256px
- Compress aggressively: WebP with higher compression
- Lazy load: Only when card in view

**Camera & Scene:**
- Spiral radius: 8 → 6 units (tighter)
- Camera distance: 12 → 10 units (closer)
- Card width: 6 → 5 units (smaller)

**Animation Simplification:**
- Remove floating/wobble idle animations
- Disable continuous subtle movements
- Only animate on interaction
- Saves CPU cycles

### Touch Controls

**Gestures:**

1. **Vertical Swipe (Timeline Navigation):**
   - Single finger vertical drag
   - Maps to scroll position
   - Velocity-based momentum scrolling
   - Deceleration curve on release
   - Rubber-band bounce at timeline ends

2. **Tap Card (Open Close-Up):**
   - Tap visible card to fly in
   - Haptic feedback on tap (if supported)
   - Visual feedback: Brief glow
   - Minimum touch target: 44px × 44px

3. **Tap Background (Exit Close-Up):**
   - Tap empty space to return to timeline
   - Tap anywhere except card content
   - Clear visual cue

4. **Two-Finger Gestures (Disabled):**
   - No pinch-zoom (controlled camera only)
   - No rotation gestures
   - Maintains consistent experience

**Touch Event Handling:**
```typescript
// Velocity-based momentum
let touchStartY = 0;
let touchVelocity = 0;

const handleTouchStart = (e: TouchEvent) => {
  touchStartY = e.touches[0].clientY;
  touchVelocity = 0;
};

const handleTouchMove = (e: TouchEvent) => {
  const deltaY = e.touches[0].clientY - touchStartY;
  // Update scroll position
  // Calculate velocity
};

const handleTouchEnd = () => {
  // Apply momentum with deceleration
  applyMomentum(touchVelocity);
};
```

**Touch Feedback:**
- Visual: Card glows on touch
- Haptic: Subtle vibration on tap (if supported)
- Sound: Optional subtle click sound
- Delay: <100ms for responsiveness

### Layout Adjustments

**Card Content:**
- Reduce padding: `p-6` → `p-4`
- Reduce margins: Tighter spacing
- Font sizes:
  - Role title: `text-2xl` → `text-xl`
  - Company name: `text-lg` → `text-base`
  - Achievements: `text-base` → `text-sm`
- Show max 3 achievements (hide 4th on mobile)

**Progress Indicator:**
- Smaller padding: `px-6 py-3` → `px-4 py-2`
- Maintain readable font size
- Adjust spacing

**Exit Button:**
- Size: 56px → 48px
- Maintain minimum touch target
- Adjust positioning: 16px from edges

**Typography Scale:**
- Reduce by 10-15% across the board
- Maintain readability
- Test on actual devices

### Device Detection

**Capability Testing:**
```typescript
const isMobile = window.innerWidth < 768;
const hasLowRAM = navigator.deviceMemory < 4; // GB
const hasWeakGPU = detectGPUTier(); // Use gpu-detect library

if (isMobile || hasLowRAM || hasWeakGPU) {
  applyMobileOptimizations();
}
```

**Progressive Enhancement:**
- Start with base experience
- Add effects based on device capabilities
- Graceful degradation strategy
- User preference override (settings)

**Performance Monitoring:**
- Track FPS on mobile continuously
- If FPS < 30 consistently:
  - Further reduce effects
  - Offer 2D fallback
- Save preference in localStorage

### Testing Strategy

**Test Devices:**
- iPhone SE (older, weak GPU)
- iPhone 12+ (modern, capable)
- Android mid-range (Samsung A-series)
- Android flagship (Samsung S-series, Pixel)
- iPad (varies by generation)

**Test Scenarios:**
- Auto-play intro performance
- Scroll smoothness
- Touch responsiveness
- Card transitions
- Battery impact (30min session)
- Memory usage over time

**Metrics:**
- FPS: Target 30fps minimum
- Memory: < 200MB RAM usage
- Battery: < 10% drain per 30min
- Load time: < 3s on 4G

---

## Accessibility

### Reduced Motion Support

**Detection:**
```css
@media (prefers-reduced-motion: reduce) {
  /* Apply reduced motion styles */
}
```

**Disabled Elements (When Reduced Motion):**
- Auto-play intro camera journey
- 3D camera movements
- Floating/wobble card animations
- Particle movements
- Pulsing/breathing effects
- Twinkling stars
- Energy flow along tube
- Scale spring animations

**Simplified Experience:**
- Switch to 2D vertical timeline fallback
- Cards arranged in vertical stack
- Simple fade transitions (<300ms)
- Click card: Expand accordion-style in place
- No 3D scene rendering
- CSS-only animations

**Alternative Implementation:**
```typescript
const prefersReducedMotion = window.matchMedia(
  '(prefers-reduced-motion: reduce)'
).matches;

if (prefersReducedMotion) {
  return <FallbackTimeline experiences={experiences} />;
}

return <ExperienceTimeline experiences={experiences} />;
```

### Keyboard Navigation

**Timeline Journey View:**

**Keys:**
- `Tab`: Cycle through visible experience cards
- `Enter` / `Space`: Fly to close-up of focused card
- `Arrow Up`: Move camera up timeline (toward newer)
- `Arrow Down`: Move camera down timeline (toward older)
- `Home`: Jump to top (newest experience)
- `End`: Jump to bottom (oldest experience)
- `1-9`: Jump to experience by index (quick access)

**Visual Feedback:**
- Focus visible: `ring-2 ring-purple-500 ring-offset-2 ring-offset-black`
- Focused card: Slight scale boost (1.05)
- Clear indication of current focus

**Close-Up View:**

**Keys:**
- `Tab`: Cycle through card elements:
  - Exit button (first focus)
  - Achievement bullets (if interactive)
  - Tech pills (if interactive)
  - Any links/buttons
- `Escape`: Return to timeline journey
- `Space`: Alternative to return
- `Shift+Tab`: Reverse cycle

**Focus Management:**
- Focus trap in close-up view (optional, since background exits)
- First focus: Exit button (easy escape)
- Maintain focus position when returning to timeline
- Clear focus indicators throughout

**Skip Links:**
- "Skip to timeline" link at top
- Jumps to first experience card
- Hidden until focused

### Screen Reader Support

**ARIA Structure:**

**Timeline Scene:**
```html
<div role="region" aria-label="Career timeline journey">
  <!-- 3D canvas and controls -->
</div>
```

**Experience Cards:**
```html
<article aria-label="Experience at Tech Company, Senior Engineer, 2023 to Present">
  <h2>Senior Engineer</h2>
  <p>Tech Company</p>
  <time datetime="2023-06">June 2023</time> - <span>Present</span>
  <section aria-label="Key achievements">
    <ul>
      <li>Achievement 1</li>
      <li>Achievement 2</li>
    </ul>
  </section>
  <section aria-label="Technologies">
    <ul role="list">
      <li role="listitem">React</li>
      <li role="listitem">TypeScript</li>
    </ul>
  </section>
</article>
```

**Exit Button:**
```html
<button aria-label="Return to timeline overview">
  <span aria-hidden="true">×</span>
</button>
```

**Progress Indicator:**
```html
<div role="status" aria-live="polite" aria-atomic="true">
  Currently viewing 2023 experiences
</div>
```

**State Announcements:**
- Card focused: "Experience at [Company], [Role], [Start] to [End]"
- Close-up entered: "Viewing details for [Company] position as [Role]"
- Timeline position changed: "Currently viewing [Year] experiences"
- Close-up exited: "Returned to timeline overview"

**Semantic HTML:**
- `<article>` for each experience card
- `<h2>` for role title
- `<h3>` for company name (if nested)
- `<time>` with datetime attribute
- `<ul>` for achievements
- `<button>` for interactive elements (not divs)

**Alternative Text:**
- Company logos: `alt="[Company Name] logo"`
- Tech icons: `alt="[Technology name]"`
- Decorative elements: `alt=""` or `aria-hidden="true"`

### Alternative Navigation

**List View Toggle (Future Enhancement):**
- Button: "Switch to list view"
- Renders traditional 2D timeline
- All experiences visible at once
- Better for screen reader users
- Option to toggle back to 3D

**Implementation:**
```typescript
const [viewMode, setViewMode] = useState<'3d' | 'list'>('3d');

return (
  <>
    <button onClick={() => setViewMode('list')}>
      Switch to list view
    </button>
    {viewMode === '3d' ? (
      <ExperienceTimeline />
    ) : (
      <FallbackTimeline />
    )}
  </>
);
```

### Color Contrast

**Text Contrast:**
- White text on dark backgrounds: 14:1+ (AAA)
- White text on glassmorphic cards: Minimum 7:1 (AA)
- Ensure readability against nebula effects
- Test with contrast checker tools

**Interactive Elements:**
- Focus indicators: 3:1 contrast minimum
- Border colors clearly visible
- Hover states visually distinct
- Color not sole indicator of state

**Testing Tools:**
- Chrome DevTools contrast checker
- WAVE browser extension
- axe DevTools extension
- Manual testing with actual users

### Accessibility Testing Checklist

- [ ] Lighthouse accessibility score: Target 100
- [ ] WAVE tool: Zero errors, zero alerts
- [ ] axe DevTools: Zero violations
- [ ] Keyboard-only navigation: Full functionality
- [ ] Screen reader (NVDA): All content accessible
- [ ] Screen reader (VoiceOver): All content accessible
- [ ] Reduced motion: Fallback works
- [ ] Color contrast: All text passes WCAG AA
- [ ] Focus indicators: Visible on all interactive elements
- [ ] ARIA labels: Present and meaningful
- [ ] Semantic HTML: Proper structure

---

## Responsive Behavior

### Mobile (< 768px)

**Scene Adjustments:**
- Spiral radius: 8 → 6 units (tighter)
- Spiral height: 20 units (maintained)
- Card width: 6 → 5 units
- Camera distance: 12 → 10 units (closer)

**Effects:**
- Stars: 2000 → 1000
- Particles: 150 → 75
- Nebula clouds: 4 → 2
- Energy flow: 30 → 15 particles
- Tube segments: 128 → 64
- No bloom post-processing

**Typography:**
- Role title: `text-2xl` → `text-xl`
- Company name: `text-lg` → `text-base`
- Achievement bullets: `text-base` → `text-sm`
- Duration: `text-sm` (maintained)

**Spacing:**
- Card padding: `p-6` → `p-4`
- Section margins: Reduced 20%
- Logo size: 48px → 40px

**Controls:**
- Touch scrolling optimized
- Tap targets: Minimum 44px
- Progress indicator: `px-4 py-2`
- Exit button: 48px × 48px

**Auto-Play:**
- Duration: 3.5s → 2.5s (shorter)
- Faster camera travel
- Immediate control handoff

**Animations:**
- Remove idle floating/wobble
- Simplified hover (becomes tap)
- Faster transitions (reduce duration 20%)

### Tablet (768px - 1024px)

**Scene Adjustments:**
- Spiral radius: 8 → 7 units
- Card width: 6 → 5.5 units
- Camera distance: 12 → 11 units

**Effects (75% Density):**
- Stars: 2000 → 1500
- Particles: 150 → 110
- Nebula clouds: 4 → 3
- Energy flow: 30 → 20 particles

**Typography:**
- Slight reduction: 5-10%
- Maintain readability
- Test on actual tablets

**Controls:**
- Support both touch and mouse/keyboard
- Hover effects on mouse input
- Tap effects on touch input
- Adaptive UI based on input method

**Portrait vs Landscape:**
- Portrait: Similar to mobile (tighter)
- Landscape: Similar to desktop (spacious)
- Responsive breakpoint: 768px width

### Desktop (> 1024px)

**Full Experience:**
- All effects enabled
- Full particle/star counts
- Bloom post-processing active
- Maximum visual fidelity
- 60fps target

**Scene:**
- Spiral radius: 8 units
- Card width: 6 units
- Camera distance: 12 units
- All animations active

**Controls:**
- Mouse scroll navigation
- Hover interactions
- Click to focus
- Full keyboard support

### Large Screens (> 1440px)

**Enhanced Experience:**
- Card width: 6 → 6.5 units (more spacious)
- Increase max card content width
- Higher resolution textures (if available)
- Enhanced glow effects (larger radius)

**Typography:**
- Increase by 5-10% (more readable)
- More generous spacing
- Larger company logos: 48px → 56px

**Scene:**
- Potentially wider spiral radius (8 → 9 units)
- More dramatic camera movements
- Larger particles/stars (if performance allows)

---

## Browser Support & Fallbacks

### WebGL Detection

**Feature Detection:**
```typescript
function hasWebGLSupport(): boolean {
  try {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('webgl') ||
                    canvas.getContext('experimental-webgl');
    return !!context;
  } catch (e) {
    return false;
  }
}

function hasWebGL2Support(): boolean {
  try {
    const canvas = document.createElement('canvas');
    return !!canvas.getContext('webgl2');
  } catch (e) {
    return false;
  }
}
```

**Fallback Strategy:**
```typescript
if (!hasWebGLSupport()) {
  // Show 2D fallback timeline
  return <FallbackTimeline experiences={experiences} />;
}

if (!hasWebGL2Support()) {
  // Use WebGL 1.0 with feature restrictions
  return <ExperienceTimeline useWebGL1={true} />;
}

// Full WebGL 2.0 experience
return <ExperienceTimeline />;
```

**Graceful Degradation Message:**
```typescript
{!hasWebGLSupport() && (
  <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 mb-6">
    <p className="text-yellow-300 text-sm">
      Your browser doesn't support 3D graphics. Showing simplified timeline.
    </p>
  </div>
)}
```

### Browser-Specific Handling

**Chrome / Edge (Chromium):**
- Full support, all features
- Optimal performance
- No special handling needed

**Firefox:**
- Full support
- May need bloom effect adjustments
- Test backdrop-filter support
- Potential WebGL quirks with instancing

**Safari / iOS:**
- Full support on iOS 15+ and macOS Safari 15+
- Backdrop-filter supported
- Test on older versions for fallbacks
- WebGL context limits on older iPads
- Battery-saving mode may throttle

**Samsung Internet:**
- Generally good WebGL support
- Test on actual devices
- May need effect reductions
- Touch optimization important

**Older Browsers:**
- IE 11: Show 2D fallback (no WebGL 2.0)
- Old Android browsers (<v5): Performance check → fallback
- Old iOS Safari (<v12): Feature detection → fallback

**Detection Method:**
- Use feature detection, NOT user-agent sniffing
- Test actual capabilities (WebGL, backdrop-filter, etc.)
- Graceful degradation at each level

### Progressive Enhancement Strategy

**Loading Sequence:**
1. **Initial Load (0-500ms):**
   - Show loading spinner
   - Display header with title/subtitle
   - Load critical CSS

2. **Fallback Content (500-1000ms):**
   - Show minimal 2D content
   - Display text-based timeline
   - Functional without JavaScript

3. **WebGL Check (1000ms):**
   - Test WebGL support
   - Detect device capabilities
   - Make enhancement decision

4. **3D Scene Load (1000-2000ms):**
   - Initialize Three.js
   - Load textures
   - Build scene in background

5. **Transition (2000ms):**
   - Fade out 2D content
   - Fade in 3D scene
   - Start auto-play intro

**Failure Handling:**
- If WebGL fails: Stay on 2D
- If loading times out (>5s): Stay on 2D
- If FPS too low: Offer to switch to 2D
- User preference saved in localStorage

**Loading States:**
```typescript
type LoadingState =
  | 'initializing'
  | 'loading-textures'
  | 'building-scene'
  | 'ready'
  | 'failed';

const [loadingState, setLoadingState] = useState<LoadingState>('initializing');

if (loadingState === 'failed') {
  return <FallbackTimeline />;
}
```

### Performance-Based Degradation

**Real-Time Monitoring:**
```typescript
let frameCount = 0;
let totalTime = 0;
let averageFPS = 60;

function updateFPS(deltaTime: number) {
  frameCount++;
  totalTime += deltaTime;

  if (frameCount >= 60) {
    averageFPS = 1000 / (totalTime / frameCount);
    frameCount = 0;
    totalTime = 0;
  }

  // Trigger quality adjustments
  if (averageFPS < 30) {
    reduceQualityTier();
  } else if (averageFPS < 20) {
    offerFallback();
  }
}
```

**Quality Tiers:**
- **Ultra:** All effects, 60fps target
- **High:** Most effects, reduced particles
- **Medium:** Simplified effects, no bloom
- **Low:** Minimal effects, basic materials
- **Fallback:** 2D timeline

**Auto-Adjustment:**
- Monitor FPS during intro
- Adjust quality tier automatically
- Notify user of changes (optional)
- Allow manual override in settings

---

## Technical Implementation

### Technology Stack

**Core Libraries (Already Installed):**
- React 18+
- TypeScript
- React Three Fiber (@react-three/fiber)
- Drei (@react-three/drei)
- Three.js (peer dependency)
- Framer Motion
- GSAP
- Tailwind CSS

**Additional Dependencies:**
- @react-three/postprocessing - Bloom effects
- @react-spring/three - 3D spring animations
- simplex-noise or perlin-noise - Particle movement
- zustand (optional) - State management for view mode

**Installation:**
```bash
npm install @react-three/postprocessing @react-spring/three simplex-noise
```

### Component Architecture

**New Components:**

1. **`ExperienceTimeline.tsx`** - Main container
   - View state management (journey vs close-up)
   - Scroll position tracking
   - Canvas wrapper
   - UI overlay (progress, hints)

2. **`TimelineScene.tsx`** - 3D scene orchestrator
   - Camera setup and controls
   - Lighting configuration
   - Renders all 3D components
   - Manages scene state

3. **`SpiralPath.tsx`** - Timeline tube
   - TubeGeometry generation from curve
   - Gradient material system
   - Emissive glow animation
   - Energy flow particles
   - Connection nodes at card positions

4. **`ExperienceCard.tsx`** - 3D card component
   - Plane geometry with HTML overlay
   - Billboard orientation (face camera)
   - Idle animations (floating, wobble)
   - Hover/focus states
   - Click handler for fly-to-closeup

5. **`CardContent.tsx`** - HTML content overlay
   - Uses Drei `<Html>` for DOM rendering
   - Company logo, role, achievements
   - Tech pills with categories
   - Glassmorphic styling

6. **`CameraController.tsx`** - Camera logic
   - Auto-play intro sequence
   - Scroll-to-position mapping
   - Fly-to-closeup animation
   - Return-to-timeline animation
   - Smooth lerping

7. **`NebulaClouds.tsx`** - Background nebula
   - Sprite-based clouds
   - Gradient textures (PNG/WebP)
   - Slow drift animation
   - Color variation

8. **`FloatingParticles.tsx`** - Ambient particles
   - InstancedMesh for performance
   - Perlin noise movement
   - Color variation (white + timeline colors)
   - Camera parallax

9. **`TimelineProgress.tsx`** - Progress indicator UI
   - Glassmorphic pill overlay
   - Year range display
   - Position dot animation
   - Synced with scroll

10. **`FallbackTimeline.tsx`** - 2D fallback
    - Vertical timeline layout
    - CSS animations
    - Same content structure
    - Accordion-style expansion

**Reused from Skills Page:**
- `StarField.tsx` - Background stars
- `ExitButton.tsx` - Floating exit button

**Utility Hooks:**

1. **`useSpiralPosition.ts`** - Calculate 3D position
   ```typescript
   function useSpiralPosition(t: number): Vector3
   ```

2. **`useScrollTimeline.ts`** - Scroll mapping
   ```typescript
   function useScrollTimeline(): {
     scrollPosition: number; // 0-1
     setScrollPosition: (pos: number) => void;
     activeCard: number | null;
   }
   ```

3. **`useCameraTransition.ts`** - Camera animations
   ```typescript
   function useCameraTransition(): {
     flyToCard: (cardPosition: Vector3) => Promise<void>;
     returnToTimeline: () => Promise<void>;
     isTransitioning: boolean;
   }
   ```

4. **`useAutoPlayIntro.ts`** - Intro sequence
   ```typescript
   function useAutoPlayIntro(): {
     introComplete: boolean;
     skipIntro: () => void;
   }
   ```

### File Structure

**New Files:**
```
src/
├── components/
│   └── experience/
│       ├── ExperienceTimeline.tsx
│       ├── TimelineScene.tsx
│       ├── SpiralPath.tsx
│       ├── ExperienceCard.tsx
│       ├── CardContent.tsx
│       ├── CameraController.tsx
│       ├── NebulaClouds.tsx
│       ├── FloatingParticles.tsx
│       ├── TimelineProgress.tsx
│       └── FallbackTimeline.tsx
├── hooks/
│   ├── useSpiralPosition.ts
│   ├── useScrollTimeline.ts
│   ├── useCameraTransition.ts
│   └── useAutoPlayIntro.ts
├── data/
│   └── experienceData.ts
└── types/
    └── experience.ts
```

**Reused:**
```
src/components/galaxy/
├── StarField.tsx  (reuse)
└── ExitButton.tsx  (reuse)
```

**Modified:**
```
src/pages/ExperiencePage.tsx  (update to use ExperienceTimeline)
```

---

## Implementation Plan

### Phase 1: Foundation & Data Setup (1-2 days)
1. Create type definitions (`types/experience.ts`)
2. Create `experienceData.ts` with real/sample data
3. Implement `useSpiralPosition` hook with math
4. Test spiral position calculations
5. Create `useScrollTimeline` hook skeleton
6. Set up project structure

### Phase 2: Core 3D Scene (2-3 days)
1. Build `ExperienceTimeline.tsx` container
2. Build `TimelineScene.tsx` with camera and lighting
3. Create `SpiralPath.tsx`:
   - Generate curve from spiral formula
   - Create TubeGeometry
   - Apply gradient material
   - Add emissive glow
4. Test spiral rendering and gradient
5. Add pulse animation to tube

### Phase 3: Experience Cards (2-3 days)
1. Build `ExperienceCard.tsx` 3D component
2. Position cards along spiral using hook
3. Implement billboard orientation
4. Build `CardContent.tsx` HTML overlay:
   - Layout structure
   - Glassmorphic styling
   - Company logo, role, achievements
   - Tech pills integration
5. Add idle animations (float, wobble)
6. Test card rendering at all positions

### Phase 4: Camera System (2-3 days)
1. Build `CameraController.tsx`
2. Implement `useAutoPlayIntro` hook:
   - Scene materialization sequence
   - Camera journey animation
   - Control handoff timing
3. Connect `useScrollTimeline` to camera position
4. Add smooth camera lerping
5. Test navigation smoothness
6. Implement distance-based card fading

### Phase 5: Card Interactions (2-3 days)
1. Add hover states to cards
2. Implement click detection on cards
3. Build `useCameraTransition` hook:
   - Fly-to-closeup animation
   - Card scale-up during transition
   - Content reveal sequence
4. Implement exit transition:
   - Return-to-timeline animation
   - Position memory system
5. Add keyboard support (Enter, ESC)
6. Test full interaction cycle

### Phase 6: Background Effects (2-3 days)
1. Integrate `StarField.tsx` from Skills page
2. Build `NebulaClouds.tsx`:
   - Create gradient sprite textures
   - Position clouds in scene
   - Add drift animation
3. Build `FloatingParticles.tsx`:
   - InstancedMesh setup
   - Perlin noise movement
   - Color variation system
4. Add energy flow particles to spiral
5. Implement parallax for depth
6. Test all effects together

### Phase 7: UI Controls (1-2 days)
1. Build `TimelineProgress.tsx`:
   - Glassmorphic styling
   - Year range calculation
   - Position dot animation
   - Scroll sync
2. Integrate `ExitButton.tsx` from Skills
3. Add hint text overlays:
   - "Scroll to explore"
   - "Click anywhere to return"
   - Timed fade in/out
4. Test UI responsiveness

### Phase 8: Optimization & Performance (2-3 days)
1. Implement frustum culling for cards
2. Optimize instanced meshes
3. Add on-demand rendering
4. Implement distance-based culling
5. Profile with Chrome DevTools:
   - Identify bottlenecks
   - Optimize render loops
   - Test memory usage
6. Achieve 60fps target
7. Add performance monitoring

### Phase 9: Mobile & Responsive (2-3 days)
1. Add device detection logic
2. Implement mobile effect reductions:
   - Particle count reduction
   - Simplified materials
   - Disable bloom
3. Build touch gesture handlers:
   - Vertical swipe scroll
   - Tap interactions
   - Momentum scrolling
4. Adjust layout for mobile:
   - Smaller cards
   - Reduced typography
   - Tighter spacing
5. Test on actual mobile devices
6. Optimize for various screen sizes

### Phase 10: Accessibility & Fallback (2-3 days)
1. Build `FallbackTimeline.tsx` 2D version:
   - Vertical timeline layout
   - Accordion expansion
   - CSS animations only
2. Add WebGL detection and fallback logic
3. Implement reduced-motion support
4. Add keyboard navigation:
   - Tab cycling
   - Arrow key timeline movement
   - Enter/ESC handlers
5. Implement ARIA labels and roles
6. Add screen reader announcements
7. Test with assistive technologies:
   - NVDA screen reader
   - VoiceOver
   - Keyboard-only navigation

### Phase 11: Integration & Polish (2-3 days)
1. Update `ExperiencePage.tsx`:
   - Import ExperienceTimeline
   - Remove old content
   - Add loading states
2. Cross-browser testing:
   - Chrome, Firefox, Safari, Edge
   - Mobile browsers
3. Performance audit:
   - Lighthouse
   - WebPageTest
   - Real device testing
4. Bug fixes and polish:
   - Animation timing tweaks
   - Visual adjustments
   - Edge case handling
5. Final QA pass
6. Documentation updates

**Total Estimated Time: 3-4 weeks**

---

## Testing Checklist

### Visual & Animation
- [ ] Page loads with black fade-in
- [ ] Star field appears and twinkles
- [ ] Nebula clouds drift in background
- [ ] Spiral tube draws from top to bottom
- [ ] Tube gradient flows purple → blue → pink correctly
- [ ] Tube pulse animation smooth and synced
- [ ] Energy particles flow along tube (bottom to top)
- [ ] Connection nodes glow at card positions
- [ ] Experience cards materialize sequentially
- [ ] Cards have floating idle animation
- [ ] Cards have subtle wobble animation
- [ ] Auto-play camera travels smoothly down spiral
- [ ] Camera journey shows overview of timeline
- [ ] Intro completes and hands off control

### Navigation
- [ ] Scroll wheel moves camera along timeline
- [ ] Camera follows spiral path correctly
- [ ] Camera looks ahead on tangent
- [ ] Active card highlighted subtly
- [ ] Cards fade based on distance
- [ ] Progress indicator displays year range
- [ ] Progress dot moves with scroll
- [ ] "Scroll to explore" hint appears after intro
- [ ] Hint fades out after duration
- [ ] Camera movement smooth (lerping works)
- [ ] No jarring jumps during scroll

### Card Interactions
- [ ] Hover scales card and adds glow
- [ ] Hover moves card toward camera
- [ ] Tech pills brighten sequentially on hover
- [ ] Click card triggers fly-to-closeup
- [ ] Other cards dim during transition
- [ ] Timeline tube dims during close-up
- [ ] Camera flies smoothly to card
- [ ] Card scales up during flight
- [ ] Content reveals with stagger animation
- [ ] Exit button appears in close-up
- [ ] Click exit returns to timeline
- [ ] Click background also exits
- [ ] ESC key exits close-up
- [ ] Return animation smooth
- [ ] Position memory: Returns to correct scroll position
- [ ] Can click different card from close-up

### Content Display
- [ ] Company logos load and display
- [ ] Role titles formatted correctly
- [ ] Company names displayed
- [ ] Durations formatted (e.g., "Jan 2023 - Present")
- [ ] Achievement bullets display with spacing
- [ ] Custom bullet dots match timeline color
- [ ] Tech pills show with correct category colors
- [ ] Tech pill borders use category accent colors
- [ ] Glassmorphic styling matches design
- [ ] Card borders match timeline gradient position
- [ ] All text readable against backgrounds

### Performance
- [ ] Maintains 60fps on desktop during navigation
- [ ] Maintains 60fps during intro sequence
- [ ] No frame drops during camera transitions
- [ ] Maintains 30fps+ on mobile
- [ ] Scroll handling throttled properly (RAF)
- [ ] No memory leaks over extended session
- [ ] Memory usage stable (<500MB desktop, <200MB mobile)
- [ ] Page loads in <3s on 3G connection
- [ ] Textures load progressively
- [ ] WebGL context doesn't exceed limits
- [ ] CPU usage reasonable (<50% on desktop)

### Mobile & Touch
- [ ] Touch scroll works smoothly
- [ ] Velocity-based momentum scrolling
- [ ] Rubber-band bounce at timeline ends
- [ ] Tap card opens close-up
- [ ] Tap background exits close-up
- [ ] Tap exit button exits close-up
- [ ] Touch targets minimum 44px
- [ ] Haptic feedback on tap (if supported)
- [ ] Effects reduced (fewer particles/stars)
- [ ] No bloom on mobile
- [ ] Layout adjusts for small screens
- [ ] Typography scales appropriately
- [ ] No horizontal scroll
- [ ] Auto-play shorter on mobile (2.5s)
- [ ] Idle animations disabled on mobile

### Accessibility
- [ ] Tab cycles through visible cards
- [ ] Enter key opens focused card close-up
- [ ] Escape key exits close-up
- [ ] Arrow keys move timeline position
- [ ] Home key jumps to newest
- [ ] End key jumps to oldest
- [ ] Focus visible with purple ring
- [ ] Focus indicators clear on all elements
- [ ] Screen reader announces card details
- [ ] Screen reader announces state changes
- [ ] ARIA labels present and meaningful
- [ ] Semantic HTML used throughout
- [ ] Reduced motion shows 2D fallback
- [ ] Keyboard-only navigation fully functional
- [ ] Color contrast meets WCAG AA (4.5:1)
- [ ] All text readable on backgrounds
- [ ] No color-only indicators

### Browser Compatibility
- [ ] Chrome: All features work
- [ ] Firefox: All features work, backdrop-filter OK
- [ ] Safari: All features work, WebGL stable
- [ ] Edge: All features work
- [ ] Mobile Safari: Touch controls work
- [ ] Mobile Chrome: Performance acceptable
- [ ] Samsung Internet: Touch and performance OK
- [ ] WebGL detection works
- [ ] Fallback shows for unsupported browsers
- [ ] No user-agent sniffing (feature detection only)

### Error Handling & Edge Cases
- [ ] WebGL not supported → Shows 2D fallback
- [ ] Reduced motion → Shows 2D fallback
- [ ] Missing company logo → Placeholder shown
- [ ] Missing tech icons → Text-only pills
- [ ] Low FPS detected → Auto-reduces quality
- [ ] Very low FPS (<20) → Offers fallback
- [ ] Page visibility change → Pauses rendering
- [ ] Window resize → Scene adapts correctly
- [ ] No experiences data → Graceful message
- [ ] Network error on textures → Continues with placeholders

---

## Success Criteria

✨ **Experience page creates memorable cinematic journey**
✨ **3D spiral timeline intuitive and engaging**
✨ **Auto-play intro immediately captivates visitors**
✨ **Manual navigation smooth and responsive**
✨ **Glassmorphic cards match site aesthetic perfectly**
✨ **Card interactions provide satisfying feedback**
✨ **Background effects create immersive space atmosphere**
✨ **Performance maintains 60fps on modern devices**
✨ **Mobile experience optimized with touch controls**
✨ **Accessibility score 95+ on Lighthouse**
✨ **Visual consistency with Skills galaxy and Projects grid**
✨ **Timeline tells compelling story of career progression**
✨ **Users spend more time exploring experiences**
✨ **Page becomes memorable portfolio feature**

---

## Design Complete!

This design transforms your Experience page into an immersive 3D journey featuring:

- **Spiral timeline** winding through space from newest to oldest experiences
- **Auto-play cinematic intro** that showcases the timeline journey
- **Glassmorphic space station cards** with comprehensive experience details
- **Smooth camera transitions** for exploring and focusing on experiences
- **Rich space atmosphere:**
  - Twinkling star field
  - Drifting nebula clouds
  - Floating particles with parallax
  - Glowing energy trail along timeline
- **Intuitive navigation:**
  - Scroll-driven timeline movement
  - Click-to-focus interactions
  - Keyboard support
- **Full accessibility:**
  - Keyboard navigation
  - Screen reader support
  - Reduced-motion 2D fallback
  - WCAG AA compliance
- **Performance optimized:**
  - 60fps on desktop
  - Graceful mobile experience
  - Progressive enhancement
  - Automatic quality adjustment

The design maintains perfect consistency with your Skills 3D galaxy and Projects neon grid while creating a unique narrative journey through your career that visitors will remember.
