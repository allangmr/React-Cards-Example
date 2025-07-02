import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '../../types/store';

// Base selector
export const selectDoorConfigurator = (state: RootState) => state.doorConfigurator;

// Basic selectors
export const selectSteps = createSelector(
  [selectDoorConfigurator],
  (configurator) => configurator.steps
);

export const selectCurrentStepIndex = createSelector(
  [selectDoorConfigurator],
  (configurator) => configurator.currentStepIndex
);

export const selectTotalPrice = createSelector(
  [selectDoorConfigurator],
  (configurator) => configurator.totalPrice
);

export const selectIsLoading = createSelector(
  [selectDoorConfigurator],
  (configurator) => configurator.isLoading
);

// Current step selectors
export const selectCurrentStep = createSelector(
  [selectSteps, selectCurrentStepIndex],
  (steps, currentStepIndex) => steps[currentStepIndex]
);

export const selectActiveStep = createSelector(
  [selectSteps],
  (steps) => steps.find(step => step.active)
);

// Navigation capability selectors
export const selectCanGoNext = createSelector(
  [selectCurrentStepIndex, selectSteps],
  (currentStepIndex, steps) => currentStepIndex < steps.length - 1
);

export const selectCanGoPrevious = createSelector(
  [selectCurrentStepIndex, selectActiveStep],
  (currentStepIndex, activeStep) => {
    // If activeStep is true and it's step 1 (index 0), disable previous button
    if (activeStep && currentStepIndex === 0) {
      return false;
    }
    return currentStepIndex > 0;
  }
);

// Step status selectors
export const selectIsFirstStep = createSelector(
  [selectCurrentStepIndex],
  (currentStepIndex) => currentStepIndex === 0
);

export const selectIsLastStep = createSelector(
  [selectCurrentStepIndex, selectSteps],
  (currentStepIndex, steps) => currentStepIndex === steps.length - 1
);

// Completed steps selector
export const selectCompletedSteps = createSelector(
  [selectSteps],
  (steps) => steps.filter(step => step.completed)
);

export const selectCompletedStepsCount = createSelector(
  [selectCompletedSteps],
  (completedSteps) => completedSteps.length
);

// Progress selector
export const selectProgress = createSelector(
  [selectCurrentStepIndex, selectSteps],
  (currentStepIndex, steps) => {
    const progress = ((currentStepIndex + 1) / steps.length) * 100;
    return Math.round(progress);
  }
);

// Step navigation state for components
export const selectStepNavigationState = createSelector(
  [
    selectCurrentStepIndex,
    selectSteps,
    selectCanGoNext,
    selectCanGoPrevious,
    selectIsFirstStep,
    selectIsLastStep,
    selectProgress
  ],
  (currentStepIndex, steps, canGoNext, canGoPrevious, isFirstStep, isLastStep, progress) => ({
    currentStepIndex,
    totalSteps: steps.length,
    canGoNext,
    canGoPrevious,
    isFirstStep,
    isLastStep,
    progress,
    steps
  })
); 