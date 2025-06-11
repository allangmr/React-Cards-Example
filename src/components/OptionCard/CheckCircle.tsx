import React from 'react';

interface CheckCircleProps {
  isSelected: boolean;
  onClick: () => void;
  className?: string;
}

const CheckCircle: React.FC<CheckCircleProps> = ({ isSelected, onClick, className = '' }) => {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      onClick={onClick}
      className={className}
      style={{ cursor: 'pointer' }}
      role="radio"
      aria-checked={isSelected}
    >
      {isSelected ? (
        // Filled version - círculo seleccionado
        <>
          <circle
            cx="10"
            cy="10"
            r="9"
            fill="white"
            stroke="#3b82f6"
            strokeWidth="2"
          />
          <circle
            cx="10"
            cy="10"
            r="4"
            fill="#3b82f6"
          />
        </>
      ) : (
        // Normal version - círculo vacío
        <circle
          cx="10"
          cy="10"
          r="9"
          fill="white"
          stroke="#D0D5DD"
          strokeWidth="2"
        />
      )}
    </svg>
  );
};

export default CheckCircle; 