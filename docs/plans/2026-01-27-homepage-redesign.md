# Homepage Redesign - Interactive & Playful

**Date:** 2026-01-27
**Status:** Approved Design
**Style:** Interactive & Playful with practical UI

## Overview

Redesign the portfolio homepage with an interactive 3D geometric playground, engaging hover effects, and intuitive animations. Focus on creating a memorable first impression while maintaining usability.

## Design Principles

- **Interactive & Playful:** Engaging micro-interactions and responsive elements
- **Performance First:** Respect reduced-motion preferences, optimize 3D rendering
- **Mobile-Friendly:** Touch interactions, responsive layouts, device tilt support
- **Clear Navigation:** CTAs direct to dedicated pages, not modal overlays

## Architecture

### Three Main Zones

1. **Hero Zone** (Full viewport)
2. **Feature Cards Zone** (Auto-height)
3. **Quick Links Footer** (Compact, 80-100px)

---

## Hero Zone (Full Viewport)

### 3D Geometric Playground

**Technology:** Three.js with React Three Fiber

**Elements:**
- 5-7 floating geometric shapes (cubes, spheres, toruses, icosahedrons)
- Mix of wireframe and solid materials
- Color scheme: Purple/violet gradient matching brand (#9333ea)
- Canvas fills viewport with z-index layering behind text content

**Animations:**
- Each shape rotates at different speeds for variety
- Shapes drift and respond to mouse position with elastic physics
- Mouse parallax: shapes follow cursor with spring physics (damping: 20, stiffness: 100)
- Mobile: shapes respond to device tilt via DeviceOrientation API
- Performance: pause animations when not in viewport (Intersection Observer)

### Text Content Overlay

**Greeting:**
```
Hi, I'm Wesley Chou
```

**Typewriter Effect:**
Cycles through:
- "Software Engineer"
- "AR Researcher"
- "Founder"

**Styling:**
- Crisp white text with subtle glow/shadow for readability over 3D background
- Responsive font sizes: 4xl (mobile) → 7xl (desktop)
- Greeting fades in (0.5s), then typewriter starts

### CTA Buttons

**Primary Button:** "View Experience"
- Purple background (#9333ea)
- Navigates to `/experience` page
- Right arrow icon

**Secondary Button:** "Contact Me"
- Outlined style (border, transparent bg)
- Opens `mailto:` link
- Envelope icon

**Hover Effects:**
- Slight lift (translateY: -2px)
- Glow increase
- Scale: 1.05
- Transition: 200ms ease-out

### Scroll Indicator

- Animated mouse icon or down arrow at bottom center
- Bouncing animation (translateY: 0 → 10px, repeat)
- Fades out after first scroll or 3 seconds
- Hidden on mobile

---

## Feature Cards Zone

### Layout

**Grid System:**
- 1 column (mobile) → 3 columns (desktop)
- Equal spacing with gap-6
- Container max-width with horizontal padding
- Centered on page
- Section padding-top: 80-100px from hero

### Card Design

**Initial State (Before Hover):**
- Dimensions: 400px height, maintains aspect ratio
- Rounded corners (rounded-xl)
- Subtle border with purple tint (#9333ea/20)
- Gallery image as background with dimmed overlay (opacity: 0.4)
- Headline text overlaid at bottom with gradient fade
- Subtle shadow (shadow-lg)

**Hover State:**
- Card elevates: translateY(-8px)
- Larger shadow (shadow-2xl)
- Background image zooms: scale(1.1)
- Content area expands/slides up to reveal full paragraph text
- Smooth transition: 300ms ease-out
- Cursor: pointer

### Card Content

**1. About Me Card**
- Background: `pfp.jpg`
- Headline: "About Me"
- Text: "My name is Wei-Lin, but you can call me Wes! I'm a Computer Science senior at University of Central Florida, working at the intersection of software engineering, AI, and entrepreneurship."

**2. My Journey Card**
- Background: `korea.jpg` or `austin.jpeg`
- Headline: "My Journey"
- Text: "In my short two years at UCF, I have deepened my passion for technology, particularly through exploring machine learning, modern software development, and entrepreneurial ventures."

**3. My Interests Card**
- Background: `duck.jpeg`
- Headline: "My Interests"
- Text: "I am an outgoing engineer who is passionate about all things AI and latest tech trends. When I step away from the keyboard, I love hiking, volleyball, playing board games, or planning my next trip abroad!"

### Scroll Animation

- Intersection Observer triggers when card is 20% visible
- Fade in with stagger: 150ms delay between each card
- Slide-up motion: translateY(20px) → 0
- Duration: 600ms ease-out

---

## Quick Links Footer

### Structure

**Dimensions:**
- Height: 80-100px
- Full width with max-width container

**Styling:**
- Dark background (bg-black/80)
- Subtle border-top (border-gray-800)
- Centered content

**Content (Two Rows):**

**Row 1:** Social Icons
- GitHub, LinkedIn, Resume (same as navbar)
- Larger size than navbar (text-3xl)
- Horizontal layout with gap-4

**Row 2:** Copyright & Navigation
- Left: "© 2025 Wesley Chou"
- Right: Quick links "Experience | Projects | Skills"
- Separated by vertical bar
- Text size: sm, muted color

**Interactions:**
- Icon hover: color shift to purple (#9333ea), scale: 1.1
- Link hover: color shift to purple, underline
- Transitions: 200ms ease-out

---

## Animation Specifications

### Entry Animations

**Hero Text:**
- Fade + slide up (translateY: 20px → 0)
- Duration: 800ms
- Easing: ease-out
- Optional: light letter stagger (50ms) - less aggressive than current

**3D Shapes:**
- Fade in (opacity: 0 → 1)
- Scale: 0.8 → 1
- Duration: 1000ms
- Easing: ease-out
- Stagger: 100ms between shapes

**CTA Buttons:**
- Fade + slide up
- Delay: 200ms after text completes
- Duration: 600ms

**Feature Cards:**
- Intersection-based trigger (20% visible)
- Fade + slide up
- Stagger: 150ms between cards
- Duration: 600ms

### Interaction Animations

**Mouse Parallax (3D Shapes):**
- Spring physics: damping 20, stiffness 100
- Smooth follow with elastic feel
- Throttled to 60fps for performance

**Button Hovers:**
- Scale: 1.05
- Shadow increase
- Duration: 200ms ease-out

**Card Hovers:**
- Elevation: translateY(-8px)
- Background zoom: scale(1.1)
- Content expansion
- Duration: 300ms ease-out

**Scroll Indicator:**
- Continuous bounce
- translateY: 0 → 10px
- Duration: 1500ms
- Easing: ease-in-out
- Repeat: infinite

### Performance & Accessibility

**Performance Optimizations:**
- 3D shapes use `will-change: transform`
- Mouse parallax throttled to 60fps
- Lazy load gallery images in cards
- Intersection Observer for scroll-triggered animations
- Pause 3D animations when not in viewport

**Accessibility:**
- Respect `prefers-reduced-motion`:
  - Disable 3D mouse parallax
  - Replace slide/scale animations with simple fades
  - Remove continuous bounce on scroll indicator
- Ensure sufficient color contrast on text overlays
- Keyboard navigation for all interactive elements
- ARIA labels on buttons and links

---

## Technical Stack

### Libraries

- **Three.js + React Three Fiber:** 3D geometric playground
- **Framer Motion:** Card animations, scroll-triggered reveals
- **GSAP (existing):** Typewriter effect, optional text animations
- **React Router:** Navigation for CTA buttons
- **Intersection Observer API:** Scroll-based animation triggers

### Components to Build

1. `Hero3DPlayground.tsx` - Three.js canvas with geometric shapes
2. `FeatureCard.tsx` - Reusable hoverable card component
3. `TypewriterText.tsx` - Cycling text effect (reuse existing TextType)
4. `ScrollIndicator.tsx` - Animated scroll prompt

### Components to Modify

1. `HomePage.tsx` - Complete restructure
2. `NavBar.tsx` - No changes needed (already in place)

### Assets Needed

- Existing gallery images (pfp.jpg, korea.jpg, austin.jpeg, duck.jpeg)
- No new assets required

---

## Implementation Notes

### Phase 1: Hero Zone
1. Set up Three.js canvas with React Three Fiber
2. Create geometric shapes with materials
3. Implement mouse parallax system
4. Add text overlay with typewriter
5. Style CTA buttons with hover states

### Phase 2: Feature Cards
1. Build FeatureCard component with hover states
2. Implement image backgrounds with zoom effect
3. Add scroll-triggered animations
4. Integrate gallery images

### Phase 3: Footer & Polish
1. Create footer with social icons
2. Add scroll indicator
3. Test reduced-motion preferences
4. Performance audit and optimizations

### Testing Checklist

- [ ] Hero loads without flash (font preloading already fixed)
- [ ] 3D shapes perform smoothly on desktop (60fps)
- [ ] Mouse parallax feels natural, not janky
- [ ] Card hovers expand/collapse smoothly
- [ ] Mobile: device tilt works, cards stack properly
- [ ] CTAs navigate to correct destinations
- [ ] Reduced-motion disables parallax and complex animations
- [ ] All interactive elements keyboard accessible
- [ ] Images lazy load properly

---

## Success Criteria

- Homepage creates strong first impression with 3D playground
- User engagement increases (hover interactions, scroll depth)
- Page loads quickly (< 3s on 3G)
- Animations feel polished, not distracting
- Mobile experience is smooth and touch-friendly
- Accessibility score maintains 90+ (Lighthouse)
