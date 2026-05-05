import { createContext, useContext } from 'react';
import { useReducedMotion } from 'framer-motion';

const AnimationContext = createContext({ shouldAnimate: true });

export function AnimationProvider({ children }) {
  const prefersReduced = useReducedMotion();
  return <AnimationContext.Provider value={{ shouldAnimate: !prefersReduced }}>{children}</AnimationContext.Provider>;
}

export function useAnimation() {
  return useContext(AnimationContext);
}
