# Cyberpunk Animation Implementation

## Overview

High-quality cyberpunk gaming animations have been added to the Home, Result, and About pages using Framer Motion and CSS keyframes. All animations are performance-optimized, GPU-friendly, and respect `prefers-reduced-motion`.

## Files Created

### 1. `/src/app/utils/animations.js`

Reusable Framer Motion animation variants and configuration:

- **Variants**: `fadeUp`, `fadeIn`, `slideInLeft`, `slideInRight`, `scaleIn`, `staggerContainer`
- **Hover Variants**: `hoverGlow`, `hoverFloat`, `hoverScale`
- **Scroll Variants**: `scrollReveal`, `progressFill`
- **Special Effects**: `glitchText`, `neonPulse`
- **Constants**: Timing and easing configurations

### 2. `/src/app/utils/cyberpunkStyles.css`

CSS keyframe animations for cyberpunk effects:

- **neonGlowPulse**: Subtle neon glow pulse animation
- **softGlitch**: Soft glitch distortion on hover
- **scanline**: Animated scanline effect
- **gridMove**: Moving grid background
- **borderSweep**: Neon border sweep animation
- **hologramFlicker**: Hologram flicker effect
- **energyFill**: Energy fill animation for progress bars
- **textGlitch**: Text glitch effect on hover
- **floating**: Floating animation
- All animations respect `prefers-reduced-motion`

### 3. `/src/app/components/shared/AnimatedWrapper.jsx`

Reusable animation wrapper components:

- **AnimatedWrapper**: Scroll-triggered animations with `useInView`
- **AnimatedCard**: Cards with hover effects (glow, float)
- Both respect `prefers-reduced-motion`

## Animations Applied

### Home Page

#### HeroSection

- ✅ Text reveal with cyber glitch + fade-up
- ✅ Background slow parallax movement (subtle scale animation)
- ✅ CTA button: Neon border pulse loop + hover glow intensifies
- ✅ Scanline overlay effect

#### Synopsis

- ✅ Scroll-triggered fade-up animation
- ✅ Background video subtle parallax
- ✅ CTA button: Neon glow pulse + hover effects
- ✅ Scanline overlay

#### PrologueSection

- ✅ Scroll-triggered fade-up animation
- ✅ Scanline overlay

#### EpisodesSection

- ✅ Cards wrapped in `AnimatedCard` with hover glow and float
- ✅ Stagger animation on scroll

#### CharacterLogsSection

- ✅ Cards wrapped in `AnimatedCard` with hover glow and float
- ✅ Stagger animation on scroll

#### NewsletterSection

- ✅ Scroll-triggered fade-up
- ✅ Form inputs: Scale on focus with neon border
- ✅ Submit button: Hover glow and scale effects
- ✅ Container: Neon glow pulse

#### BlogCard (SporeBlogSection)

- ✅ Cards wrapped in `AnimatedCard` with hover effects

### Result Page

#### HeroHeader

- ✅ Status badge: Fade-in with neon pulse
- ✅ Heading: Text reveal with glitch effect + blur-to-focus
- ✅ Line-by-line stagger animation
- ✅ Scanline overlay

#### PollResultSection

- ✅ Section fade-in
- ✅ Labels: Staggered fade-in and slide-up
- ✅ Progress bars: Smooth left-to-right energy fill with glow trail
- ✅ Percentage: Count-up animation with spring effect
- ✅ Border sweep animation on progress bars

#### CountdownSection

- ✅ Title: Scroll-triggered fade-in with glitch
- ✅ Cards: Stagger animation on scroll
- ✅ Numbers: Blink animation on value change (numbers only, not box)

#### ProductsSection

- ✅ Product cards wrapped in `AnimatedCard` with hover effects

#### MobilizeNetworkCard

- ✅ Section: Scroll-triggered fade-up
- ✅ Title/Description: Staggered fade-in
- ✅ Social buttons: Stagger animation with hover effects
- ✅ Stats: Animated number with glitch effect
- ✅ Scanline overlay

### About Page

#### AboutHeader

- ✅ Left content: Slide-in from left with stagger
- ✅ Title: Text reveal with glitch + blur-to-focus
- ✅ Right video card: Slide-in from right
- ✅ Video card: Hover float + hologram flicker
- ✅ Play button: Neon glow pulse
- ✅ Grid background animation

#### ContactSection

- ✅ Contact cards: Stagger animation with hover glow/float
- ✅ Form section: Scroll-triggered fade-up
- ✅ Form inputs: Scale on focus
- ✅ Submit button: Hover glow effects
- ✅ Scanline overlay

## Animation Features

### Performance Optimizations

- ✅ GPU-friendly transforms only (translate, scale, opacity)
- ✅ `will-change` handled by Framer Motion
- ✅ Animations disabled for `prefers-reduced-motion`
- ✅ `once: true` for scroll animations (no re-triggering)

### Cyberpunk Style Elements

- ✅ Subtle neon glow pulse
- ✅ Soft glitch distortion on hover
- ✅ Scanline / grid background animation (very low opacity)
- ✅ Cyber HUD-style motion (smooth, mechanical, intentional)
- ✅ No cartoon or bouncy animations

### Reusability

- ✅ All animation configs extracted to constants
- ✅ Reusable wrapper components
- ✅ Consistent animation timing across components
- ✅ Easy to toggle effects via props

## Usage Examples

### Basic Scroll Animation

```jsx
import { AnimatedWrapper } from "../shared/AnimatedWrapper";
import { fadeUp } from "../../utils/animations";

<AnimatedWrapper variant={fadeUp}>
  <YourContent />
</AnimatedWrapper>;
```

### Card with Hover Effects

```jsx
import { AnimatedCard } from "../shared/AnimatedWrapper";

<AnimatedCard hoverGlow={true} hoverFloat={true}>
  <YourCardContent />
</AnimatedCard>;
```

### CSS Classes

```jsx
// Add cyberpunk effects via CSS classes
<div className="cyber-glow-pulse cyber-scanline cyber-text-glitch">Content with multiple effects</div>
```

## Notes

- All animations respect `prefers-reduced-motion` and are disabled for accessibility
- Animations use `whileInView` for scroll-triggered effects
- Hover effects use `whileHover` for smooth interactions
- All transforms are GPU-accelerated (translate, scale, opacity only)
- No layout shifts or reflows during animations
