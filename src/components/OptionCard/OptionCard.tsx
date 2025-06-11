import React from 'react';
import './OptionCard.scss';

interface Option {
  id: string;
  title: string;
  description: string;
  image: string;
  imageType: 'rounded' | 'square' | 'wide';
}

interface OptionCardProps {
  option: Option;
  isSelected: boolean;
  selectType: 'radio' | 'checkbox';
  onSelect: (optionId: string) => void;
}

const OptionCard: React.FC<OptionCardProps> = ({
  option,
  isSelected,
  selectType,
  onSelect
}) => {
  const handleCardClick = () => {
    onSelect(option.id);
  };

  const handleInputChange = () => {
    onSelect(option.id);
  };

  const inputId = `option-${option.id}`;
  
  return (
    <div 
      className={`option-card option-card--${option.imageType} ${isSelected ? 'option-card--selected' : ''}`}
      data-selected={isSelected}
      onClick={handleCardClick}
      data-testid="option-card"
    >
      <input
        type={selectType}
        id={inputId}
        name={`option-group-${selectType}`}
        checked={isSelected}
        onChange={handleInputChange}
        className="option-card__input"
        onClick={(e) => e.stopPropagation()}
      />
      <div className={`option-card__image option-card__image--${option.imageType}`}>
        <img 
          src={option.image} 
          alt={option.title}
        />
      </div>
      <label 
        htmlFor={inputId}
        className="option-card__title"
        onClick={(e) => e.stopPropagation()}
      >
        {option.title}
      </label>
      <p className="option-card__description">
        {option.description}
      </p>
    </div>
  );
};

export default OptionCard; 