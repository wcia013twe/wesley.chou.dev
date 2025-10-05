// src/components/FloatingScrollPrompt.jsx
import useHideOnScroll from '@/hooks/useHideOnScroll'; 

const FloatingScrollPrompt = () => {
  const isVisible = useHideOnScroll(100); 

  return (
    // Changes:
    // 1. Removed 'bg-[#4b2d88]' to make the background transparent.
    // 2. Maintained 'fixed bottom-0' to align it to the bottom.
    <div
      className={`
        fixed -bottom-25 left-0 right-0 p-4 transition-opacity duration-500 z-50
      
        ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-full pointer-events-none'}
      `}
    >
      <div className="flex flex-col items-center justify-center">
        <p className="text-white text-2xl font-medium mb-1">
          More about me
        </p>
        <svg
          className="h-6 w-6 text-white animate-bounce"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  );
};

export default FloatingScrollPrompt;