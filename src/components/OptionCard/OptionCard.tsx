import React from 'react';
import styles from './OptionCard.module.scss';

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
      className={`${styles.optionCard} ${styles[option.imageType]} ${isSelected ? styles.selected : ''}`}
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
        className={styles.input}
        onClick={(e) => e.stopPropagation()}
      />
      <div className={`${styles.image} ${styles[option.imageType]}`}>
        <img 
          src={option.image} 
          alt={option.title}
        />
      </div>
      <label 
        htmlFor={inputId}
        className={styles.title}
        onClick={(e) => e.stopPropagation()}
      >
        {option.title}
      </label>
      <p className={styles.description}>
        {option.description}
      </p>
    </div>
  );
};

export default OptionCard; 