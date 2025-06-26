import { fn } from "@storybook/test";

import { NavigationStep } from "~probuilder/features/steps/types/Step";

interface MockResult {
    navigation: {
        prevStep: NavigationStep | null;
        nextStep: NavigationStep | null;
        finalizeAction: () => void;
    };
    status: "idle" | "loading" | "failed";
    error: null | Error;
    allStepsCompleted: boolean;
    currentStepData: any | null;
    previousStepData: any | null;
    nextStepData: any | null;
    currentStepValidity: {
        isValid: boolean;
        canAdvance: boolean;
    };
    actions: {
        goToPreviousStep: () => void;
        goToNextStep: () => void;
        markStepCompleted: () => void;
        finalizeConfiguration: () => void;
    };
}

const STEPS = [
    { id: "door-size", name: "Door Size", active: false, completed: false },
    { id: "wall-type", name: "Wall Type", active: false, completed: false },
    { id: "door-style", name: "Door Style", active: false, completed: false },
    { id: "hardware", name: "Hardware", active: false, completed: false },
    { id: "review", name: "Review", active: false, completed: false }
];

export const useStepNavigation = fn<() => MockResult>(() => getMockedStepNavigation({
    activeStep: 0,
    hasSelections: false
})).mockName("useStepNavigation");

interface MockedStepNavigationParams {
    activeStep?: number;
    hasSelections?: boolean;
    allStepsCompletedOverride?: boolean;
    error?: Error | null;
    status?: "idle" | "loading" | "failed";
}

export function getMockedStepNavigation({
    activeStep = 0,
    hasSelections = false,
    allStepsCompletedOverride = false,
    error = null,
    status = "idle"
}: MockedStepNavigationParams = {}): MockResult {
    const safeActiveStep = Math.min(Math.max(0, activeStep), STEPS.length - 1);
    

    const steps = STEPS.map((step, idx) => ({
        ...step,
        active: idx === safeActiveStep,
        completed: allStepsCompletedOverride || idx < safeActiveStep || (idx === safeActiveStep && hasSelections)
    }));
    
    const currentStep = steps[safeActiveStep];
    const allStepsCompleted = steps.length > 0 && steps.every((step) => step.completed);
    
    const previousStepData = safeActiveStep > 0 ? steps[safeActiveStep - 1] : null;
    const nextStepData = safeActiveStep < STEPS.length - 1 ? steps[safeActiveStep + 1] : null;
    
    const isCurrentStepValid = currentStep?.completed ?? false;
    const canAdvanceToNext = isCurrentStepValid && nextStepData !== null;
    const mockGoToPreviousStep = fn(() => console.log('Mock: Navigate to previous step')).mockName('goToPreviousStep');
    const mockGoToNextStep = fn(() => console.log('Mock: Navigate to next step')).mockName('goToNextStep');
    const mockMarkStepCompleted = fn(() => console.log('Mock: Mark step completed')).mockName('markStepCompleted');
    const mockFinalizeConfiguration = fn(() => console.log('Mock: Finalize configuration')).mockName('finalizeConfiguration');

    return {
        navigation: {
            prevStep: previousStepData ? {
                id: previousStepData.id,
                label: 'Back',
                isEnabled: true,
                action: mockGoToPreviousStep
            } : null,
            nextStep: nextStepData ? {
                id: nextStepData.id,
                label: nextStepData.name,
                isEnabled: canAdvanceToNext,
                action: mockGoToNextStep
            } : null,
            finalizeAction: mockFinalizeConfiguration
        },
        status,
        error,
        allStepsCompleted,
        currentStepData: currentStep,
        previousStepData,
        nextStepData,
        currentStepValidity: {
            isValid: isCurrentStepValid,
            canAdvance: canAdvanceToNext
        },
        actions: {
            goToPreviousStep: mockGoToPreviousStep,
            goToNextStep: mockGoToNextStep,
            markStepCompleted: mockMarkStepCompleted,
            finalizeConfiguration: mockFinalizeConfiguration
        }
    };
} 