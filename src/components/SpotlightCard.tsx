import React, { useRef } from 'react';
import './SpotlightCard.css';

interface SpotlightCardProps extends React.PropsWithChildren {
  className?: string;
  spotlightColor?: `rgba(${number}, ${number}, ${number}, ${number})`;
}

const SpotlightCard: React.FC<SpotlightCardProps> = ({
  children,
  className = '',
  spotlightColor: _spotlightColor = 'rgba(255, 255, 255, 0.25)'
}) => {
  const divRef = useRef<HTMLDivElement>(null);

  // Spotlight is now static - no mouse tracking
  // The CSS default position (50%, 50%) creates a centered static glow

  return (
    <div ref={divRef} className={`card-spotlight ${className}`}>
      {children}
    </div>
  );
};

export default SpotlightCard;
