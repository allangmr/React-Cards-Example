import { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { StepNavigationProps } from '../components/StepNavigation/types';
import { 
  nextStep, 
  previousStep, 
  resetConfigurator 
} from '../store/slices/doorConfiguratorSlice';
import {
  selectCanGoNext,
  selectCanGoPrevious,
  selectIsLoading,
  selectCurrentStepIndex,
  selectSteps
} from '../store/selectors/doorConfiguratorSelectors';

interface UseDoorConfiguratorNavigationOptions {
  onStepChange?: (stepIndex: number) => void;
  onComplete?: () => void;
  previousLabel?: string;
  nextLabel?: string;
}

export function useDoorConfiguratorNavigation(
  options: UseDoorConfiguratorNavigationOptions = {}
): StepNavigationProps {
  const dispatch = useDispatch();
  
  // Selectors
  const canGoNext = useSelector(selectCanGoNext);
  const canGoPrevious = useSelector(selectCanGoPrevious);
  const isLoading = useSelector(selectIsLoading);
  const currentStepIndex = useSelector(selectCurrentStepIndex);
  const steps = useSelector(selectSteps);
  
  const {
    onStepChange,
    onComplete,
    previousLabel = 'Previous',
    nextLabel = 'Next'
  } = options;

  // Navigation handlers
  const handleNext = useCallback(() => {
    const isLastStep = currentStepIndex === steps.length - 1;
    
    if (isLastStep && onComplete) {
      onComplete();
    } else {
      dispatch(nextStep());
      const newStepIndex = currentStepIndex + 1;
      if (onStepChange) {
        onStepChange(newStepIndex);
      }
    }
  }, [dispatch, currentStepIndex, steps.length, onComplete, onStepChange]);

  const handlePrevious = useCallback(() => {
    dispatch(previousStep());
    const newStepIndex = currentStepIndex - 1;
    if (onStepChange) {
      onStepChange(newStepIndex);
    }
  }, [dispatch, currentStepIndex, onStepChange]);

  // Return props for StepNavigation component
  return {
    canGoNext,
    canGoPrevious,
    onNext: handleNext,
    onPrevious: handlePrevious,
    loading: isLoading,
    previousLabel,
    nextLabel
  };
}

// Hook for Stepper component integration
export function useDoorConfiguratorStepper() {
  const dispatch = useDispatch();
  
  const steps = useSelector(selectSteps);
  const currentStepIndex = useSelector(selectCurrentStepIndex);
  const isLoading = useSelector(selectIsLoading);

  const resetConfiguration = useCallback(() => {
    dispatch(resetConfigurator());
  }, [dispatch]);

  return {
    steps,
    currentStepIndex,
    isLoading,
    resetConfiguration
  };
} 