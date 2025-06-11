import React from 'react';
import radioSvg from '../../assets/icons/radio.svg';
import checkCircleSvg from '../../assets/icons/check-circle.svg';
import checkRadioSvg from '../../assets/icons/check-radio.svg';

interface IconProps {
  name: 'radio' | 'check-circle' | 'check-radio';
  size?: number;
  className?: string;
  onClick?: () => void;
  style?: React.CSSProperties;
}

const Icon: React.FC<IconProps> = ({ 
  name, 
  size = 20, 
  className = '', 
  onClick,
  style = {}
}) => {
  const getSvgPath = () => {
    switch (name) {
      case 'radio':
        return radioSvg;
      case 'check-circle':
        return checkCircleSvg;
      case 'check-radio':
        return checkRadioSvg;
      default:
        return '';
    }
  };

  return (
    <div 
      className={className}
      onClick={onClick}
      style={{ 
        cursor: onClick ? 'pointer' : 'default',
        display: 'inline-block',
        ...style 
      }}
    >
      <img 
        src={getSvgPath()} 
        alt={name}
        width={size} 
        height={size}
        style={{ display: 'block' }}
      />
    </div>
  );
};

export default Icon; 