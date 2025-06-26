import { createSelector } from "@reduxjs/toolkit";

import { NavigationStep } from "../types/Step";

import { selectError, selectStatus, selectSteps } from "~probuilder/store/rootSlice";
import { RootState } from "~probuilder/store/state";

interface StepNavigationState extends Omit<RootState, "steps"> {
    navigation: {
        nextStep: NavigationStep | null;
        prevStep: NavigationStep | null;
    };
    allStepsCompleted: boolean;
    currentStepData: RootState["steps"][0] | null;
    previousStepData: RootState["steps"][0] | null;
    nextStepData: RootState["steps"][0] | null;
    currentStepValidity: {
        isValid: boolean;
        canAdvance: boolean;
    };
}

/**
 * Enhanced selector for step navigation with validation and step data
 * Returns previous/next steps, current step validity, and navigation state
 */
function selector(
    steps: RootState["steps"],
    status: RootState["status"],
    error: RootState["error"]
): StepNavigationState {
    const activeStepIndex = steps.findIndex((step) => step.active);
    const currentStep = activeStepIndex >= 0 ? steps[activeStepIndex] : null;
    
    // Enhanced step data
    const previousStepData = activeStepIndex > 0 ? steps[activeStepIndex - 1] : null;
    const nextStepData = activeStepIndex < steps.length - 1 ? steps[activeStepIndex + 1] : null;
    
    // Current step validity
    const isCurrentStepValid = currentStep?.completed ?? false;
    const canAdvanceToNext = isCurrentStepValid && nextStepData !== null;

    const prevStep = activeStepIndex > 0 ? {
        id: steps[activeStepIndex - 1].id,
        label: 'Back',
        isEnabled: true
    } : null;

    const nextStep = activeStepIndex < steps.length - 1 ? {
        id: steps[activeStepIndex + 1].id,
        label: steps[activeStepIndex + 1].name,
        isEnabled: canAdvanceToNext
    } : null;

    const allStepsCompleted = steps.length > 0 && steps.every((step) => step.completed);

    return {
        status,
        error,
        navigation: {
            prevStep,
            nextStep
        },
        allStepsCompleted,
        currentStepData: currentStep,
        previousStepData,
        nextStepData,
        currentStepValidity: {
            isValid: isCurrentStepValid,
            canAdvance: canAdvanceToNext
        }
    };
}

export const selectStepNavigation = createSelector([selectSteps, selectStatus, selectError], selector);

/** Selects whether the current step is valid */
export const selectCurrentStepValidity = createSelector(
    [selectStepNavigation],
    (stepNavigation) => stepNavigation.currentStepValidity.isValid
);

/** Selects whether navigation to next step is allowed */
export const selectCanNavigateNext = createSelector(
    [selectStepNavigation],
    (stepNavigation) => stepNavigation.currentStepValidity.canAdvance
);

/** Selects the previous step data */
export const selectPreviousStepData = createSelector(
    [selectStepNavigation],
    (stepNavigation) => stepNavigation.previousStepData
);

/** Selects the next step data */
export const selectNextStepData = createSelector(
    [selectStepNavigation],
    (stepNavigation) => stepNavigation.nextStepData
); 