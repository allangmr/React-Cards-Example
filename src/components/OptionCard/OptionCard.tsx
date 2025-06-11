import React from 'react';
import styles from './OptionCard.module.scss';
import Icon from '../Icon';

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

/**
 * Returns the appropriate icon name based on selection type and state
 */
function getIconName(selectType: 'radio' | 'checkbox', isSelected: boolean): 'Radio' | 'CheckCircle' | 'CheckRadio' {
  if (selectType === 'radio') {
    return isSelected ? 'CheckRadio' : 'Radio';
  } else {
    return isSelected ? 'CheckCircle' : 'Radio';
  }
}

function OptionCard({
  option,
  isSelected,
  selectType,
  onSelect
}: OptionCardProps) {
  if (!option) {
    return null;
  }

  function handleCardClick(e: React.MouseEvent) {
    e.preventDefault();
    onSelect(option.id);
  }

  function handleCheckClick() {
    onSelect(option.id);
  }

  function handleLabelClick(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    onSelect(option.id);
  }

  const inputId = `option-${option.id}`;
  
  return (
    <div 
      className={`${styles.optionCard} ${styles[option.imageType]} ${isSelected ? styles.selected : ''}`}
      data-selected={isSelected}
      onClick={handleCardClick}
      data-testid="option-card"
      role="button"
      tabIndex={0}
      onKeyDown={function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect(option.id);
        }
      }}
    >
      <div className={styles.input}>
        <input
          type={selectType}
          id={inputId}
          checked={isSelected}
          onChange={() => onSelect(option.id)}
          style={{ 
            position: 'absolute',
            opacity: 0,
            width: '20px',
            height: '20px',
            margin: 0,
            cursor: 'pointer'
          }}
        />
        <div 
          onClick={handleCheckClick}
          style={{ 
            cursor: 'pointer',
            position: 'relative',
            pointerEvents: 'none'
          }}
        >
          <Icon 
            name={getIconName(selectType, isSelected)} 
            size="20px"
          />
        </div>
      </div>
      
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
}

export default OptionCard; 