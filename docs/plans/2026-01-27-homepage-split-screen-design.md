# Homepage Split-Screen Layout Design

**Date:** 2026-01-27
**Status:** Approved
**Feature:** Split-screen hero layout with 3D spaceship and name/intro

## Overview

Transform the homepage hero section into a modern split-screen layout featuring a 3D spaceship model on the left and name/intro content on the right. This creates an engaging first impression while maintaining clean separation of visual and textual content.

## Design Goals

- Create visual impact with 3D spaceship model
- Maintain clear information hierarchy with split-screen layout
- Provide engaging mouse parallax interaction
- Ensure responsive behavior across devices
- Preserve performance and accessibility

## Layout Structure

### Desktop (md breakpoint and above)
- **50/50 horizontal split**
- Left section: 3D spaceship scene
- Right section: Name, title animation, CTA buttons
- Both sections full viewport height (min-h-screen)
- Fixed/sticky positioning to keep layout stable

### Mobile/Tablet (below md breakpoint)
- **Vertical stack**
- Top: Spaceship scene (50vh or similar)
- Bottom: Name and content
- Natural scrolling behavior
- Content flows vertically

## Component Architecture

### New: SpaceshipScene Component

**Purpose:** Display and animate the 3D spaceship model

**Implementation:**
- Use @react-three/fiber for Three.js integration
- Use @react-three/drei utilities (useGLTF, OrbitControls alternatives)
- Load spaceship.glb from public/models directory
- Implement mouse parallax with smooth interpolation
- Position camera at appealing angle
- Add lighting setup (ambient + directional)

**Key Features:**
- Mouse position tracking in normalized coordinates
- Smooth lerp interpolation (factor 0.05-0.1)
- Preloading to prevent flicker
- Optional loading state
- Cleanup on unmount

### Modified: HomePage Component

**Changes:**
- Replace Hero3DPlayground import with SpaceshipScene
- Restructure hero section with flex layout
- Split into left (spaceship) and right (text) containers
- Apply responsive classes for mobile stacking
- Remove current 3D background

**Layout Structure:**
```
<section className="flex flex-col md:flex-row min-h-screen">
  <div className="left-section md:w-1/2">
    <SpaceshipScene />
  </div>
  <div className="right-section md:w-1/2">
    {/* Existing name, TextType, CTAs */}
  </div>
</section>
```

## Asset Management

1. **Copy spaceship.glb** from `Threlte-in-practice-spaceship/static/models/` to `public/models/`
2. **Preload model** using useGLTF.preload() to prevent loading delays
3. **Optional loading state** while model loads on first visit

## Visual Effects

### Mouse Parallax
- Track mouse position across viewport
- Apply subtle rotation to spaceship model (max 15-20 degrees)
- Rotate on both X and Y axes for depth
- Use smooth lerp for natural following motion
- Spaceship tilts as if "looking" at cursor

### Lighting Setup
- Ambient light for base illumination
- 2-3 directional lights to create depth
- Position lights to highlight spaceship details
- Avoid flat, washed-out appearance

### Optional Enhancements
- Subtle floating animation (gentle vertical movement)
- Star field or particle background in spaceship section
- Gradient backgrounds to make sections distinct

### Color Scheme
- Maintain existing purple/violet accents (#9333ea, #a78bfa)
- Dark background for spaceship section
- White text for right section
- Consistent with existing brand

## Interaction Behavior

### Desktop
- Mouse parallax enabled by default
- Smooth camera/model rotation following cursor
- Hover states on CTA buttons remain unchanged

### Mobile
- No mouse parallax (no cursor)
- Static spaceship display or gentle auto-rotation
- Touch interactions for buttons work as expected

### Reduced Motion
- Disable all parallax effects
- Disable floating animations
- Show static spaceship view
- Respect prefers-reduced-motion media query

## Performance Optimization

1. **Conditional Rendering**
   - Use frameloop="demand" when section not in viewport
   - Pause rendering when user scrolls below hero

2. **Model Optimization**
   - Use existing spaceship.glb (check file size)
   - Consider LOD (Level of Detail) if performance issues
   - Lazy load 3D scene (show text first)

3. **Cleanup**
   - Proper disposal of Three.js resources
   - Remove event listeners on unmount
   - Clear animation frames

## Accessibility

- Add `aria-hidden="true"` to decorative 3D canvas
- Ensure text contrast ratios meet WCAG AA standards
- Keyboard navigation works for all interactive elements
- Focus indicators visible on CTA buttons
- Respect `prefers-reduced-motion` preference
- Screen readers can access all text content

## Technical Dependencies

**Existing:**
- @react-three/fiber
- @react-three/drei (likely needed for useGLTF)
- framer-motion (for existing animations)
- three (peer dependency)

**Potentially New:**
- @react-three/drei (if not already installed)

**Check:** Verify Three.js version compatibility with React Three Fiber

## Implementation Checklist

- [ ] Copy spaceship.glb to public/models/
- [ ] Create SpaceshipScene component
- [ ] Implement mouse parallax logic
- [ ] Set up lighting and camera
- [ ] Update HomePage layout structure
- [ ] Add responsive styling (Tailwind classes)
- [ ] Test on mobile devices
- [ ] Verify accessibility features
- [ ] Test with prefers-reduced-motion
- [ ] Performance testing and optimization
- [ ] Cross-browser testing

## Success Criteria

- Spaceship loads and displays correctly
- Split-screen layout works on desktop
- Vertical stack works on mobile
- Mouse parallax is smooth and responsive
- No performance degradation (60fps maintained)
- All accessibility requirements met
- Existing content (feature cards, footer) unaffected

## Future Considerations

- Add subtle background effects (stars, particles)
- Experiment with different camera angles
- A/B test with/without floating animation
- Consider adding sound effects (optional, on user interaction)
