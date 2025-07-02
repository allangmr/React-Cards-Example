import React from 'react';
import type { StepOption } from '../../types/Step';
import OptionCard from '../OptionCard';
import './StepItem.scss';

export interface StepItemProps {
  /**
   * The data for the step question and options.
   */
  data: StepOption;
  /**
   * The currently selected option ID(s).
   */
  selection: string[];
  /**
   * Callback function to be invoked when the selection changes.
   */
  onSelectionChange: (newSelection: string[]) => void;
}

/**
 * StepItem component displays a question with a title, description,
 * and a list of selectable options (using OptionCard).
 */
const StepItem: React.FC<StepItemProps> = ({ data, selection, onSelectionChange }) => {
  const { title, description, options, selectType } = data;

  const handleSelect = (optionId: string) => {
    if (selectType === 'radio') {
      onSelectionChange([optionId]);
    } else {
      const newSelection = selection.includes(optionId)
        ? selection.filter(id => id !== optionId)
        : [...selection, optionId];
      onSelectionChange(newSelection);
    }
  };

  return (
    <div className="step-item" data-testid="step-item">
      <div className="step-item__header">
        <h2 className="step-item__title">{title}</h2>
        {description && <p className="step-item__description">{description}</p>}
      </div>
      <div className="step-item__options">
        {options.map((option) => (
          <div key={option.id} onClick={() => handleSelect(option.id)} className="step-item__option-wrapper">
             <OptionCard
              option={option}
              isSelected={selection.includes(option.id)}
              selectType={selectType}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default StepItem; 