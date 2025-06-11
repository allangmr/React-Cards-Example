import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import {
  setCurrentStep,
  nextStep,
  previousStep,
  toggleOptionSelection,
  setStepConfigs,
  resetConfigurator,
} from '../../store/configuratorSlice';
import { mockStepConfigs } from '../../utils/mockData';
import StepMenu from '../StepMenu';
import StepNavigation from '../StepNavigation';
import OptionCard from '../OptionCard';
import './DoorConfigurator.scss';

const DoorConfigurator: React.FC = () => {
  const dispatch = useAppDispatch();
  const {
    currentStep,
    steps,
    stepConfigs,
    selections,
  } = useAppSelector((state) => state.configurator);

  // Inicializar configuraciones al montar el componente
  useEffect(() => {
    dispatch(setStepConfigs(mockStepConfigs));
  }, [dispatch]);

  const currentStepConfig = stepConfigs.find(config => config.id === currentStep);
  const currentSelection = selections.find(selection => selection.stepId === currentStep);

  const handleStepClick = (stepId: number) => {
    dispatch(setCurrentStep(stepId));
  };

  const handleOptionSelect = (materialId: string) => {
    if (currentStepConfig) {
      dispatch(toggleOptionSelection({
        stepId: currentStep,
        materialId,
        isMultiSelect: currentStepConfig.isMultiSelect,
      }));
    }
  };

  const handleNext = () => {
    dispatch(nextStep());
  };

  const handlePrevious = () => {
    dispatch(previousStep());
  };

  const handleReset = () => {
    dispatch(resetConfigurator());
  };

  const handleFinish = () => {
    alert('¡Configuración completada! En una implementación real, aquí se procesaría la orden.');
  };

  const canGoNext = currentSelection && currentSelection.selectedOptionIds.length > 0;
  const canGoPrevious = currentStep > 1;

  return (
    <div className="door-configurator">
      <StepMenu
        steps={steps}
        currentStep={currentStep}
        onStepClick={handleStepClick}
      />

      <main className="door-configurator__main">
        <div className="door-configurator__content">
          {currentStepConfig && (
            <>
              <header className="door-configurator__header">
                <h1 className="door-configurator__title">
                  {currentStepConfig.title}
                </h1>
                <p className="door-configurator__description">
                  {currentStepConfig.description}
                </p>
              </header>

              <div className="door-configurator__materials">
                {currentStepConfig.options.map((option) => (
                  <OptionCard
                    key={option.id}
                    option={option}
                    isSelected={
                      currentSelection?.selectedOptionIds.includes(option.id) || false
                    }
                    selectType={currentStepConfig.isMultiSelect ? 'checkbox' : 'radio'}
                    onSelect={handleOptionSelect}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </main>

      <StepNavigation
        currentStep={currentStep}
        totalSteps={steps.length}
        canGoNext={!!canGoNext}
        canGoPrevious={canGoPrevious}
        onNext={handleNext}
        onPrevious={handlePrevious}
        onReset={handleReset}
        onFinish={handleFinish}
      />
    </div>
  );
};

export default DoorConfigurator; 