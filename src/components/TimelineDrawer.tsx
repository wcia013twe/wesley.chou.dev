

export interface TimelineDrawerProps {
  title: string;
  workplace: string;
  date: string;
  location: string;
  description: string;
  skills: string[];
  key_responsibilities: string[];
  isOpen: boolean;
  onClose: () => void;
}

const TimelineDrawer: React.FC<TimelineDrawerProps> = ({
  title,
  workplace,
  date,
  location,
  description,
  skills,
  key_responsibilities,
  isOpen,
  onClose
}) => {
  return (
    <div
      className={`fixed inset-0 z-50 flex ${isOpen ? "" : "pointer-events-none"}`}
      style={{ background: isOpen ? "rgba(0,0,0,0.5)" : "transparent" }}
    >
      {/* Drawer panel */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-[#23272f] shadow-2xl transition-transform duration-300 ease-in-out ${isOpen ? "translate-x-0" : "translate-x-full"}`}
        role="dialog"
        aria-modal="true"
      >
        <button
          className="absolute top-4 right-4 text-white text-2xl"
          onClick={onClose}
          aria-label="Close"
        >
          ✕
        </button>
        <div className="p-6">
          <h2 className="text-2xl font-bold text-white mb-2">{title}</h2>
          <h4 className="text-gray-300 mb-2">{workplace}</h4>
          <p className="text-white mb-4">{description}</p>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill, i) => (
              <span
                key={i}
                className="bg-indigo-900 text-indigo-300 px-3 py-1 rounded-full text-xs font-medium"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>
      {/* Overlay for closing */}
      {isOpen && (
        <div
          className="flex-1 cursor-pointer"
          onClick={onClose}
          aria-label="Close Drawer"
        />
      )}
    </div>
  );
};

export default TimelineDrawer;
