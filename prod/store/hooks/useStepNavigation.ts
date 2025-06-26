import { useCallback } from "react";
import { selectStepNavigation } from "~probuilder/features/steps/selectors/selectStepNavigation";
import { useAppSelector, useAppDispatch } from "~probuilder/store/hooks";
import { 
    navigateToNextStep, 
    navigateToPreviousStep, 
    markCurrentStepCompleted 
} from "~probuilder/store/rootSlice";

/**
 * Enhanced hook to access and control step navigation state
 * Provides navigation actions and enriched step data
 */
export function useStepNavigation() {
    const dispatch = useAppDispatch();
    const stepNavigationState = useAppSelector(selectStepNavigation);

    /** Navigate to the previous step if enabled */
    const goToPreviousStep = useCallback(() => {
        if (stepNavigationState.navigation.prevStep?.isEnabled) {
            dispatch(navigateToPreviousStep());
        }
    }, [dispatch, stepNavigationState.navigation.prevStep?.isEnabled]);

    /** Navigate to the next step if current step is valid */
    const goToNextStep = useCallback(() => {
        if (stepNavigationState.currentStepValidity.canAdvance) {
            dispatch(navigateToNextStep());
        }
    }, [dispatch, stepNavigationState.currentStepValidity.canAdvance]);

    /** Mark the current step as completed */
    const markStepCompleted = useCallback(() => {
        dispatch(markCurrentStepCompleted());
    }, [dispatch]);

    /** Handle configuration finalization */
    const finalizeConfiguration = useCallback(() => {
        console.log('Configuration finalized');
    }, []);

    // Enhance navigation with action callbacks
    const enhancedNavigation = {
        ...stepNavigationState.navigation,
        prevStep: stepNavigationState.navigation.prevStep ? {
            ...stepNavigationState.navigation.prevStep,
            action: goToPreviousStep
        } : null,
        nextStep: stepNavigationState.navigation.nextStep ? {
            ...stepNavigationState.navigation.nextStep,
            action: goToNextStep
        } : null,
        finalizeAction: finalizeConfiguration
    };

    return {
        ...stepNavigationState,
        navigation: enhancedNavigation,
        actions: {
            goToPreviousStep,
            goToNextStep,
            markStepCompleted,
            finalizeConfiguration
        }
    };
} 