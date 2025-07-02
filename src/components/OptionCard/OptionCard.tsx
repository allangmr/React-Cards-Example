import React from 'react';
import styles from './OptionCard.module.scss';
import Icon from '../Icon/Icon';
import type { OptionItem } from '../../types/Step';

export interface OptionCardProps {
  option: OptionItem;
  isSelected: boolean;
  selectType: 'radio' | 'checkbox';
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
  selectType
}: OptionCardProps) {
  if (!option) {
    return null;
  }

  const inputId = `option-${option.id}`;
  
  return (
    <div 
      className={`${styles['option-card']} ${styles[`option-card-${option.imageType}`]} ${isSelected ? styles['option-card-selected'] : ''}`}
      data-selected={isSelected}
      data-option-id={option.id}
      data-select-type={selectType}
      data-testid="option-card"
      role="button"
      tabIndex={0}
    >
      <div className={styles['option-card-input']}>
        <input
          type={selectType}
          id={inputId}
          checked={isSelected}
          readOnly
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
      
      <div className={`${styles['option-card-image']} ${styles[`option-card-image-${option.imageType}`]}`}>
        <img 
          src={option.image} 
          alt={option.title} 
        />
      </div>
      
      <div className={styles['option-card-content']}>
        {option.tag && (
          <div className={styles['option-card-tag']}>
            {option.tag}
          </div>
        )}
        <label 
          htmlFor={inputId}
          className={styles['option-card-title']}
        >
          {option.title}
        </label>
      </div>
      
      <p className={styles['option-card-description']}>
        {option.description}
      </p>
    </div>
  );
}

export default OptionCard; 