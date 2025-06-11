import React from 'react';
import styles from './OptionCard.module.scss';
import CheckCircle from './CheckCircle';
import SquareCheck from './SquareCheck';

interface Option {
  id: string;
  title: string;
  description: string;
  image: string;
  imageType: 'rounded' | 'square' | 'wide';
}

export interface OptionCardProps {
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
  // Protección contra option undefined
  if (!option) {
    console.error('OptionCard: option prop is required');
    return null;
  }

  const handleCardClick = (e: React.MouseEvent) => {
    e.preventDefault();
    onSelect(option.id);
  };

  const handleCheckClick = () => {
    onSelect(option.id);
  };

  const handleLabelClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onSelect(option.id);
  };

  const inputId = `option-${option.id}`;
  
  return (
    <div 
      className={`${styles.optionCard} ${styles[option.imageType]} ${isSelected ? styles.selected : ''}`}
      data-selected={isSelected}
      onClick={handleCardClick}
      data-testid="option-card"
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect(option.id);
        }
      }}
    >
      {selectType === 'radio' ? (
        <CheckCircle
          isSelected={isSelected}
          onClick={handleCheckClick}
          className={styles.input}
        />
      ) : (
        <SquareCheck
          isSelected={isSelected}
          onClick={handleCheckClick}
          className={styles.input}
        />
      )}
      
      <div className={`${styles.image} ${styles[option.imageType]}`}>
        <img 
          src={option.image} 
          alt={option.title} 
        />
      </div>
      <label 
        htmlFor={inputId}
        className={styles.title}
        onClick={handleLabelClick}
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