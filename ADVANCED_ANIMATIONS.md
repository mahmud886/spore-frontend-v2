# Advanced Gaming Animation Effects

## Overview

Added multiple advanced cyberpunk gaming animation effects to enhance the visual appeal and create an immersive gaming experience.

## New Animation Effects Added

### 1. **Particle Glow Effect** (`cyber-particle-glow`)

- Radial gradient glow that pulses around elements
- Creates a subtle particle-like aura effect
- Applied to section titles

### 2. **Holographic Shimmer** (`cyber-holographic`)

- Horizontal shimmer sweep across elements
- Multi-color gradient (neon yellow + cyan)
- Overlay blend mode for depth
- Applied to hero sections, cards, and key containers

### 3. **Energy Wave Pulse** (`cyber-energy-wave`)

- Pulsing border animation around cards
- Creates an energy field effect
- Applied to episode cards, character cards, product cards

### 4. **Data Stream Effect** (`cyber-data-stream`)

- Vertical data streams moving down the page
- Multiple streams at different positions
- Creates a "matrix-like" data flow
- Applied to hero sections and key containers

### 5. **Screen Flicker** (`cyber-screen-flicker`)

- Random screen flicker effect
- Mimics CRT monitor glitches
- Applied to result page header

### 6. **Neon Trail Effect** (`cyber-neon-trail`)

- Pulsing neon glow with trail
- Intensifies on hover
- Applied to buttons and interactive elements

### 7. **Advanced Glitch** (`cyber-advanced-glitch`)

- Multi-directional glitch distortion
- Hue rotation and brightness changes
- More complex than basic glitch
- Applied to section titles on hover

### 8. **Hex Grid Overlay** (`cyber-hex-grid`)

- Pulsing hex grid pattern overlay
- Screen blend mode
- Applied to sections for depth

### 9. **Power Surge Effect** (`cyber-power-surge`)

- Vertical energy surge animation
- Creates power-up effect
- Applied to result sections and countdown

## Applied To Components

### Home Page

- **HeroSection**: Holographic shimmer, data streams, glow blink on title, neon trail on button
- **EpisodesSection**: Hex grid background, energy wave on cards, neon trail
- **CharacterLogsSection**: Holographic shimmer, energy wave
- **NewsletterSection**: Holographic shimmer, data streams, glow pulse

### Result Page

- **HeroHeader**: Screen flicker effect
- **PollResultSection**: Holographic shimmer, power surge
- **CountdownSection**: Power surge effect
- **ProductCard**: Holographic shimmer, neon trail
- **SocialShareCard**: Neon trail effect
- **MobilizeNetworkCard**: Data streams, power surge

### About Page

- **AboutHeader**: Hex grid overlay
- **ContactSection**: Holographic shimmer, power surge

### Shared Components

- **SectionTitle**: Particle glow, advanced glitch, glow blink
- **BlogCard**: Energy wave

## Performance

- All animations use GPU-friendly transforms
- Respects `prefers-reduced-motion`
- Optimized for 60fps performance
- Minimal re-renders

## Usage Examples

```jsx
// Holographic shimmer
<div className="cyber-holographic">Content</div>

// Energy wave on cards
<div className="cyber-energy-wave">Card content</div>

// Data streams
<div className="cyber-data-stream">Content</div>

// Neon trail on buttons
<button className="cyber-neon-trail">Click me</button>

// Multiple effects combined
<div className="cyber-holographic cyber-data-stream cyber-power-surge">
  Advanced animated content
</div>
```
