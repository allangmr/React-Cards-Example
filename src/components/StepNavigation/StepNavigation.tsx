import React from 'react';
import './StepNavigation.scss';

interface StepNavigationProps {
  currentStep: number;
  totalSteps: number;
  canGoNext: boolean;
  canGoPrevious: boolean;
  totalPrice: number;
  onNext: () => void;
  onPrevious: () => void;
  onReset: () => void;
  onFinish: () => void;
}

const StepNavigation: React.FC<StepNavigationProps> = ({
  currentStep,
  totalSteps,
  canGoNext,
  canGoPrevious,
  totalPrice,
  onNext,
  onPrevious,
  onReset,
  onFinish,
}) => {
  const isLastStep = currentStep === totalSteps;

  return (
    <div className="step-navigation">
      <div className="step-navigation__container">
        <div className="step-navigation__info">
          <div className="step-navigation__step-counter">
            Paso {currentStep} de {totalSteps}
          </div>
          
          <div className="step-navigation__price">
            <span className="step-navigation__price-label">Total:</span>
            <span className="step-navigation__price-value">
              ${totalPrice.toLocaleString()}
            </span>
          </div>
        </div>

        <div className="step-navigation__actions">
          <button
            className="step-navigation__button step-navigation__button--secondary"
            onClick={onReset}
            type="button"
          >
            Reiniciar
          </button>

          <button
            className="step-navigation__button step-navigation__button--secondary"
            onClick={onPrevious}
            disabled={!canGoPrevious}
            type="button"
          >
            ← Anterior
          </button>

          {isLastStep ? (
            <button
              className="step-navigation__button step-navigation__button--success"
              onClick={onFinish}
              disabled={!canGoNext}
              type="button"
            >
              Finalizar Configuración
            </button>
          ) : (
            <button
              className="step-navigation__button step-navigation__button--primary"
              onClick={onNext}
              disabled={!canGoNext}
              type="button"
            >
              Siguiente →
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default StepNavigation; 