// Cyberpunk Animation Utilities
// Performance-first, GPU-friendly transforms only

export const ANIMATION_CONFIG = {
  // Timing constants
  FAST: 0.3,
  NORMAL: 0.5,
  SLOW: 0.8,
  VERY_SLOW: 1.2,

  // Easing
  EASE_OUT: [0.16, 1, 0.3, 1],
  EASE_IN_OUT: [0.4, 0, 0.2, 1],
  CYBER_EASE: [0.25, 0.46, 0.45, 0.94],
};

// Framer Motion Variants
export const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: ANIMATION_CONFIG.NORMAL,
      ease: ANIMATION_CONFIG.CYBER_EASE,
    },
  },
};

export const fadeIn = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: ANIMATION_CONFIG.NORMAL,
      ease: ANIMATION_CONFIG.CYBER_EASE,
    },
  },
};

export const slideInLeft = {
  hidden: { opacity: 0, x: -50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: ANIMATION_CONFIG.NORMAL,
      ease: ANIMATION_CONFIG.CYBER_EASE,
    },
  },
};

export const slideInRight = {
  hidden: { opacity: 0, x: 50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: ANIMATION_CONFIG.NORMAL,
      ease: ANIMATION_CONFIG.CYBER_EASE,
    },
  },
};

export const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: ANIMATION_CONFIG.NORMAL,
      ease: ANIMATION_CONFIG.CYBER_EASE,
    },
  },
};

// Stagger container for children
export const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

// Hover variants
export const hoverGlow = {
  rest: {
    boxShadow: "0 0 0px rgba(212, 255, 0, 0)",
  },
  hover: {
    boxShadow: "0 0 20px rgba(212, 255, 0, 0.3), 0 0 40px rgba(212, 255, 0, 0.1)",
    transition: {
      duration: ANIMATION_CONFIG.FAST,
    },
  },
};

export const hoverFloat = {
  rest: {
    y: 0,
  },
  hover: {
    y: -5,
    transition: {
      duration: ANIMATION_CONFIG.FAST,
      ease: ANIMATION_CONFIG.EASE_OUT,
    },
  },
};

export const hoverScale = {
  rest: {
    scale: 1,
  },
  hover: {
    scale: 1.02,
    transition: {
      duration: ANIMATION_CONFIG.FAST,
    },
  },
};

// Scroll-triggered variants
export const scrollReveal = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: ANIMATION_CONFIG.SLOW,
      ease: ANIMATION_CONFIG.CYBER_EASE,
    },
  },
};

// Progress bar animation
export const progressFill = {
  hidden: { width: "0%" },
  visible: {
    width: "100%",
    transition: {
      duration: ANIMATION_CONFIG.SLOW,
      ease: ANIMATION_CONFIG.EASE_OUT,
    },
  },
};

// Glitch animation variant
export const glitchText = {
  rest: {
    x: 0,
    filter: "hue-rotate(0deg)",
  },
  hover: {
    x: [0, -2, 2, -2, 2, 0],
    filter: ["hue-rotate(0deg)", "hue-rotate(5deg)", "hue-rotate(-5deg)", "hue-rotate(0deg)"],
    transition: {
      duration: 0.3,
      times: [0, 0.2, 0.4, 0.6, 0.8, 1],
    },
  },
};

// Pulse animation for neon effects
export const neonPulse = {
  animate: {
    opacity: [0.5, 1, 0.5],
    scale: [1, 1.05, 1],
  },
  transition: {
    duration: 2,
    repeat: Infinity,
    ease: "easeInOut",
  },
};
