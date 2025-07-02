import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { DoorConfiguratorState, StepData, AvailableItem } from '../../types/store';

// Initial state with sample data based on user's structure
const initialState: DoorConfiguratorState = {
  currentStepIndex: 0,
  totalPrice: 0,
  isLoading: false,
  steps: [
    {
      id: "type",
      name: "Type",
      icon: "icon",
      active: true,
      completed: false,
      selectedOptions: [],
      availableOptions: [
        {
          id: "packageType",
          title: "Select product type:",
          subTitle: "",
          type: "VisualPicker",
          availableItems: [
            {
              id: "packageType",
              label: "Door Only",
              value: "Door Only",
              imageUrl: "item image",
              visualizerImageUrl: "handle extended visualizer image",
              zIndex: "",
              isMostPopular: true,
              isVisible: true,
              isSelected: false,
              description: "Mocked description",
              tag: {
                label: "Most popular"
              }
            },
            {
              id: "packageType",
              label: "Frame Only",
              value: "Frame Only",
              imageUrl: "https://www.cdfdistributors.com/probuilder/media/__sized__/builder_choices/single_frame1-thumbnail-700x700.png",
              visualizerImageUrl: "handle extended visualizer image",
              zIndex: "",
              isMostPopular: false,
              isVisible: true,
              isSelected: false,
              description: "Mocked description",
              tag: {
                label: ""
              }
            },
            {
              id: "packageType",
              label: "Both",
              value: "Both",
              imageUrl: "https://www.cdfdistributors.com/probuilder/media/__sized__/builder_choices/product_choice_doors-thumbnail-350x350.png",
              visualizerImageUrl: "handle extended visualizer image",
              zIndex: "",
              isMostPopular: false,
              isVisible: true,
              isSelected: false,
              description: "Mocked description",
              tag: {
                label: ""
              }
            }
          ],
          selectedItems: []
        },
        {
          id: "doorStyle",
          title: "Single or double door?",
          subTitle: "",
          type: "VisualPicker",
          availableItems: [
            {
              id: "doorStyle",
              label: "Single",
              value: "Single",
              imageUrl: "https://www.cdfdistributors.com/probuilder/media/__sized__/configurations/config_single_wood-thumbnail-312x342.png",
              visualizerImageUrl: "handle extended visualizer image",
              zIndex: "",
              isMostPopular: true,
              isVisible: true,
              isSelected: false,
              description: "Mocked description",
              tag: {
                label: "Most popular"
              }
            },
            {
              id: "doorStyle",
              label: "Double",
              value: "Double",
              imageUrl: "https://www.cdfdistributors.com/probuilder/media/__sized__/configurations/config_double_wood-thumbnail-312x342.png",
              visualizerImageUrl: "handle extended visualizer image",
              zIndex: "",
              isMostPopular: false,
              isVisible: true,
              isSelected: false,
              description: "Mocked description",
              tag: {
                label: ""
              }
            }
          ],
          selectedItems: []
        }
      ]
    },
    {
      id: "material",
      name: "Material",
      icon: "material-icon",
      active: false,
      completed: false,
      selectedOptions: [],
      availableOptions: []
    },
    {
      id: "finish",
      name: "Finish",
      icon: "finish-icon",
      active: false,
      completed: false,
      selectedOptions: [],
      availableOptions: []
    },
    {
      id: "hardware",
      name: "Hardware",
      icon: "hardware-icon",
      active: false,
      completed: false,
      selectedOptions: [],
      availableOptions: []
    }
  ]
};

const doorConfiguratorSlice = createSlice({
  name: 'doorConfigurator',
  initialState,
  reducers: {
    // Navigate to next step
    nextStep: (state) => {
      const currentStep = state.steps[state.currentStepIndex];
      
      if (state.currentStepIndex < state.steps.length - 1) {
        // Mark current step as completed and inactive
        currentStep.active = false;
        currentStep.completed = true;
        
        // Move to next step
        state.currentStepIndex += 1;
        
        // Activate next step
        state.steps[state.currentStepIndex].active = true;
      }
    },

    // Navigate to previous step
    previousStep: (state) => {
      if (state.currentStepIndex > 0) {
        // Mark current step as inactive
        state.steps[state.currentStepIndex].active = false;
        
        // Move to previous step
        state.currentStepIndex -= 1;
        
        // Activate previous step and mark as not completed
        const previousStep = state.steps[state.currentStepIndex];
        previousStep.active = true;
        previousStep.completed = false;
      }
    },

    // Go to specific step
    goToStep: (state, action: PayloadAction<number>) => {
      const targetIndex = action.payload;
      
      if (targetIndex >= 0 && targetIndex < state.steps.length) {
        // Deactivate current step
        state.steps[state.currentStepIndex].active = false;
        
        // Update current step index
        state.currentStepIndex = targetIndex;
        
        // Activate target step
        state.steps[targetIndex].active = true;
        
        // Update completion status for all steps
        state.steps.forEach((step, index) => {
          if (index < targetIndex) {
            step.completed = true;
            step.active = false;
          } else if (index === targetIndex) {
            step.active = true;
            step.completed = false;
          } else {
            step.completed = false;
            step.active = false;
          }
        });
      }
    },

    // Select an item in current step
    selectItem: (state, action: PayloadAction<{ optionId: string; item: AvailableItem }>) => {
      const { optionId, item } = action.payload;
      const currentStep = state.steps[state.currentStepIndex];
      const option = currentStep.availableOptions.find(opt => opt.id === optionId);
      
      if (option) {
        // Remove item from selectedItems if already selected
        const existingIndex = option.selectedItems.findIndex(selected => selected.id === item.id);
        
        if (existingIndex !== -1) {
          option.selectedItems.splice(existingIndex, 1);
          // Update item selection status
          const availableItem = option.availableItems.find(available => available.id === item.id);
          if (availableItem) {
            availableItem.isSelected = false;
          }
        } else {
          // Add item to selectedItems
          option.selectedItems.push({ ...item, isSelected: true });
          // Update item selection status
          const availableItem = option.availableItems.find(available => available.id === item.id);
          if (availableItem) {
            availableItem.isSelected = true;
          }
        }
      }
    },

    // Reset configurator
    resetConfigurator: (state) => {
      state.currentStepIndex = 0;
      state.totalPrice = 0;
      state.steps.forEach((step, index) => {
        step.active = index === 0;
        step.completed = false;
        step.selectedOptions = [];
        step.availableOptions.forEach(option => {
          option.selectedItems = [];
          option.availableItems.forEach(item => {
            item.isSelected = false;
          });
        });
      });
    },

    // Update total price
    updateTotalPrice: (state, action: PayloadAction<number>) => {
      state.totalPrice = action.payload;
    },

    // Set loading state
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    }
  }
});

export const {
  nextStep,
  previousStep,
  goToStep,
  selectItem,
  resetConfigurator,
  updateTotalPrice,
  setLoading
} = doorConfiguratorSlice.actions;

export default doorConfiguratorSlice.reducer; 