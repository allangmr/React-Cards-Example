import { type PayloadAction, type SerializedError, createAsyncThunk, createSelector, createSlice } from "@reduxjs/toolkit";

import { RootState, initialState } from "./state";

import { ConfigurationService } from "~probuilder/features/configuration/services/ConfigurationService";
import { customErrorMap } from "~probuilder/features/shared/utils/customErrorMap";
import { InitializeConfig } from "~probuilder/features/shared/types/InitializeConfig";
import { Step } from "~probuilder/features/steps/types/Step";
import { StepsService } from "~probuilder/features/steps/services/StepsService";

/** The type for the complete application state */
export interface AppState {
    root: RootState;
}

/** Start the configuration process by fetching steps from the server */
export const startAsync = createAsyncThunk<Step[], void, { state: AppState; rejectValue: SerializedError }>(
    "root/start",
    async (_, { getState, rejectWithValue }) => {
        try {
            const state = getState().root;

            if (!state.productConfig || !state.logikConfig) {
                throw new Error("Product configuration or Logik configuration is missing.");
            }

            const configurationService = new ConfigurationService({
                productConfig: state.productConfig,
                logikConfig: state.logikConfig
            });

            const stepsService = new StepsService({
                logikConfig: state.logikConfig
            });
            const configuration = await configurationService.start();

            console.log("Configuration fetched:", configuration);

            return await stepsService.get(configuration);
        } catch (error) {
            return rejectWithValue(customErrorMap(error) as SerializedError);
        }
    }
);

const slice = createSlice({
    name: "root",
    initialState,
    reducers: {
        initialize(state, action: PayloadAction<InitializeConfig>) {
            state.productConfig = action.payload.productConfig;
            state.logikConfig = action.payload.logikConfig;
            state.cartConfig = action.payload.cartConfig;
            state.isCustomerService = action.payload.isCustomerService;
            state.status = "idle";
            state.error = null;
        },
        
        /** Navigate to the next step if current step is completed */
        navigateToNextStep(state) {
            const activeStepIndex = state.steps.findIndex((step: Step) => step.active);
            const currentStep = state.steps[activeStepIndex];
            
            if (currentStep?.completed && activeStepIndex < state.steps.length - 1) {
                currentStep.active = false;
                state.steps[activeStepIndex + 1].active = true;
            }
        },
        
        /** Navigate to the previous step */
        navigateToPreviousStep(state) {
            const activeStepIndex = state.steps.findIndex((step: Step) => step.active);
            
            if (activeStepIndex > 0) {
                state.steps[activeStepIndex].active = false;
                state.steps[activeStepIndex - 1].active = true;
            }
        },
        
        /** Mark the current active step as completed */
        markCurrentStepCompleted(state) {
            const activeStep = state.steps.find((step: Step) => step.active);
            if (activeStep) {
                activeStep.completed = true;
            }
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(startAsync.pending, (state) => {
                state.status = "loading";
                state.error = null;
            })
            .addCase(startAsync.fulfilled, (state, action) => {
                state.status = "idle";
                state.steps = action.payload;
            })
            .addCase(startAsync.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload ?? null;
            });
    }
});

// Export the slice and its actions
export const rootSlice = slice;
export const { 
    initialize, 
    navigateToNextStep, 
    navigateToPreviousStep, 
    markCurrentStepCompleted 
} = slice.actions;
export const start = startAsync;

/** Gets the root state from the app state */
function selectRoot(state: AppState): RootState {
    return state.root;
}

/** Selects the steps from the root state */
export const selectSteps = createSelector([selectRoot], (root: RootState): Step[] => root.steps);

/** Selects the current status from the root state */
export const selectStatus = createSelector([selectRoot], (root: RootState): "idle" | "loading" | "failed" => root.status);

/** Selects any error from the root state */
export const selectError = createSelector([selectRoot], (root: RootState): SerializedError | null => root.error); 