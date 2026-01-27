# Navbar Glassmorphism Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Transform the navbar with glassmorphism effects, animated logo/icons, purple gradient tab selection, and mobile hamburger menu.

**Architecture:** Enhance existing NavBar.tsx component with Tailwind classes for glassmorphism, add React state for mobile menu toggle, implement CSS transforms for hover animations.

**Tech Stack:** React, Headless UI, React Router, React Icons, Tailwind CSS

---

## Task 1: Glassmorphism Base Styling

**Files:**
- Modify: `src/components/NavBar.tsx:16`

**Step 1: Update navbar container with glassmorphism styling**

Replace the main container div className on line 16 with enhanced glassmorphism:

```tsx
<div className="fixed top-0 left-0 z-50 flex h-[72px] w-full items-center justify-between border-b border-purple-500/20 bg-[var(--color-bg)]/60 backdrop-blur-xl shadow-lg shadow-black/10 px-6 font-sans text-xl font-medium tracking-wide text-[var(--color-fg)] transition-all duration-300">
```

**Changes:**
- Height: `h-[var(--nav-height)]` → `h-[72px]` (explicit height)
- Border: `border-[var(--color-border)]` → `border-b border-purple-500/20` (purple bottom border)
- Background: `bg-[var(--color-bg)]/95` → `bg-[var(--color-bg)]/60` (more transparent)
- Blur: `backdrop-blur` → `backdrop-blur-xl` (stronger blur)
- Added: `shadow-lg shadow-black/10` (depth shadow)
- Padding: `px-3` → `px-6` (more breathing room)
- Added: `transition-all duration-300` (smooth transitions)
- Removed: `supports-[backdrop-filter]:bg-[var(--color-bg)]/80` (using fallback opacity)

**Step 2: Visual test in browser**

Run: `npm run dev`
Navigate to: `http://localhost:5173`
Expected: Navbar has stronger blur, purple bottom border, more transparent background

**Step 3: Commit**

```bash
git add src/components/NavBar.tsx
git commit -m "feat: add glassmorphism base styling to navbar

Apply backdrop-blur-xl, semi-transparent background, purple-tinted border,
and shadow for modern floating glass effect."
```

---

## Task 2: Animated Rocket Logo

**Files:**
- Modify: `src/components/NavBar.tsx:18-21`

**Step 1: Wrap logo area in Link with hover animations**

Replace lines 18-21 with clickable, animated logo container:

```tsx
<Link
  to="/"
  className="flex items-center gap-2 px-6 cursor-pointer group transition-all duration-300"
>
  <LuRocket className="text-3xl transition-all duration-300 group-hover:text-purple-500 group-hover:-translate-y-1 group-hover:-rotate-12 group-hover:drop-shadow-[0_0_8px_rgba(147,51,234,0.6)]"/>
  <p className="text-2xl transition-all duration-300 group-hover:text-purple-500 group-hover:tracking-wider">Wesley Chou</p>
</Link>
```

**Changes:**
- Wrapped in `Link to="/"` for homepage navigation
- Added `group` class for coordinated hover effects
- Rocket: hover transform `translateY(-3px) rotate(-12deg)`, purple color, glow
- Name: hover purple color, increased letter spacing
- All transitions: 300ms for smooth animation

**Step 2: Visual test hover behavior**

Run: `npm run dev` (if not running)
Test: Hover over logo area
Expected: Rocket lifts and tilts, both icon and text turn purple, smooth animation

**Step 3: Test mobile responsiveness**

Open DevTools, switch to mobile viewport (iPhone SE)
Test: Tap logo area
Expected: Navigates to homepage, animation works (may be simplified on mobile automatically)

**Step 4: Commit**

```bash
git add src/components/NavBar.tsx
git commit -m "feat: add animated rocket logo with hover effects

Logo area now clickable (links to homepage) with playful hover animation:
rocket floats up and tilts, both icon and text shift to purple."
```

---

## Task 3: Purple Gradient Tab Selection

**Files:**
- Modify: `src/components/NavBar.tsx:23-50`

**Step 1: Update tab styling with purple gradient for active state**

Replace Tab components (lines 23-50) with enhanced styling. Replace the className for all four Tab components:

```tsx
className="rounded-full px-5 py-2.5 text-lg font-semibold text-white/70 border border-transparent transition-all duration-300 ease-out focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 data-hover:bg-white/10 data-hover:border-white/10 data-hover:text-white data-hover:scale-105 data-selected:bg-gradient-to-r data-selected:from-purple-600 data-selected:to-purple-500 data-selected:text-white data-selected:shadow-lg data-selected:shadow-purple-500/50 data-selected:scale-105"
```

**Complete updated Tab structure** (all four tabs):

```tsx
<Tab
  className="rounded-full px-5 py-2.5 text-lg font-semibold text-white/70 border border-transparent transition-all duration-300 ease-out focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 data-hover:bg-white/10 data-hover:border-white/10 data-hover:text-white data-hover:scale-105 data-selected:bg-gradient-to-r data-selected:from-purple-600 data-selected:to-purple-500 data-selected:text-white data-selected:shadow-lg data-selected:shadow-purple-500/50 data-selected:scale-105"
  as={Link}
  to="/"
>
  Home
</Tab>
<Tab
  className="rounded-full px-5 py-2.5 text-lg font-semibold text-white/70 border border-transparent transition-all duration-300 ease-out focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 data-hover:bg-white/10 data-hover:border-white/10 data-hover:text-white data-hover:scale-105 data-selected:bg-gradient-to-r data-selected:from-purple-600 data-selected:to-purple-500 data-selected:text-white data-selected:shadow-lg data-selected:shadow-purple-500/50 data-selected:scale-105"
  as={Link}
  to="/experience"
>
  Experience
</Tab>
<Tab
  className="rounded-full px-5 py-2.5 text-lg font-semibold text-white/70 border border-transparent transition-all duration-300 ease-out focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 data-hover:bg-white/10 data-hover:border-white/10 data-hover:text-white data-hover:scale-105 data-selected:bg-gradient-to-r data-selected:from-purple-600 data-selected:to-purple-500 data-selected:text-white data-selected:shadow-lg data-selected:shadow-purple-500/50 data-selected:scale-105"
  as={Link}
  to="/projects"
>
  Projects
</Tab>
<Tab
  className="rounded-full px-5 py-2.5 text-lg font-semibold text-white/70 border border-transparent transition-all duration-300 ease-out focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 data-hover:bg-white/10 data-hover:border-white/10 data-hover:text-white data-hover:scale-105 data-selected:bg-gradient-to-r data-selected:from-purple-600 data-selected:to-purple-500 data-selected:text-white data-selected:shadow-lg data-selected:shadow-purple-500/50 data-selected:scale-105"
  as={Link}
  to="/skills"
>
  Skills
</Tab>
```

**Changes:**
- Inactive: `text-white/70` (70% opacity), transparent background/border
- Hover: `bg-white/10`, `border-white/10`, full white text, `scale-105`
- Selected: `bg-gradient-to-r from-purple-600 to-purple-500` (gradient), glow shadow, `scale-105`
- Focus: purple ring for keyboard navigation
- Size: `text-lg` (down from xl), `px-5 py-2.5` (more balanced)
- Transition: 300ms ease-out for smooth state changes

**Step 2: Visual test tab interactions**

Run: `npm run dev`
Test:
- Hover over inactive tabs → should show glassmorphic white background, scale up
- Click to navigate → selected tab should have purple gradient background with glow
- Navigate between pages → verify selected state updates correctly

Expected: Clear visual hierarchy, smooth transitions, purple gradient stands out

**Step 3: Test keyboard navigation**

Test: Press Tab key to cycle through navigation
Expected: Focus ring appears on tabs (purple ring), Enter key navigates

**Step 4: Commit**

```bash
git add src/components/NavBar.tsx
git commit -m "feat: add purple gradient for selected tab state

Enhance tab styling with purple gradient background for active tab,
glassmorphic hover states, and improved visual hierarchy."
```

---

## Task 4: Enhanced Social Icon Interactions

**Files:**
- Modify: `src/components/NavBar.tsx:54-109`

**Step 1: Update social icons container and sizing**

Replace line 54 (icons container div):

```tsx
<div className="flex items-center gap-3 border-l border-purple-500/20 pl-3">
```

Added: `gap-3` (more spacing), purple separator border on left

**Step 2: Update icon link styling with enhanced hover effects**

Replace icon link className for all three icons (GitHub, LinkedIn, Resume):

```tsx
className="inline-flex p-2.5 rounded-lg text-white/80 hover:text-purple-500 hover:bg-purple-500/20 hover:backdrop-blur-sm hover:scale-110 hover:rotate-6 hover:shadow-lg hover:shadow-purple-500/30 transition-all duration-250"
```

**Complete updated icon structure** (apply to all three):

```tsx
<Tooltip>
  <TooltipTrigger
    render={
      <a
        href="https://github.com/wcia013twe"
        aria-label="GitHub"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex p-2.5 rounded-lg text-white/80 hover:text-purple-500 hover:bg-purple-500/20 hover:backdrop-blur-sm hover:scale-110 hover:rotate-6 hover:shadow-lg hover:shadow-purple-500/30 transition-all duration-250"
      >
        <FaGithub className="text-4xl" />
      </a>
    }
  />
  <TooltipPanel side="bottom" sideOffset={6} className="text-xs bg-black/80 backdrop-blur-md border border-purple-500/30 px-2 py-1">
    GitHub
  </TooltipPanel>
</Tooltip>
```

**Icon size changes:**
- `text-5xl` → `text-4xl` (all three icons)

**Changes:**
- Icon size: `text-5xl` → `text-4xl` (better balance)
- Padding: `p-2` → `p-2.5`
- Shape: `rounded-md` → `rounded-lg` (sharper corners)
- Base: `text-white/80` (80% opacity)
- Hover: purple color, glassmorphic background, scale, rotate, glow
- Tooltip: glassmorphic dark background with purple border
- Transition: 250ms (snappier than tabs)

**Step 3: Apply to all three social icons**

Update GitHub, LinkedIn, and Resume icons with the same pattern.

**LinkedIn:**
```tsx
<Tooltip>
  <TooltipTrigger
    render={
      <a
        href="https://www.linkedin.com/in/weschou013/"
        aria-label="LinkedIn"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex p-2.5 rounded-lg text-white/80 hover:text-purple-500 hover:bg-purple-500/20 hover:backdrop-blur-sm hover:scale-110 hover:rotate-6 hover:shadow-lg hover:shadow-purple-500/30 transition-all duration-250"
      >
        <FaLinkedin className="text-4xl" />
      </a>
    }
  />
  <TooltipPanel side="bottom" sideOffset={6} className="text-xs bg-black/80 backdrop-blur-md border border-purple-500/30 px-2 py-1">
    LinkedIn
  </TooltipPanel>
</Tooltip>
```

**Resume:**
```tsx
<Tooltip>
  <TooltipTrigger
    render={
      <a
        href="documents/IWesChouResume2026_1120.pdf"
        aria-label="Resume"
        className="inline-flex p-2.5 rounded-lg text-white/80 hover:text-purple-500 hover:bg-purple-500/20 hover:backdrop-blur-sm hover:scale-110 hover:rotate-6 hover:shadow-lg hover:shadow-purple-500/30 transition-all duration-250"
      >
        <CgFileDocument className="text-4xl" />
      </a>
    }
  />
  <TooltipPanel side="bottom" sideOffset={6} className="text-xs bg-black/80 backdrop-blur-md border border-purple-500/30 px-2 py-1">
    Resume
  </TooltipPanel>
</Tooltip>
```

**Step 4: Visual test icon interactions**

Run: `npm run dev`
Test: Hover over each icon (GitHub, LinkedIn, Resume)
Expected:
- Icon scales up and rotates slightly
- Purple color appears
- Glassmorphic purple glow background
- Shadow appears
- Smooth 250ms animation

**Step 5: Test tooltip appearance**

Test: Hover and wait 150ms
Expected: Tooltip appears with glassmorphic dark background and purple border

**Step 6: Commit**

```bash
git add src/components/NavBar.tsx
git commit -m "feat: enhance social icon hover effects

Add playful hover animations to social icons with scale, rotation, purple
glow, and glassmorphic tooltips for polished interactions."
```

---

## Task 5: Mobile Hamburger Menu - Part 1 (State & Toggle)

**Files:**
- Modify: `src/components/NavBar.tsx:1,13`

**Step 1: Add useState import and mobile menu state**

Update line 1 to add useState:

```tsx
import { useState } from "react";
import { Tab, TabGroup, TabList } from "@headlessui/react";
```

Add state inside Navbar component (after line 13):

```tsx
function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
```

**Step 2: Visual verification (no visual change yet)**

Run: `npm run dev`
Expected: No visual changes, but state is ready for mobile menu

**Step 3: Commit**

```bash
git add src/components/NavBar.tsx
git commit -m "feat: add mobile menu state management

Add useState hook to track mobile menu open/closed state."
```

---

## Task 6: Mobile Hamburger Menu - Part 2 (Hamburger Icon)

**Files:**
- Modify: `src/components/NavBar.tsx:22`

**Step 1: Add hamburger icon before TabList**

Add hamburger button between logo and TabList (after line 21, before line 22):

```tsx
{/* Hamburger Menu Button (Mobile Only) */}
<button
  className="md:hidden flex flex-col gap-1.5 p-2 hover:text-purple-500 transition-colors duration-300"
  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
  aria-label="Toggle menu"
  aria-expanded={mobileMenuOpen}
>
  <span className={`w-6 h-0.5 bg-current transition-all duration-300 ${mobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`} />
  <span className={`w-6 h-0.5 bg-current transition-all duration-300 ${mobileMenuOpen ? 'opacity-0' : ''}`} />
  <span className={`w-6 h-0.5 bg-current transition-all duration-300 ${mobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
</button>
```

**Step 2: Hide TabList on mobile, show on desktop**

Update TabList className on line 22 to add responsive visibility:

```tsx
<TabList className="hidden md:flex items-center gap-1">
```

Added: `hidden md:flex` (hidden on mobile, visible on md+ breakpoint)

**Step 3: Visual test mobile hamburger**

Run: `npm run dev`
Resize browser to mobile width (< 768px)
Test:
- Tabs should disappear
- Hamburger icon (three lines) should appear in center
- Click hamburger → lines animate to X shape
- Click again → X animates back to three lines

Expected: Smooth hamburger animation, tabs hidden on mobile

**Step 4: Test desktop behavior**

Resize to desktop width (> 768px)
Expected: Hamburger hidden, tabs visible

**Step 5: Commit**

```bash
git add src/components/NavBar.tsx
git commit -m "feat: add mobile hamburger menu icon

Add animated hamburger icon that toggles between three lines and X shape,
hide navigation tabs on mobile screens."
```

---

## Task 7: Mobile Hamburger Menu - Part 3 (Menu Overlay)

**Files:**
- Modify: `src/components/NavBar.tsx:110` (before closing TabGroup)

**Step 1: Add mobile menu overlay**

Add mobile menu overlay before the closing `</TabGroup>` tag (after line 110):

```tsx
{/* Mobile Menu Overlay */}
{mobileMenuOpen && (
  <div
    className="fixed inset-0 z-40 md:hidden"
    onClick={() => setMobileMenuOpen(false)}
  >
    <div className="fixed inset-0 bg-black/95 backdrop-blur-2xl" />
    <nav
      className="fixed right-0 top-0 h-full w-full bg-black/95 backdrop-blur-2xl animate-slide-in"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Close Button */}
      <button
        className="absolute top-6 right-6 p-2 text-white hover:text-purple-500 transition-colors"
        onClick={() => setMobileMenuOpen(false)}
        aria-label="Close menu"
      >
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {/* Menu Items */}
      <div className="flex flex-col items-center justify-center h-full gap-8">
        <Link
          to="/"
          className="text-2xl font-semibold text-white/70 hover:text-purple-500 py-6 transition-colors"
          onClick={() => setMobileMenuOpen(false)}
        >
          Home
        </Link>
        <Link
          to="/experience"
          className="text-2xl font-semibold text-white/70 hover:text-purple-500 py-6 transition-colors"
          onClick={() => setMobileMenuOpen(false)}
        >
          Experience
        </Link>
        <Link
          to="/projects"
          className="text-2xl font-semibold text-white/70 hover:text-purple-500 py-6 transition-colors"
          onClick={() => setMobileMenuOpen(false)}
        >
          Projects
        </Link>
        <Link
          to="/skills"
          className="text-2xl font-semibold text-white/70 hover:text-purple-500 py-6 transition-colors"
          onClick={() => setMobileMenuOpen(false)}
        >
          Skills
        </Link>
      </div>
    </nav>
  </div>
)}
```

**Step 2: Add slide-in animation to tailwind config**

Create or update `tailwind.config.js` to add slide-in animation:

**Modify:** `tailwind.config.js`

Add to theme.extend.animation and keyframes:

```js
module.exports = {
  theme: {
    extend: {
      animation: {
        'slide-in': 'slideIn 300ms ease-out',
      },
      keyframes: {
        slideIn: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' },
        },
      },
    },
  },
}
```

**Step 3: Visual test mobile menu overlay**

Run: `npm run dev`
Resize to mobile width
Test:
- Click hamburger → full-screen menu slides in from right
- Menu items vertically centered, large text
- Click close (X) → menu disappears
- Click menu item → navigates and closes menu
- Click outside menu → menu closes

Expected: Smooth slide-in animation, glassmorphic overlay, intuitive interactions

**Step 4: Test menu items**

Test: Click each menu item (Home, Experience, Projects, Skills)
Expected: Navigates to correct page and closes menu

**Step 5: Commit**

```bash
git add src/components/NavBar.tsx tailwind.config.js
git commit -m "feat: add mobile menu overlay with navigation

Implement full-screen glassmorphic mobile menu with slide-in animation,
large touch-friendly navigation items, and close functionality."
```

---

## Task 8: Tablet Responsive Adjustments

**Files:**
- Modify: `src/components/NavBar.tsx:23-50,54`

**Step 1: Add tablet-specific styling to tabs**

Update Tab className to add tablet adjustments (add to existing className):

```tsx
className="rounded-full px-5 py-2.5 lg:px-5 lg:py-2.5 md:px-4 md:py-2 text-lg lg:text-lg md:text-base font-semibold text-white/70 border border-transparent transition-all duration-300 ease-out focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 data-hover:bg-white/10 data-hover:border-white/10 data-hover:text-white data-hover:scale-105 data-selected:bg-gradient-to-r data-selected:from-purple-600 data-selected:to-purple-500 data-selected:text-white data-selected:shadow-lg data-selected:shadow-purple-500/50 data-selected:scale-105"
```

Added responsive classes:
- Padding: `md:px-4 md:py-2` (tablet), `lg:px-5 lg:py-2.5` (desktop)
- Font: `md:text-base` (tablet), `lg:text-lg` (desktop)

**Step 2: Add tablet-specific styling to social icons**

Update social icon className to add tablet size adjustment:

```tsx
className="inline-flex p-2.5 rounded-lg text-white/80 hover:text-purple-500 hover:bg-purple-500/20 hover:backdrop-blur-sm hover:scale-110 hover:rotate-6 hover:shadow-lg hover:shadow-purple-500/30 transition-all duration-250"
```

Update icon size:
```tsx
<FaGithub className="text-4xl md:text-3xl lg:text-4xl" />
```

Added: `md:text-3xl` for tablet, `lg:text-4xl` for desktop

**Step 3: Apply icon size changes to all three icons**

Update all social icons (GitHub, LinkedIn, Resume) with responsive sizing:

```tsx
<FaGithub className="text-4xl md:text-3xl lg:text-4xl" />
<FaLinkedin className="text-4xl md:text-3xl lg:text-4xl" />
<CgFileDocument className="text-4xl md:text-3xl lg:text-4xl" />
```

**Step 4: Visual test tablet layout**

Run: `npm run dev`
Resize to tablet width (768px - 1024px)
Expected:
- Tabs visible with smaller padding and font
- Icons slightly smaller
- All elements fit comfortably without overflow
- Layout remains functional

**Step 5: Test desktop layout still correct**

Resize to desktop width (> 1024px)
Expected: Full sizing restored, optimal spacing

**Step 6: Commit**

```bash
git add src/components/NavBar.tsx
git commit -m "feat: add tablet responsive adjustments

Reduce tab padding and font size on tablet breakpoint for better fit
while maintaining all desktop features."
```

---

## Task 9: Accessibility & Reduced Motion

**Files:**
- Create: `src/styles/navbar-accessibility.css`
- Modify: `src/components/NavBar.tsx:1`

**Step 1: Create accessibility CSS file**

Create new file with reduced-motion preferences:

```css
/* Respect user's motion preferences */
@media (prefers-reduced-motion: reduce) {
  /* Disable scale, rotate, and transform animations */
  .navbar-logo,
  .navbar-tab,
  .navbar-icon {
    transition: color 200ms ease-out, background-color 200ms ease-out, opacity 200ms ease-out !important;
    transform: none !important;
  }

  /* Keep gentle fades, disable complex animations */
  .navbar-logo:hover,
  .navbar-tab:hover,
  .navbar-icon:hover {
    transform: none !important;
  }
}
```

**Step 2: Add accessibility classes to components**

Update NavBar.tsx to add accessibility class names:

**Logo Link** (add `navbar-logo`):
```tsx
<Link
  to="/"
  className="navbar-logo flex items-center gap-2 px-6 cursor-pointer group transition-all duration-300"
>
```

**Tabs** (add `navbar-tab` to each):
```tsx
className="navbar-tab rounded-full px-5 py-2.5 lg:px-5 lg:py-2.5 md:px-4 md:py-2 text-lg lg:text-lg md:text-base font-semibold..."
```

**Icons** (add `navbar-icon` to each link):
```tsx
className="navbar-icon inline-flex p-2.5 rounded-lg text-white/80..."
```

**Step 3: Import CSS in component**

Add import at top of NavBar.tsx (after line 11):

```tsx
import "@/styles/navbar-accessibility.css";
```

**Step 4: Test reduced motion**

Open DevTools → Rendering → Check "Emulate CSS prefers-reduced-motion"
Run: `npm run dev`
Test: Hover over logo, tabs, icons
Expected: Color changes work, but no scale/rotate/transform animations

**Step 5: Test normal motion**

Uncheck "Emulate CSS prefers-reduced-motion"
Test: Hover interactions
Expected: All animations work normally

**Step 6: Commit**

```bash
git add src/styles/navbar-accessibility.css src/components/NavBar.tsx
git commit -m "feat: add reduced motion accessibility support

Respect prefers-reduced-motion preference by disabling scale, rotate, and
transform animations while keeping color transitions."
```

---

## Task 10: Final Testing & Polish

**Files:**
- Test all features across breakpoints and browsers

**Step 1: Run build to check for TypeScript errors**

Run: `npm run build`
Expected: Build succeeds with no errors

**Step 2: Visual regression test - Desktop**

Open: `http://localhost:5173`
Test checklist:
- [ ] Glassmorphism effect visible (blur, transparency)
- [ ] Purple bottom border on navbar
- [ ] Logo hover animation smooth (float, rotate, purple)
- [ ] Logo click navigates to homepage
- [ ] Active tab has purple gradient background
- [ ] Inactive tabs show glassmorphic hover
- [ ] Tab navigation works correctly
- [ ] Social icons hover with scale, rotate, purple glow
- [ ] Tooltips appear with glassmorphic styling
- [ ] All links open correctly (GitHub, LinkedIn, Resume)

**Step 3: Visual regression test - Tablet**

Resize to 768px - 1024px
Test checklist:
- [ ] Tabs remain visible
- [ ] Smaller padding/fonts on tabs and icons
- [ ] No overflow, all elements fit
- [ ] All interactions work

**Step 4: Visual regression test - Mobile**

Resize to < 768px
Test checklist:
- [ ] Tabs hidden
- [ ] Hamburger icon visible and centered
- [ ] Click hamburger → menu slides in
- [ ] Menu items large and touch-friendly
- [ ] Click menu item → navigates and closes
- [ ] Click outside → closes menu
- [ ] Close button works

**Step 5: Keyboard navigation test**

Test checklist:
- [ ] Tab key cycles through: logo → tabs → icons
- [ ] Focus rings visible (purple)
- [ ] Enter key activates links
- [ ] Escape closes mobile menu (if implemented)

**Step 6: Accessibility test**

Run Lighthouse audit in DevTools
Expected: Accessibility score 90+

Check:
- [ ] All links have aria-labels
- [ ] Color contrast meets WCAG AA (4.5:1+)
- [ ] Keyboard navigation functional
- [ ] Screen reader can navigate (test with NVDA/VoiceOver if available)

**Step 7: Performance test**

Run Lighthouse Performance audit
Expected: No performance regression, animations at 60fps

**Step 8: Cross-browser test** (if possible)

Test in:
- [ ] Chrome/Edge (Chromium)
- [ ] Firefox
- [ ] Safari (if on Mac)

Expected: Consistent appearance and behavior

**Step 9: Document any issues found**

If issues found, create follow-up tasks. Otherwise, proceed to commit.

**Step 10: Final commit**

```bash
git add .
git commit -m "test: verify navbar redesign across all breakpoints

Complete testing of glassmorphism navbar with animations, mobile menu,
and accessibility features across desktop, tablet, and mobile."
```

---

## Task 11: Merge and Cleanup

**Files:**
- Merge feature branch back to main

**Step 1: Ensure all changes committed**

Run: `git status`
Expected: Working tree clean

**Step 2: Switch to main branch**

Run:
```bash
cd ../../  # Return to main worktree root
git checkout main
```

**Step 3: Merge feature branch**

Run:
```bash
git merge feature/navbar-glassmorphism
```

Expected: Fast-forward merge or clean merge

**Step 4: Test merged result**

Run: `npm run dev`
Quick test: Verify navbar looks correct on main branch

**Step 5: Clean up worktree**

Run:
```bash
git worktree remove .worktrees/navbar-redesign
```

Expected: Worktree removed successfully

**Step 6: Push to remote** (optional)

If ready to push:
```bash
git push origin main
```

**Step 7: Celebrate!**

The navbar redesign is complete and merged. The navbar now has:
- ✅ Glassmorphism effects
- ✅ Animated rocket logo
- ✅ Purple gradient tab selection
- ✅ Enhanced social icon interactions
- ✅ Mobile hamburger menu
- ✅ Tablet responsive adjustments
- ✅ Accessibility support

---

## Notes

**DRY Principle:**
- Reused same className pattern for all tabs
- Reused same className pattern for all social icons
- Centralized animations in CSS for reduced motion

**YAGNI Principle:**
- Skipped optional sparkle particles (can add later if desired)
- Skipped scroll-based opacity changes (simpler to maintain)
- No page load entrance animation (can add as enhancement)

**Testing Strategy:**
- Visual testing at each step to catch issues early
- Commit after each logical unit of work
- Manual testing across breakpoints before final merge
- Accessibility testing throughout

**Performance Considerations:**
- Used CSS transforms (GPU accelerated)
- Reduced motion support for users with motion sensitivity
- Minimal JavaScript (only mobile menu state)
- No additional libraries needed (Tailwind + existing stack)

**Potential Enhancements** (Future Work):
- Page load entrance animation (navbar slides down)
- Sparkle particles on logo hover
- Scroll-based blur/opacity changes
- Active tab pulse animation on page load
- Resume badge indicator ("Updated 2026")
