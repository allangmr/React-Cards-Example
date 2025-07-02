import type { Meta, StoryObj } from '@storybook/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import Stepper from './Stepper';
import doorConfiguratorSlice from '../../store/slices/doorConfiguratorSlice';
import type { DoorConfiguratorState, StepData } from '../../types/store';

// Mock store for Storybook
const createMockStore = (partialState: Partial<DoorConfiguratorState> = {}) => {
  const defaultInitialState: DoorConfiguratorState = {
    currentStepIndex: 0,
    totalPrice: 0,
    isLoading: false,
    steps: [
      {
        id: "type",
        name: "Type",
        icon: "icon",
        active: false,
        completed: false,
        selectedOptions: [],
        availableOptions: []
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

  const state: DoorConfiguratorState = {
    ...defaultInitialState,
    ...partialState,
  };

  // Ensure active/completed states are consistent
  state.steps.forEach((step: StepData, index: number) => {
    step.active = index === state.currentStepIndex;
    // Keep original completed value if provided, otherwise derive it
    if (partialState.steps?.[index]?.completed === undefined) {
      step.completed = index < state.currentStepIndex;
    }
  });

  return configureStore({
    reducer: {
      doorConfigurator: doorConfiguratorSlice,
    },
    preloadedState: {
      doorConfigurator: state,
    },
  });
};

const meta: Meta<typeof Stepper> = {
  title: 'Components/Stepper',
  component: Stepper,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Visual stepper component that shows the progress through a series of steps. It includes navigation buttons to move between steps.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    showLabels: {
      control: 'boolean',
      description: 'Whether to show step labels',
    },
    clickable: {
      control: 'boolean',
      description: 'Whether steps are clickable for navigation',
    },
    className: {
      control: 'text',
      description: 'Additional CSS class names',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// First step active
export const FirstStep: Story = {
  args: {
    showLabels: true,
    clickable: true,
  },
  decorators: [
    (Story) => {
      const store = createMockStore({ currentStepIndex: 0 });
      return (
        <Provider store={store}>
          <div style={{ padding: '2rem', backgroundColor: '#f5f5f5', minHeight: '400px' }}>
            <Story />
          </div>
        </Provider>
      );
    },
  ],
};

// Second step active
export const SecondStep: Story = {
  args: {
    showLabels: true,
    clickable: true,
  },
  decorators: [
    (Story) => {
      const store = createMockStore({ currentStepIndex: 1 });
      return (
        <Provider store={store}>
          <div style={{ padding: '2rem', backgroundColor: '#f5f5f5', minHeight: '400px' }}>
            <Story />
          </div>
        </Provider>
      );
    },
  ],
};

// Third step active
export const ThirdStep: Story = {
  args: {
    showLabels: true,
    clickable: true,
  },
  decorators: [
    (Story) => {
      const store = createMockStore({ currentStepIndex: 2 });
      return (
        <Provider store={store}>
          <div style={{ padding: '2rem', backgroundColor: '#f5f5f5', minHeight: '400px' }}>
            <Story />
          </div>
        </Provider>
      );
    },
  ],
};

// Last step active
export const LastStep: Story = {
  args: {
    showLabels: true,
    clickable: true,
  },
  decorators: [
    (Story) => {
      const store = createMockStore({ currentStepIndex: 3 });
      return (
        <Provider store={store}>
          <div style={{ padding: '2rem', backgroundColor: '#f5f5f5', minHeight: '400px' }}>
            <Story />
          </div>
        </Provider>
      );
    },
  ],
};

// Without labels
export const WithoutLabels: Story = {
  args: {
    showLabels: false,
    clickable: true,
  },
  decorators: [
    (Story) => {
      const store = createMockStore({ currentStepIndex: 1 });
      return (
        <Provider store={store}>
          <div style={{ padding: '2rem', backgroundColor: '#f5f5f5', minHeight: '400px' }}>
            <Story />
          </div>
        </Provider>
      );
    },
  ],
};

// Non-clickable
export const NonClickable: Story = {
  args: {
    showLabels: true,
    clickable: false,
  },
  decorators: [
    (Story) => {
      const store = createMockStore({ currentStepIndex: 1 });
      return (
        <Provider store={store}>
          <div style={{ padding: '2rem', backgroundColor: '#f5f5f5', minHeight: '400px' }}>
            <Story />
          </div>
        </Provider>
      );
    },
  ],
};

export const NextButtonEnabled: Story = {
  name: 'Next Button Enabled',
  args: {
    showLabels: true,
    clickable: true,
  },
  decorators: [
    (Story) => {
      const store = createMockStore({ 
        currentStepIndex: 1,
        steps: [
          { id: "type", name: "Type", completed: true, active: false, icon: '', selectedOptions: [], availableOptions: [] },
          { id: "material", name: "Material", completed: true, active: true, icon: '', selectedOptions: [], availableOptions: [] },
          { id: "finish", name: "Finish", completed: false, active: false, icon: '', selectedOptions: [], availableOptions: [] },
          { id: "hardware", name: "Hardware", completed: false, active: false, icon: '', selectedOptions: [], availableOptions: [] },
        ]
      });
      return (
        <Provider store={store}>
          <div style={{ padding: '2rem', backgroundColor: '#f5f5f5', minHeight: '400px' }}>
            <Story />
          </div>
        </Provider>
      );
    },
  ],
}; 