import React from 'react';
import type { Step } from '../../types';
import './StepMenu.scss';

interface StepMenuProps {
  steps: Step[];
  currentStep: number;
  onStepClick: (stepId: number) => void;
}

const StepMenu: React.FC<StepMenuProps> = ({ steps, currentStep, onStepClick }) => {
  return (
    <aside className="step-menu">
      <div className="step-menu__header">
        <h2 className="step-menu__title">Configurador de Puertas</h2>
        <p className="step-menu__subtitle">Personaliza tu puerta de seguridad</p>
      </div>
      
      <nav className="step-menu__nav">
        <ol className="step-menu__list">
          {steps.map((step, index) => (
            <li key={step.id} className="step-menu__item">
              <button
                className={`step-menu__button ${
                  step.isCurrent ? 'step-menu__button--current' : ''
                } ${step.isCompleted ? 'step-menu__button--completed' : ''}`}
                onClick={() => onStepClick(step.id)}
                disabled={!step.isCompleted && !step.isCurrent && index > 0}
              >
                <div className="step-menu__step-indicator">
                  <span className="step-menu__step-number">
                    {step.isCompleted ? '✓' : step.id}
                  </span>
                </div>
                
                <div className="step-menu__step-content">
                  <h3 className="step-menu__step-title">{step.title}</h3>
                  <p className="step-menu__step-description">{step.description}</p>
                </div>
              </button>
              
              {index < steps.length - 1 && (
                <div className={`step-menu__connector ${
                  step.isCompleted ? 'step-menu__connector--completed' : ''
                }`} />
              )}
            </li>
          ))}
        </ol>
      </nav>
      
      <div className="step-menu__footer">
        <div className="step-menu__progress">
          <div className="step-menu__progress-label">
            Progreso: {steps.filter(s => s.isCompleted).length}/{steps.length}
          </div>
          <div className="step-menu__progress-bar">
            <div 
              className="step-menu__progress-fill"
              style={{ 
                width: `${(steps.filter(s => s.isCompleted).length / steps.length) * 100}%` 
              }}
            />
          </div>
        </div>
      </div>
    </aside>
  );
};

export default StepMenu; 