export const DESIGN_SYSTEM = {
  colors: {
    neon: {
      blue: 'rgba(32, 156, 238, 0.9)',
      purple: 'rgba(159, 122, 234, 0.9)',
      cyan: 'rgba(32, 226, 238, 0.9)',
      pink: 'rgba(238, 32, 224, 0.9)',
    },
    holographic: {
      primary: 'linear-gradient(135deg, rgba(32, 156, 238, 0.2), rgba(159, 122, 234, 0.2))',
      secondary: 'linear-gradient(135deg, rgba(32, 226, 238, 0.2), rgba(238, 32, 224, 0.2))',
    },
    glass: {
      light: 'rgba(255, 255, 255, 0.03)',
      medium: 'rgba(255, 255, 255, 0.05)',
      dark: 'rgba(17, 25, 40, 0.75)',
    },
    text: {
      primary: 'rgba(255, 255, 255, 0.95)',
      secondary: 'rgba(255, 255, 255, 0.7)',
      muted: 'rgba(255, 255, 255, 0.5)',
    }
  },
  effects: {
    glow: {
      neon: '0 0 20px rgba(32, 156, 238, 0.5), 0 0 40px rgba(32, 156, 238, 0.2)',
      subtle: '0 0 15px rgba(255, 255, 255, 0.1)',
      strong: '0 0 30px rgba(159, 122, 234, 0.4)',
    },
    blur: {
      light: 'blur(8px)',
      medium: 'blur(12px)',
      heavy: 'blur(20px)',
    }
  },
  animation: {
    transition: {
      fast: '0.2s cubic-bezier(0.4, 0, 0.2, 1)',
      normal: '0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      slow: '0.5s cubic-bezier(0.4, 0, 0.2, 1)',
    },
    keyframes: {
      pulse: {
        '0%, 100%': { opacity: 1 },
        '50%': { opacity: 0.5 },
      },
      float: {
        '0%, 100%': { transform: 'translateY(0)' },
        '50%': { transform: 'translateY(-10px)' },
      },
      glow: {
        '0%, 100%': { filter: 'brightness(1)' },
        '50%': { filter: 'brightness(1.3)' },
      }
    }
  }
} as const 