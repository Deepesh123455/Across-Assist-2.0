// Enterprise-level animation utilities for Across Assist

export const easing = {
  smooth: [0.4, 0, 0.2, 1],
  spring: [0.34, 1.56, 0.64, 1],
  bounce: [0.68, -0.55, 0.265, 1.55],
  swift: [0.22, 1, 0.36, 1],
};

// Container animations
export const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1,
      ease: easing.smooth,
    },
  },
};

// Item animations
export const itemVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: easing.swift,
    },
  },
};

export const itemVariantsScale = {
  hidden: { opacity: 0, y: 28, scale: 0.96 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: easing.swift,
    },
  },
};

// Staggered reveal animations
export const staggerContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      ease: easing.smooth,
    },
  },
};

// Hero title animations
export const heroTitleVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: easing.swift,
    },
  },
};

// Card hover animations
export const cardHoverVariants = {
  rest: { y: 0, boxShadow: '0 1px 4px rgba(0,0,0,0.05)' },
  hover: {
    y: -8,
    boxShadow: '0 20px 40px rgba(0,0,0,0.12)',
    transition: {
      duration: 0.3,
      ease: easing.smooth,
    },
  },
};

// Number counter animation
export const numberCounterVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: easing.bounce,
    },
  },
};

// Badge/pill animations
export const badgeVariants = {
  hidden: { opacity: 0, scale: 0.85, y: -10 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: easing.swift,
    },
  },
};

// Button animations
export const buttonVariants = {
  initial: { opacity: 0, y: 16 },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: easing.swift,
    },
  },
  tap: { scale: 0.95 },
  hover: { scale: 1.02 },
};

// Gradient animation variants
export const gradientVariants = {
  hidden: { opacity: 0, backgroundPosition: '0% 50%' },
  visible: {
    opacity: 1,
    backgroundPosition: '100% 50%',
    transition: {
      duration: 2,
      ease: 'linear',
      repeat: Infinity,
      repeatType: 'reverse' as const,
    },
  },
};

// Floating animation
export const floatingVariants = {
  animate: {
    y: [0, -12, 0],
    transition: {
      duration: 4,
      ease: 'easeInOut',
      repeat: Infinity,
    },
  },
};

// Glow pulse animation
export const glowPulseVariants = {
  animate: {
    boxShadow: [
      '0 0 0 0 rgba(26,86,219,0.4)',
      '0 0 0 20px rgba(26,86,219,0)',
    ],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: 'easeOut',
    },
  },
};

// Slide in from left
export const slideInLeftVariants = {
  hidden: { opacity: 0, x: -40 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.6,
      ease: easing.swift,
    },
  },
};

// Slide in from right
export const slideInRightVariants = {
  hidden: { opacity: 0, x: 40 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.6,
      ease: easing.swift,
    },
  },
};

// Blur in animation
export const blurInVariants = {
  hidden: { opacity: 0, filter: 'blur(10px)' },
  visible: {
    opacity: 1,
    filter: 'blur(0px)',
    transition: {
      duration: 0.7,
      ease: easing.smooth,
    },
  },
};

// Scale in from center
export const scaleInVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: easing.swift,
    },
  },
};

// Rotate in animation
export const rotateInVariants = {
  hidden: { opacity: 0, rotate: -10 },
  visible: {
    opacity: 1,
    rotate: 0,
    transition: {
      duration: 0.6,
      ease: easing.swift,
    },
  },
};

// Progress bar animation
export const progressBarVariants = {
  hidden: { scaleX: 0 },
  visible: {
    scaleX: 1,
    transition: {
      duration: 1.2,
      ease: 'easeOut',
      delay: 0.2,
    },
  },
};

// List animations for staggered children
export const listContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

export const listItemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.4,
      ease: easing.smooth,
    },
  },
};

// Scroll reveal variants
export const scrollRevealVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: easing.smooth,
    },
  },
};

// Underline animation
export const underlineVariants = {
  hidden: { scaleX: 0 },
  visible: {
    scaleX: 1,
    transition: {
      duration: 0.6,
      ease: easing.smooth,
      delay: 0.3,
    },
  },
};
