import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { ConfiguratorState } from '../types';

const initialState: ConfiguratorState = {
  currentStep: 1,
  steps: [
    { id: 1, title: 'Cerradura', description: 'Selecciona el tipo de cerradura', isCompleted: false, isCurrent: true },
    { id: 2, title: 'Material', description: 'Elige el material de la puerta', isCompleted: false, isCurrent: false },
    { id: 3, title: 'Refuerzo Militar', description: 'Añade refuerzo de seguridad', isCompleted: false, isCurrent: false },
    { id: 4, title: 'Color', description: 'Selecciona el color de acabado', isCompleted: false, isCurrent: false },
    { id: 5, title: 'Accesorios', description: 'Añade accesorios adicionales', isCompleted: false, isCurrent: false },
  ],
  stepConfigs: [],
  selections: [],
  totalPrice: 0,
};

const configuratorSlice = createSlice({
  name: 'configurator',
  initialState,
  reducers: {
    setCurrentStep: (state, action: PayloadAction<number>) => {
      state.currentStep = action.payload;
      state.steps.forEach((step) => {
        step.isCurrent = step.id === action.payload;
      });
    },
    nextStep: (state) => {
      if (state.currentStep < state.steps.length) {
        const currentStepIndex = state.currentStep - 1;
        state.steps[currentStepIndex].isCompleted = true;
        state.steps[currentStepIndex].isCurrent = false;
        
        state.currentStep += 1;
        if (state.currentStep <= state.steps.length) {
          state.steps[state.currentStep - 1].isCurrent = true;
        }
      }
    },
    previousStep: (state) => {
      if (state.currentStep > 1) {
        state.steps[state.currentStep - 1].isCurrent = false;
        state.currentStep -= 1;
        state.steps[state.currentStep - 1].isCurrent = true;
        state.steps[state.currentStep - 1].isCompleted = false;
      }
    },
    toggleOptionSelection: (state, action: PayloadAction<{ stepId: number; materialId: string; isMultiSelect: boolean }>) => {
      const { stepId, materialId, isMultiSelect } = action.payload;
      
      const existingSelection = state.selections.find(s => s.stepId === stepId);
      
      if (existingSelection) {
        if (isMultiSelect) {
          const materialIndex = existingSelection.selectedOptionIds.indexOf(materialId);
          if (materialIndex > -1) {
            existingSelection.selectedOptionIds.splice(materialIndex, 1);
          } else {
            existingSelection.selectedOptionIds.push(materialId);
          }
        } else {
          existingSelection.selectedOptionIds = [materialId];
        }
      } else {
        state.selections.push({
          stepId,
          selectedOptionIds: [materialId],
          isMultiSelect,
        });
      }
    },
    setStepConfigs: (state, action: PayloadAction<any[]>) => {
      state.stepConfigs = action.payload;
    },
    calculateTotalPrice: (state) => {
      // Ya no calculamos precio ya que las opciones no tienen precio
      state.totalPrice = 0;
    },
    resetConfigurator: (state) => {
      state.currentStep = 1;
      state.selections = [];
      state.totalPrice = 0;
      state.steps.forEach((step, index) => {
        step.isCompleted = false;
        step.isCurrent = index === 0;
      });
    },
  },
});

export const {
  setCurrentStep,
  nextStep,
  previousStep,
  toggleOptionSelection,
  setStepConfigs,
  calculateTotalPrice,
  resetConfigurator,
} = configuratorSlice.actions;

export default configuratorSlice.reducer; 