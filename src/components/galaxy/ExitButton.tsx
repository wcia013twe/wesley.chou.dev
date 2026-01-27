import { motion, AnimatePresence } from 'motion/react';
import { IoClose } from 'react-icons/io5';

interface ExitButtonProps {
  visible: boolean;
  onClick: () => void;
}

/**
 * ExitButton Component
 *
 * HTML overlay button that appears in the top-right corner when users zoom into a planet.
 * Allows users to return to the galaxy view with a smooth fade animation.
 */
export default function ExitButton({ visible, onClick }: ExitButtonProps) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={onClick}
          aria-label="Return to galaxy view"
          className="fixed top-5 right-5 z-50 flex h-12 w-12 items-center justify-center rounded-full border border-purple-500/50 bg-black/60 shadow-[0_4px_12px_rgba(0,0,0,0.3)] transition-all duration-200 hover:border-purple-400/70 hover:bg-black/80"
        >
          <IoClose className="h-6 w-6 text-white" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
