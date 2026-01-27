# Projects Page Redesign - Neon Futuristic Grid

**Date:** 2026-01-27
**Status:** Approved Design
**Style:** Animated 3D grid with neon futuristic space theme

## Overview

Redesign the Projects page with an animated grid featuring 3D depth layers, neon glowing effects, and immersive modal overlays. Cards float at different z-depths with parallax scrolling, while maintaining usability and professional polish. Modal transitions morph cards into full-screen glassmorphic showcases.

## Design Principles

- **Animated Grid with Depth:** 3D layering and parallax create spatial depth
- **Subtle and Refined:** Neon effects enhance without overwhelming
- **Immersive Modals:** Full-screen glassmorphic overlays for project details
- **Performance First:** 60fps animations, respect reduced-motion
- **Professional Polish:** Futuristic aesthetic maintains credibility
- **Mobile-Friendly:** Touch interactions and responsive layouts

## Architecture

### Three Main Zones

1. **Header Zone** (Fixed, ~200px) - Glassmorphic sticky header
2. **3D Grid Zone** (Main content) - Parallax depth system
3. **Background Effects Layer** (Behind content) - Particles and ambient lighting

---

## Header Zone (Glassmorphic)

### Styling

**Glassmorphism Effect:**
- Background: `bg-black/40 backdrop-blur-xl`
- Border: `border-b border-purple-500/20`
- Position: Sticky top with z-index: 40
- Shadow: `shadow-lg shadow-black/10`

**Layout:**
- Padding: `py-12 px-6`
- Centered content with `max-w-6xl`
- Text alignment: center

### Content

**Title:**
- SplitText animation (existing component)
- Text: "Projects"
- Styling: `text-5xl font-semibold`
- Animation: Character stagger, fade + slide up
- Delay: 100ms, Duration: 0.4s, Easing: power3.out

**Subtitle:**
- Text: "Explore a selection of projects throughout my developer journey."
- Styling: `text-lg text-white/80`
- Animation: Fade in 200ms after title

**Optional Enhancement:**
- Filter chips: All, Web, AI, Mobile
- Neon pill styling with purple borders
- Click to filter projects by category
- Can be added in future iteration

---

## 3D Grid Zone - Parallax Depth System

### Grid Layout

**Structure:**
- Grid: `grid-cols-1 md:grid-cols-2 gap-8`
- Container: `max-w-6xl mx-auto px-6`
- Padding: `py-16 mb-20`

**Depth Layer System:**

Projects assigned to 3 depth layers in alternating pattern:

| Layer | Z-Depth | Scale | Parallax Speed | Visual Effect |
|-------|---------|-------|----------------|---------------|
| Front | 0px | 1.0 | 1.0x | Closest, full size |
| Mid | -20px | 0.95 | 0.8x | Slightly behind |
| Back | -40px | 0.9 | 0.6x | Furthest, smaller |

**Assignment Pattern:**
- Card 1 (Emergent): Front
- Card 2 (InsightAI): Mid
- Card 3 (Sonara): Back
- Card 4 (FitLink): Front
- Card 5 (FairMap): Mid
- Card 6 (FindMyFriend): Back

### Parallax Mouse Effect

**Mouse Tracking:**
- Track mouse position relative to viewport center
- Calculate offset: `(mouseX - centerX, mouseY - centerY)`
- Throttled to 60fps for performance

**Layer Movement:**
- Front layer: Moves 10px with mouse
- Mid layer: Moves 5px with mouse
- Back layer: Moves 2px with mouse
- Spring physics: damping 20, stiffness 100
- Creates depth illusion as cursor moves

**Mobile:**
- Disable mouse parallax
- Keep depth layers static (still scaled)

### Scroll Parallax

**Vertical Scroll Response:**
- Front layer: 1:1 scroll ratio (normal scroll)
- Mid layer: 0.8:1 scroll ratio (slower)
- Back layer: 0.6:1 scroll ratio (slowest)
- Creates depth sensation while scrolling

**Card Reveal Animation:**
- Intersection Observer triggers at 30% visibility
- Below-fold cards animate in when scrolled into view
- Animation: Fade + slide up + scale
  - Opacity: 0 → 1
  - TranslateY: 60px → 0
  - Scale: 0.9 → target scale (based on depth layer)
  - Rotation: rotateX(10deg) → 0
- Stagger: 200ms between cards
- Duration: 800ms ease-out
- Triggers once per card

---

## Project Card Design

### Card Container

**Dimensions:**
- Aspect ratio: `aspect-[4/3]`
- Responsive sizing based on grid

**Base Styling:**
- Background: `bg-black/60 backdrop-blur-md`
- Border radius: `rounded-2xl`
- Shadow: `shadow-xl shadow-purple-500/10`
- Position: relative
- Overflow: hidden (for image zoom)

**Neon Border:**
- Width: 2px solid border
- Color: Badge color with 50% opacity (e.g., `border-indigo-300/50`)
- Pulse animation (idle):
  - Opacity: 0.5 → 0.7 → 0.5
  - Duration: 3s infinite ease-in-out
  - Creates subtle "breathing" effect

**Border Color Mapping:**
- Emergent: `border-indigo-300/50`
- InsightAI: `border-blue-300/50`
- Sonara: `border-lime-300/50`
- FitLink: `border-red-300/50`
- FairMap: `border-blue-300/50`
- FindMyFriend: `border-lime-300/50`

### Card Content Layout

**Image Section (Top 60%):**
- Position: relative
- Height: 60% of card
- Image: `object-cover w-full h-full`
- Overlay gradient: `bg-gradient-to-b from-black/40 via-transparent to-black/80`
- Badge: Positioned absolute top-right

**Content Section (Bottom 40%):**
- Padding: `p-5`
- Background: `bg-black/40`

**Title:**
- Text: `text-xl font-bold text-white`
- Margin: `mb-2`

**Date:**
- Text: `text-sm text-white/60`
- Icon: Calendar icon before text
- Margin: `mb-4`

**Tech Pills Container:**
- Layout: Horizontal scrollable flex
- Gap: `gap-2`
- Show 3-4 pills, rest scroll
- Fade gradient at right edge
- Scrollbar hidden

### Badge Design (Featured Projects)

**Position:**
- Absolute: `top-4 right-4`
- Z-index: 10

**Styling:**
- Background: `bg-black/80 backdrop-blur-sm`
- Border: `2px solid [badgeColor]`
- Text: "Featured" in badge color
- Padding: `px-3 py-1.5`
- Border radius: `rounded-full`
- Font: `text-xs font-semibold uppercase tracking-wide`

**Glow Effect:**
- Box shadow: `shadow-lg shadow-[badgeColor]/60`
- Pulse animation:
  - Shadow opacity: 60% → 100% → 60%
  - Duration: 2s infinite
  - Creates beacon/notification effect

### Card Hover State

**3D Transformation:**
- Transform: `translateZ(40px) scale(1.03)`
- Mouse position tilt:
  - Calculate mouse relative to card center
  - RotateX: ±3deg based on Y position
  - RotateY: ±3deg based on X position
- Duration: 400ms ease-out
- Spring physics: damping 15, stiffness 150

**Visual Effects:**
- Border: Brightness 150%, width 2px → 3px
- Shadow: `shadow-2xl shadow-[badgeColor]/30`
- Image: `scale(1.1)` zoom effect
- Tech pills: Border colors brighten to full opacity
- Cursor: pointer

**Particle Trail Effect:**
- On hover entry: 5-8 particles emit from card corners
- Particle color: Badge color
- Animation: Drift outward 20-30px with fade
- Duration: 600ms
- Opacity: 1 → 0
- Size: 3-4px circles

**Hover Exit:**
- All effects reverse smoothly
- Duration: 350ms ease-in
- Particles complete fade-out

### Tech Pill Component

**Base Styling:**
- Background: `bg-gradient-to-r from-gray-800/50 to-gray-700/50`
- Border: `1px solid white/10`
- Border bottom: `2px solid [categoryColor]` (neon accent)
- Border radius: `rounded-full`
- Padding: `px-3 py-1`
- Font: `text-xs text-white/80`
- White space: `whitespace-nowrap`

**Category Colors:**
```typescript
const techColors = {
  frontend: '#9333ea',    // Purple (React, Next.js, TypeScript, Tailwind)
  backend: '#3b82f6',     // Blue (Python, FastAPI, Node.js, Express)
  database: '#10b981',    // Green (MongoDB, Firebase, SQLite, Supabase)
  ai: '#ec4899',          // Pink (Gemini, TensorFlow, OpenCV)
  devops: '#f59e0b'       // Orange (Docker, APIs, Websockets)
};
```

**Hover State (in modal):**
- Scale: 1.05
- Shadow: `shadow-lg shadow-[categoryColor]/30`
- Border brightness: 150%
- Background: Lightens to `from-gray-700/60 to-gray-600/60`
- Duration: 200ms ease-out

---

## Modal Design

### Modal Overlay

**Full-Screen Container:**
- Position: `fixed inset-0`
- Background: `bg-black/90 backdrop-blur-2xl`
- Z-index: 100
- Padding: `p-8 md:p-12`
- Flex: Centers content vertically and horizontally

**Backdrop Interaction:**
- Click background (outside content) to close
- Hint text: "Click outside or press ESC to close"
- Text position: `fixed bottom-8 left-1/2 -translate-x-1/2`
- Font: `text-sm text-white/50`
- Fade in after 1s, fade out after 4s

### Modal Content Container

**Dimensions:**
- Max width: `max-w-5xl`
- Max height: `max-h-[90vh]`
- Overflow: Auto scroll if needed

**Styling:**
- Background: `bg-gradient-to-br from-gray-900/80 to-black/80`
- Glassmorphism: `backdrop-blur-lg`
- Border: `3px solid [badgeColor]/60`
- Border radius: `rounded-3xl`
- Shadow: `shadow-2xl shadow-[badgeColor]/40`
- Padding: `p-8 md:p-12`

**Animated Border Effect:**
- Gradient border that rotates around edges
- Keyframe animation shifting gradient angle
- Duration: 4s infinite linear
- Creates "scanning" neon effect
- Implementation: Use pseudo-element with conic-gradient

### Modal Layout

**Desktop (Two-Column):**

**Left Column (40%):**
- Project image container
- Aspect ratio: `aspect-video`
- Border radius: `rounded-2xl`
- Border: `2px solid [badgeColor]/40`
- Shadow: `shadow-lg shadow-[badgeColor]/20`
- Image hover: `scale(1.02)` subtle zoom

**Right Column (60%):**
- Project details and metadata
- Padding: `pl-8`
- Overflow: Auto scroll if needed

**Mobile (Single Column):**
- Image on top (full width)
- Details below
- Padding: `p-6`

### Modal Content Structure

**Header Section:**
- Title: `text-4xl font-bold text-white mb-2`
- Badge: Inline with title if featured, larger size
- Date: `text-base text-white/60 flex items-center gap-2 mb-6`
- Divider: `border-t border-[badgeColor]/30 my-6`

**Description:**
- Text: `text-lg text-white/90 leading-relaxed`
- Full project description (expanded from card)
- Multiple paragraphs supported
- Links: Purple with underline
- Margin: `mb-8`

**Tech Stack Section:**
- Heading: "Technologies" `text-xl font-semibold text-white mb-4`
- Grid: `grid-cols-2 md:grid-cols-3 gap-3`
- Enhanced tech pills (larger than card version)

**Enhanced Tech Pill (Modal Version):**
- Background: `bg-gradient-to-br from-gray-800/60 to-gray-900/60`
- Border: `2px solid [categoryColor]/60`
- Glow: `shadow-md shadow-[categoryColor]/20`
- Padding: `px-4 py-2.5`
- Font: `text-sm font-medium`
- Optional: 16px tech logo icon before text
- Hover: Scale, glow increase, border brighten

**Action Buttons:**
- Layout: Flex row with gap-4
- Margin top: `mt-8`

**Primary Button:** "View Project"
- Background: `bg-gradient-to-r from-purple-600 to-purple-500`
- Text: White with right arrow icon
- Shadow: `shadow-lg shadow-purple-500/40`
- Padding: `px-6 py-3`
- Border radius: `rounded-lg`
- Hover: Scale 1.05, shadow increase

**Secondary Button:** "View Code" (if GitHub available)
- Background: Transparent
- Border: `2px solid white/20`
- Text: White with GitHub icon
- Padding: `px-6 py-3`
- Border radius: `rounded-lg`
- Hover: Border → purple, background → purple/20

**Mobile:**
- Stack buttons vertically
- Full width

### Close Button

**Position:**
- Fixed: `top-6 right-6`
- Z-index: 101 (above modal content)

**Styling:**
- Size: 56px × 56px circle
- Background: `bg-black/60 backdrop-blur-md`
- Border: `2px solid purple-500/40`
- Icon: "X" `text-2xl text-white`
- Shadow: `shadow-lg shadow-black/20`

**Hover:**
- Rotate: 90deg
- Scale: 1.1
- Glow: `shadow-xl shadow-purple-500/60`
- Border: `border-purple-500`
- Duration: 300ms ease-out

**Keyboard:**
- ESC key closes modal
- Focus visible: Purple ring

---

## Background Effects Layer

### Particle Field

**Implementation:**
- React Three Fiber canvas
- Z-index: -1 (behind all content)
- Position: Fixed or absolute covering viewport

**Particles:**
- Count: 50-100 (desktop), 25 (mobile)
- Size: 1-2px circles
- Colors: Mix of white (60%) and purple (40%)
  - White: `rgba(255, 255, 255, 0.4)`
  - Purple: `rgba(147, 51, 234, 0.4)`
- Distribution: Random across 3D space

**Animation:**
- Slow drift using Perlin noise
- Speed: 0.1-0.3 units/frame
- Direction: Generally upward and outward
- Wrapping: Particles that exit top/sides respawn at bottom
- Scroll response: Drift upward at 0.2x scroll velocity

**Performance:**
- Instanced mesh for single draw call
- Frustum culling enabled
- Pause when page not visible
- Reduce particle count on mobile

### Ambient Lighting

**Radial Gradient:**
- Position: Top-center of viewport
- Gradient: `radial-gradient(circle at 50% 0%, rgba(147, 51, 234, 0.1) 0%, transparent 50%)`
- Creates atmospheric purple glow
- Fixed position (doesn't scroll)

**Optional Grid Lines:**
- Faint purple grid overlay
- Line width: 1px
- Spacing: 100px × 100px
- Color: `rgba(147, 51, 234, 0.05)`
- Creates tech/blueprint aesthetic
- SVG pattern or CSS background

---

## Animations & Transitions

### Page Entry Animations

**Initial Load Sequence:**

1. **Title (0ms):**
   - SplitText character stagger
   - Existing animation preserved

2. **Subtitle (400ms delay):**
   - Fade in: opacity 0 → 1
   - Duration: 600ms

3. **Grid Cards (600ms delay):**
   - Cards fade in with 200ms stagger
   - Each card animation:
     - Opacity: 0 → 1
     - TranslateY: 60px → 0
     - Scale: 0.9 → target scale (based on depth)
     - RotateX: 10deg → 0
   - Duration: 800ms ease-out
   - Creates cascade effect

4. **Particle Field (800ms delay):**
   - Fade in: opacity 0 → 1
   - Duration: 1200ms
   - Particles immediately begin drifting

### Card Hover Animations

**Hover Enter Sequence:**

1. **3D Lift (0-400ms):**
   - Transform: `translateZ(40px) scale(1.03)`
   - Spring animation: damping 15, stiffness 150
   - Smooth and bouncy

2. **Mouse Position Tilt:**
   - Calculate mouse position relative to card center
   - RotateX: ±3deg based on vertical mouse position
   - RotateY: ±3deg based on horizontal mouse position
   - Updates continuously while hovering
   - Spring physics for smooth following

3. **Border Glow (0-200ms):**
   - Border brightness: 150%
   - Border width: 2px → 3px
   - Transition: 200ms ease-out

4. **Shadow Expansion (0-300ms):**
   - Shadow: `shadow-2xl shadow-[badgeColor]/30`
   - Glow expands and intensifies

5. **Image Zoom (0-400ms):**
   - Image scale: 1.0 → 1.1
   - Blur: Slightly reduce for sharpness
   - Duration: 400ms ease-out

6. **Particle Emission (100-700ms):**
   - 5-8 particles spawn from card corners
   - Particle color: Badge color
   - Drift outward 20-30px
   - Fade: opacity 1 → 0
   - Duration: 600ms

7. **Tech Pills Brighten (100-500ms):**
   - Sequential stagger: 50ms per pill
   - Border: Full opacity and category color
   - Slight scale: 1.02

**Hover Exit:**
- All effects reverse
- Duration: 350ms ease-in
- Particles complete fade-out

### Modal Open Transition (1.2s)

**Step 1: Preparation (0-200ms):**
- Background overlay fades in: opacity 0 → 1
- Other cards dim: opacity 1 → 0.3
- Clicked card maintains position and visibility
- Disable scroll on body

**Step 2: Card Expansion (200-600ms):**
- Clicked card scales: 1.0 → 1.2
- Card moves to viewport center
- Z-index: 99
- Border glow intensifies
- Easing: ease-out

**Step 3: Morph Transformation (600-900ms):**
- Card expands to modal dimensions
- Content container reshapes (aspect ratio changes)
- Image repositions to left column
- Details area expands on right
- Easing: cubic-bezier(0.34, 1.56, 0.64, 1) for bounce

**Step 4: Content Reveal (900-1200ms):**
- Modal content fades in:
  - Full description
  - Tech pill grid (stagger 50ms per pill)
  - Action buttons slide up from bottom
- Close button fades in
- Hint text appears and begins fade cycle

### Modal Close Transition (800ms)

**Reverse Sequence:**

1. **Content Fade Out (0-200ms):**
   - All modal content: opacity 1 → 0
   - Tech pills, buttons, description

2. **Modal Shrink (200-600ms):**
   - Modal morphs back to card shape
   - Moves to original grid position
   - Scale: 1.0 → 1.03 (match hover)
   - Easing: ease-in-out

3. **Grid Return (600-800ms):**
   - Card settles to normal state
   - Other cards brighten: opacity 0.3 → 1
   - Background overlay fades out
   - Re-enable body scroll

**Position Memory:**
- Modal tracks original card position
- Returns to exact grid location
- Maintains scroll position
- Smooth even if user scrolled while modal open

---

## Data Structure

### Project Interface

```typescript
interface Project {
  id: string;
  badge?: boolean;
  title: string;
  description: string; // Short version for card
  fullDescription: string; // Extended for modal (2-3 paragraphs)
  date: string;
  imageUrl: string;
  detailsUrl: string; // Project demo/Devpost link
  githubUrl?: string; // GitHub repository (optional)
  tech: TechItem[];
  badgeColor: string;
  depth: 1 | 2 | 3; // Depth layer assignment
}

interface TechItem {
  name: string;
  category: 'frontend' | 'backend' | 'database' | 'ai' | 'devops';
  icon?: ReactNode; // Optional tech logo (for future enhancement)
}
```

### Tech Category Mapping

```typescript
const techCategoryColors = {
  frontend: '#9333ea',    // Purple
  backend: '#3b82f6',     // Blue
  database: '#10b981',    // Green
  ai: '#ec4899',          // Pink
  devops: '#f59e0b'       // Orange
};

// Example mappings:
const techCategories = {
  'React': 'frontend',
  'Next.js 14': 'frontend',
  'Next.js 15': 'frontend',
  'TypeScript': 'frontend',
  'Tailwind CSS': 'frontend',
  'Flutter': 'frontend',
  'Python': 'backend',
  'FastAPI': 'backend',
  'Node.js': 'backend',
  'Express.js': 'backend',
  'Django': 'backend',
  'PHP': 'backend',
  'MongoDB': 'database',
  'Firebase': 'database',
  'SQLite': 'database',
  'Supabase': 'database',
  'Gemini': 'ai',
  'Gemini API': 'ai',
  'Google ADK': 'ai',
  'TensorFlow': 'ai',
  'OpenCV': 'ai',
  'Eye Tracking': 'ai',
  'Websockets': 'devops',
  'Google Calendar APIs': 'devops',
  'Census API': 'devops',
  'Parallel Processing': 'devops',
  // ... etc
};
```

---

## Performance & Optimization

### 3D Rendering Performance

**GPU Acceleration:**
- Use CSS `transform: translateZ()` for depth
- Apply `will-change: transform` during hover
- Remove `will-change` after animation completes
- All animations use `transform` and `opacity` (GPU properties)

**Parallax Optimization:**
- Throttle mouse move handler to 60fps
- Use `requestAnimationFrame` for smooth updates
- Debounce scroll handlers
- Only update transforms when necessary

**Particle System:**
- Single instanced mesh for all particles
- Update positions in single draw call
- Frustum culling: Don't render off-screen particles
- Pause rendering when page hidden (Page Visibility API)

### Image Loading

**Lazy Loading:**
- Use `loading="lazy"` on all images
- Preload first 2 project images (above fold)
- Blur placeholder while loading
- Intersection Observer for below-fold images

**Optimization:**
- Compress project images (WebP format)
- Responsive images: Serve appropriate sizes
- Preload modal image when card hovered (anticipation)

### Animation Performance

**Reduced Motion Support:**
```css
@media (prefers-reduced-motion: reduce) {
  /* Disable: */
  - 3D transforms (translateZ, rotateX, rotateY)
  - Parallax effects (mouse and scroll)
  - Particle field rendering
  - Scale animations
  - Particle trail effects

  /* Keep: */
  - Simple opacity fades
  - Color transitions
  - Border color changes

  /* Modal: */
  - Direct fade in/out (no morph)
  - No card expansion animation
}
```

**Performance Monitoring:**
- Target: 60fps during all animations
- Budget: < 16ms per frame
- Use Chrome DevTools Performance panel
- Monitor: Paint times, composite layers

---

## Accessibility

### Keyboard Navigation

**Grid View:**
- Tab: Cycles through project cards in order
- Enter/Space: Opens modal for focused card
- Focus visible: `ring-2 ring-purple-500 ring-offset-2 ring-offset-black`
- Skip link: "Skip to projects" jumps to grid

**Modal View:**
- Focus trap: Tab cycles only within modal
- Tab order: Close button → Action buttons → Tech pills
- Enter: Activates focused button
- ESC: Closes modal
- First focus: Close button (easy exit)

### Screen Reader Support

**ARIA Labels:**
- Cards: `aria-label="View details for [Project Name]"`
- Modal: `role="dialog" aria-modal="true" aria-labelledby="modal-title"`
- Close button: `aria-label="Close project details"`
- Tech pills container: `role="list"`
- Each tech pill: `role="listitem"`

**State Announcements:**
- Modal open: "Project details opened for [Project Name]"
- Modal close: "Returned to projects grid"
- Focus changes announced naturally

**Semantic HTML:**
- Use `<article>` for each project card
- Use `<h2>` for project titles
- Use `<time>` for dates with datetime attribute
- Use `<button>` for clickable cards (not divs)

### Color Contrast

**Text Contrast:**
- White on black/dark gray: 14:1+ ratio (AAA)
- White on glassmorphic backgrounds: 7:1+ minimum (AA)
- Neon borders provide visual interest, not sole indicators

**Interactive States:**
- Hover increases contrast (brighter borders, shadows)
- Focus states have visible purple rings
- All states meet WCAG AA standards (4.5:1 minimum)

**Testing:**
- Lighthouse accessibility audit: Target 95+
- WAVE tool: Zero errors
- Keyboard-only navigation test
- Screen reader test (NVDA, VoiceOver)

---

## Responsive Behavior

### Mobile (< 768px)

**Grid:**
- Single column: `grid-cols-1`
- Gap: `gap-6`
- Padding: `px-4`

**Cards:**
- No depth layers (all same z-index)
- No parallax mouse effect
- Simplified hover: Just border glow
- Tap to open modal

**Modal:**
- Single column layout
- Image on top, details below
- Padding: `p-6`
- Buttons stack vertically
- Close button: `top-4 right-4` (smaller spacing)

**Particles:**
- Reduced count: 50 → 25
- Lower canvas resolution
- Simpler drift pattern

### Tablet (768px - 1024px)

**Grid:**
- Two columns maintained
- Slightly reduced gap: `gap-6`
- Full depth system active
- Simplified parallax (less movement range)

**Modal:**
- Two columns if landscape
- Single column if portrait
- Adjust padding: `p-8`

### Desktop (> 1024px)

- Full design as specified
- No compromises
- All effects and animations active
- Optimal spacing and sizing

---

## Technical Implementation

### Technology Stack

**Dependencies (Already Installed):**
- React Three Fiber (@react-three/fiber)
- Drei (@react-three/drei)
- Framer Motion
- React Intersection Observer
- GSAP (existing)

**No New Installations Required!**

### Component Architecture

**New Components:**

1. **`ProjectsGrid.tsx`** - Main container
   - Mouse parallax tracking
   - Depth layer management
   - Renders ParticleField
   - Wraps ProjectCard components

2. **`ProjectCard.tsx`** - Enhanced card (replaces current)
   - 3D hover transformations
   - Neon border with pulse
   - Particle emission
   - Mouse tilt calculation
   - Click handler for modal

3. **`ProjectModal.tsx`** - Modal overlay
   - Glassmorphic container
   - Two-column responsive layout
   - Close mechanisms (button, background, ESC)
   - Focus trap
   - Transition animations

4. **`TechPill.tsx`** - Reusable tech badge
   - Glowing pill with category color
   - Border accent on bottom
   - Hover effects
   - Used in cards and modal

5. **`ParticleField.tsx`** - Background particles
   - React Three Fiber canvas
   - 50-100 particle system
   - Drift and scroll response
   - Performance optimized

6. **`NeonBorder.tsx`** - Animated border wrapper
   - Pulse animation
   - Category color-based
   - Rotating gradient (for modal)

**Existing Components (Reused):**
- `SplitText.tsx` - Title animation
- `NavBar.tsx` - No changes

### Data Migration

**Create:** `src/data/projectsData.ts`

Migrate existing project data from ProjectsPage.tsx with enhancements:
- Add `fullDescription` field (expanded details for modal)
- Convert tech strings to TechItem objects with categories
- Assign depth layers (1, 2, 3)
- Add `githubUrl` where applicable
- Validate all image paths

**Example:**
```typescript
export const projects: Project[] = [
  {
    id: 'emergent',
    badge: true,
    title: 'Emergent',
    description: 'An AI-powered crisis simulation platform...',
    fullDescription: `Emergent is an AI-powered crisis simulation platform that enables emergency managers to test disaster response plans against a dynamic community of 50+ intelligent personas using Google ADK agents.

    The platform features interactive GIS mapping for real-time situation awareness, a sophisticated multi-agent simulation system, and emergent disaster scenarios that evolve based on agent decisions and interactions. Emergency managers can observe how different response strategies play out across diverse community members with unique needs, backgrounds, and capabilities.`,
    date: '2025-10-24',
    imageUrl: 'assets/projects/emergent.png',
    detailsUrl: 'https://devpost.com/software/emergent-b2t1fl',
    githubUrl: undefined, // Add if available
    tech: [
      { name: 'Next.js 14', category: 'frontend' },
      { name: 'TypeScript', category: 'frontend' },
      { name: 'React', category: 'frontend' },
      { name: 'Tailwind CSS', category: 'frontend' },
      { name: 'Python', category: 'backend' },
      { name: 'FastAPI', category: 'backend' },
      { name: 'Google ADK', category: 'ai' },
      { name: 'Parallel Processing', category: 'devops' },
    ],
    badgeColor: 'text-indigo-300',
    depth: 1,
  },
  // ... other projects
];
```

---

## Implementation Plan

### Phase 1: Data Migration & Foundation
1. Create `src/data/projectsData.ts`
2. Migrate all 6 projects with enhanced fields
3. Add full descriptions for each project
4. Categorize all tech items
5. Assign depth layers
6. Validate data structure

### Phase 2: Core Components
1. Build `TechPill.tsx` with category colors
2. Build `NeonBorder.tsx` wrapper
3. Build `ParticleField.tsx` with Three.js
4. Test particle performance independently

### Phase 3: Enhanced Project Cards
1. Create new `ProjectCard.tsx`:
   - Neon border integration
   - 3D hover transforms
   - Mouse tilt calculation
   - Particle emission system
   - Tech pill display
2. Test card animations and interactions

### Phase 4: Grid System
1. Build `ProjectsGrid.tsx`:
   - Depth layer positioning
   - Mouse parallax tracking
   - Scroll parallax system
   - Card reveal animations
2. Integrate ParticleField background
3. Test depth and parallax effects

### Phase 5: Modal System
1. Build `ProjectModal.tsx`:
   - Glassmorphic styling
   - Two-column layout
   - Enhanced tech pill grid
   - Action buttons
   - Close button
2. Implement focus trap
3. Add close mechanisms (button, background, ESC)
4. Test modal interactions

### Phase 6: Transition Animations
1. Implement modal open transition:
   - Card to modal morph
   - Background fade
   - Content reveal
2. Implement modal close transition:
   - Reverse morph
   - Position memory
3. Polish transition timing and easing
4. Test smooth bidirectional transitions

### Phase 7: Polish & Effects
1. Add badge glow pulse animations
2. Implement border pulse on cards
3. Add particle scroll response
4. Create ambient gradient background
5. Optional: Add grid line overlay
6. Test all visual effects

### Phase 8: Accessibility & Responsive
1. Implement reduced-motion fallbacks
2. Add ARIA labels and roles
3. Implement keyboard navigation
4. Add focus trap in modal
5. Mobile layout adjustments
6. Touch interaction testing
7. Screen reader testing
8. Color contrast validation

### Phase 9: Integration & Testing
1. Update `ProjectsPage.tsx`:
   - Replace inline data with import
   - Integrate ProjectsGrid component
   - Remove old ProjectCard
2. Cross-browser testing
3. Performance profiling (60fps target)
4. Mobile device testing
5. Lighthouse audit
6. Final polish and bug fixes

---

## Testing Checklist

**Visual & Animation:**
- [ ] Page loads with staggered card entrance
- [ ] Cards positioned at correct depth layers
- [ ] Neon borders pulse subtly when idle
- [ ] Mouse parallax shifts layers smoothly
- [ ] Scroll parallax creates depth sensation
- [ ] Card hover: 3D lift, tilt, glow, particles
- [ ] Particle trail emits on hover entry
- [ ] Tech pills brighten sequentially on hover
- [ ] Badge glow pulses on featured projects

**Modal Interactions:**
- [ ] Click card opens modal with morph transition
- [ ] Modal displays full project details
- [ ] Tech pills arranged in color-coded grid
- [ ] Action buttons navigate correctly
- [ ] Close button works with hover effects
- [ ] Click background closes modal
- [ ] ESC key closes modal
- [ ] Modal closes with smooth reverse transition
- [ ] Returns to exact card position in grid
- [ ] Scroll position maintained after close

**Accessibility:**
- [ ] Tab navigation works in grid
- [ ] Enter/Space opens modal from focused card
- [ ] Focus visible with purple ring
- [ ] Modal focus trap works
- [ ] ESC closes modal
- [ ] Screen reader announces states
- [ ] ARIA labels present and correct
- [ ] Color contrast meets WCAG AA
- [ ] Reduced-motion disables 3D effects

**Performance:**
- [ ] 60fps during all animations
- [ ] Particle field renders smoothly
- [ ] Mouse parallax throttled properly
- [ ] Images lazy load below fold
- [ ] Mobile: Reduced particle count
- [ ] No layout shift during load
- [ ] Modal morph smooth without jank

**Responsive:**
- [ ] Mobile: Single column grid
- [ ] Mobile: Touch opens modal
- [ ] Mobile: Simplified effects
- [ ] Tablet: Two columns maintained
- [ ] Desktop: Full effects active
- [ ] Modal responsive layout works

**Cross-Browser:**
- [ ] Chrome: All features work
- [ ] Firefox: All features work
- [ ] Safari: Backdrop-blur supported
- [ ] Edge: All features work

---

## Success Criteria

✨ **Projects page matches neon futuristic space theme**
✨ **3D depth and parallax create immersive experience**
✨ **Modal showcases projects professionally**
✨ **Neon effects are subtle and refined**
✨ **Animations smooth and intentional (60fps)**
✨ **Tech stack visualization clear and scannable**
✨ **Mobile experience optimized for touch**
✨ **Accessibility score 95+ (Lighthouse)**
✨ **Visual consistency with Homepage and Skills page**
✨ **Page loads < 3s on 3G connection**

---

## Design Complete!

This design transforms your Projects page into a neon futuristic experience with:
- **Animated grid with 3D depth layers** and parallax effects
- **Neon glowing cards** with pulsing borders and particle trails
- **Immersive glassmorphic modals** with morphing transitions
- **Color-coded tech pills** organized by category
- **Subtle particle field** for atmospheric space theme
- **Professional polish** maintaining usability and accessibility

The design maintains consistency with your Skills galaxy, Homepage 3D playground, and glassmorphic Navbar while giving Projects its own unique identity.

**Shall I write this design document and commit it to git?**