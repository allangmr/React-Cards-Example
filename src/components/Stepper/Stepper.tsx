import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import './Stepper.scss';
import { goToStep, nextStep, previousStep } from '../../store/slices/doorConfiguratorSlice';
import { selectSteps, selectCurrentStepIndex } from '../../store/selectors/doorConfiguratorSelectors';

export interface StepperProps {
  className?: string;
  showLabels?: boolean;
  clickable?: boolean;
}

const Stepper: React.FC<StepperProps> = ({
  className = '',
  showLabels = true,
  clickable = true
}) => {
  const dispatch = useDispatch();
  const steps = useSelector(selectSteps);
  const currentStepIndex = useSelector(selectCurrentStepIndex);

  const currentStep = steps[currentStepIndex];
  const nextStepInfo = currentStepIndex < steps.length - 1 ? steps[currentStepIndex + 1] : null;

  const handleStepClick = (stepIndex: number) => {
    if (clickable && stepIndex <= currentStepIndex) {
      dispatch(goToStep(stepIndex));
    }
  };

  const handleNext = () => {
    if (nextStepInfo) {
      dispatch(nextStep());
    }
  };

  const handlePrevious = () => {
    dispatch(previousStep());
  };

  const getStepClass = (stepIndex: number) => {
    const step = steps[stepIndex];
    let classes = 'stepper__step';
    
    if (step.active) {
      classes += ' stepper__step--active';
    }
    
    if (step.completed) {
      classes += ' stepper__step--completed';
    }
    
    if (clickable && stepIndex <= currentStepIndex) {
      classes += ' stepper__step--clickable';
    }
    
    return classes;
  };

  const getConnectorClass = (stepIndex: number) => {
    let classes = 'stepper__connector';
    
    if (stepIndex < currentStepIndex || steps[stepIndex].completed) {
      classes += ' stepper__connector--completed';
    }
    
    return classes;
  };

  return (
    <div className={`stepper ${className}`}>
      <div className="stepper__container">
        {steps.map((step, index) => (
          <React.Fragment key={step.id}>
            {/* Step Item */}
            <div 
              className={getStepClass(index)}
              onClick={() => handleStepClick(index)}
            >
              <div className="stepper__step-indicator">
                <div className="stepper__step-number">
                  {step.completed ? (
                    <svg className="stepper__check-icon" viewBox="0 0 24 24" fill="none">
                      <path 
                        d="M9 12l2 2 4-4" 
                        stroke="currentColor" 
                        strokeWidth="2" 
                        strokeLinecap="round" 
                        strokeLinejoin="round"
                      />
                    </svg>
                  ) : (
                    <span>{index + 1}</span>
                  )}
                </div>
              </div>
              
              {showLabels && (
                <div className="stepper__step-label">
                  <span className="stepper__step-name">{step.name}</span>
                </div>
              )}
            </div>

            {/* Connector (not shown for last step) */}
            {index < steps.length - 1 && (
              <div className={getConnectorClass(index)} />
            )}
          </React.Fragment>
        ))}
      </div>
      <div className="stepper__navigation">
        {currentStepIndex > 0 && (
          <button
            className="stepper__nav-button stepper__nav-button--previous"
            onClick={handlePrevious}
          >
            Previous
          </button>
        )}
        {nextStepInfo && (
          <button
            className="stepper__nav-button stepper__nav-button--next"
            onClick={handleNext}
            disabled={!currentStep.completed}
          >
            {nextStepInfo.name}
          </button>
        )}
      </div>
    </div>
  );
};

export default Stepper; 