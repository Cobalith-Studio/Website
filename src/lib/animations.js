export const pageTransition = {
  duration: 0.42,
  ease: [0.22, 1, 0.36, 1]
};

export const pageVariants = {
  initial: {
    opacity: 0,
    y: 22
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: pageTransition
  },
  exit: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0
    }
  }
};

export const revealVariants = {
  hidden: {
    opacity: 0,
    y: 18
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1]
    }
  }
};

export const staggerContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.08
    }
  }
};

export const viewportOnce = {
  once: true,
  amount: 0.18
};
