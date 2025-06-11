import React from 'react';

interface SquareCheckProps {
  isSelected: boolean;
  onClick: () => void;
  className?: string;
}

const SquareCheck: React.FC<SquareCheckProps> = ({ isSelected, onClick, className = '' }) => {
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
      role="checkbox"
      aria-checked={isSelected}
    >
      {isSelected ? (
        // Filled version - cuadrado con check
        <>
          <rect
            x="1"
            y="1"
            width="18"
            height="18"
            rx="3"
            fill="#3b82f6"
            stroke="#3b82f6"
            strokeWidth="2"
          />
          <path
            d="M6 10L8.5 12.5L14 7"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </>
      ) : (
        // Normal version - cuadrado vacío
        <rect
          x="1"
          y="1"
          width="18"
          height="18"
          rx="3"
          fill="white"
          stroke="#D0D5DD"
          strokeWidth="2"
        />
      )}
    </svg>
  );
};

export default SquareCheck; 