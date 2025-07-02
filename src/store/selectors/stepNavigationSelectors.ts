import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '../index';
import type { StepConfig, Selection } from '../../types';

// Base selectors
export const selectStepperState = (state: RootState) => state.configurator;

// Current step selector
export const selectCurrentStep = createSelector(
  [selectStepperState],
  (stepper) => stepper.currentStep
);

// Total steps selector
export const selectTotalSteps = createSelector(
  [selectStepperState],
  (stepper) => stepper.steps.length
);

// Navigation capability selectors
export const selectCanGoNext = createSelector(
  [selectCurrentStep, selectTotalSteps],
  (currentStep, totalSteps) => currentStep < totalSteps
);

export const selectCanGoPrevious = createSelector(
  [selectCurrentStep],
  (currentStep) => currentStep > 1
);

// Current step status selectors
export const selectIsFirstStep = createSelector(
  [selectCurrentStep],
  (currentStep) => currentStep === 1
);

export const selectIsLastStep = createSelector(
  [selectCurrentStep, selectTotalSteps],
  (currentStep, totalSteps) => currentStep === totalSteps
);

// Complex selectors for component state
export const selectStepNavigationState = createSelector(
  [
    selectCurrentStep,
    selectTotalSteps,
    selectCanGoNext,
    selectCanGoPrevious,
    selectIsFirstStep,
    selectIsLastStep,
  ],
  (currentStep, totalSteps, canGoNext, canGoPrevious, isFirstStep, isLastStep) => ({
    currentStep,
    totalSteps,
    canGoNext,
    canGoPrevious,
    isFirstStep,
    isLastStep,
  })
);

// Information selector for UI display
export const selectStepNavigationInfo = createSelector(
  [selectCurrentStep, selectTotalSteps],
  (currentStep, totalSteps) => ({
    stepText: `Step ${currentStep} of ${totalSteps}`,
    progressPercentage: (currentStep / totalSteps) * 100,
  })
);

// Selectors específicos para StepNavigation
export const selectSteps = createSelector(
  selectStepperState,
  (stepper) => stepper.steps
);

export const selectSelections = createSelector(
  selectStepperState,
  (stepper) => stepper.selections
);

export const selectStepConfigs = createSelector(
  selectStepperState,
  (stepper) => stepper.stepConfigs
);

export const selectTotalPrice = createSelector(
  selectStepperState,
  (stepper) => stepper.totalPrice
);

// Selector para el paso actual con toda su configuración
export const selectCurrentStepConfig = createSelector(
  [selectStepConfigs, selectCurrentStep],
  (stepConfigs: StepConfig[], currentStep: number) => 
    stepConfigs.find(config => config.id === currentStep)
);

// Selector para la selección actual
export const selectCurrentSelection = createSelector(
  [selectSelections, selectCurrentStep],
  (selections: Selection[], currentStep: number) => 
    selections.find(selection => selection.stepId === currentStep)
); 