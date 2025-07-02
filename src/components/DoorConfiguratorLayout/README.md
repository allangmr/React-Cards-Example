# Door Configurator System

Complete door configurator system with integrated Stepper and StepNavigation components for building custom doors step by step.

## System Overview

The door configurator consists of several integrated components:

- **Stepper**: Visual step indicator showing progress
- **StepNavigation**: Navigation buttons (Previous/Next) 
- **DoorConfiguratorLayout**: Layout wrapper that combines both
- **DoorConfigurator**: Main configurator component with step content
- **Redux Store**: State management for steps and selections

## Architecture

```
DoorConfiguratorLayout
├── Stepper (header)
├── Step Content (main)
└── StepNavigation (footer - fixed)
```

## Key Features

### 🎯 **Smart Navigation Logic**
- **First Step Rule**: When `activeStep` is true and it's step 1 (index 0), Previous button is disabled
- **Step Validation**: Navigation only allowed when step requirements are met
- **Auto-completion**: Steps mark as completed when navigating forward
- **Clickable Steps**: Users can click on previous/completed steps to navigate

### 🏗️ **Redux Store Structure**

Based on your production structure:

```typescript
interface StepData {
  id: string;                    // "type", "material", etc.
  name: string;                  // "Type", "Material", etc.
  icon: string;                  // Icon identifier
  active: boolean;               // Currently active step
  completed: boolean;            // Step is completed
  selectedOptions: any[];        // User selections
  availableOptions: AvailableOption[];  // Available choices
}

interface DoorConfiguratorState {
  steps: StepData[];
  currentStepIndex: number;
  totalPrice: number;
  isLoading: boolean;
}
```

### 🎨 **Visual States**

**Stepper Component:**
- **Active Step**: Blue circle with step number, blue label
- **Completed Step**: Green circle with checkmark, green label  
- **Pending Step**: Gray circle with step number, gray label
- **Connectors**: Progress lines between steps that fill as steps complete

**StepNavigation:**
- **Both buttons**: Interactive blue color (`$primary-color`)
- **Disabled state**: Gray color when navigation not allowed
- **Loading state**: Shows "Loading..." text

## Usage

### Basic Implementation

```tsx
import DoorConfiguratorLayout from './components/DoorConfiguratorLayout';

function App() {
  const handleStepChange = (stepIndex: number) => {
    console.log('Moved to step:', stepIndex);
  };

  const handleComplete = () => {
    console.log('Configuration completed!');
    // Process order, navigate to cart, etc.
  };

  return (
    <DoorConfiguratorLayout
      onStepChange={handleStepChange}
      onComplete={handleComplete}
      showStepper={true}
    >
      {/* Your step content here */}
      <YourStepContent />
    </DoorConfiguratorLayout>
  );
}
```

### Advanced Usage with Custom Logic

```tsx
import { useDoorConfiguratorNavigation } from './hooks/useDoorConfiguratorNavigation';
import Stepper from './components/Stepper';
import StepNavigation from './components/StepNavigation';

function CustomConfigurator() {
  // Get navigation props
  const navigationProps = useDoorConfiguratorNavigation({
    onStepChange: (stepIndex) => {
      // Custom step change logic
      analytics.track('step_changed', { step: stepIndex });
    },
    onComplete: () => {
      // Custom completion logic
      router.push('/checkout');
    },
    previousLabel: 'Go Back',
    nextLabel: 'Continue'
  });

  return (
    <div className="custom-layout">
      <Stepper showLabels={true} clickable={true} />
      
      <main>
        {/* Your content */}
      </main>
      
      <StepNavigation {...navigationProps} />
    </div>
  );
}
```

## Redux Actions

### Navigation Actions

```typescript
import { useDispatch } from 'react-redux';
import { nextStep, previousStep, goToStep } from './store/slices/doorConfiguratorSlice';

const dispatch = useDispatch();

// Move to next step
dispatch(nextStep());

// Move to previous step  
dispatch(previousStep());

// Jump to specific step
dispatch(goToStep(2)); // Go to step index 2
```

### Selection Actions

```typescript
import { selectItem } from './store/slices/doorConfiguratorSlice';

// Select an item in current step
dispatch(selectItem({
  optionId: 'packageType',
  item: {
    id: 'door-only',
    label: 'Door Only',
    value: 'Door Only',
    // ... other item properties
  }
}));
```

### Utility Actions

```typescript
import { resetConfigurator, updateTotalPrice } from './store/slices/doorConfiguratorSlice';

// Reset entire configuration
dispatch(resetConfigurator());

// Update total price
dispatch(updateTotalPrice(2500));
```

## Component Props

### DoorConfiguratorLayout

```typescript
interface DoorConfiguratorLayoutProps {
  children: React.ReactNode;     // Step content
  onStepChange?: (stepIndex: number) => void;
  onComplete?: () => void;
  showStepper?: boolean;         // Default: true
  className?: string;
}
```

### Stepper

```typescript
interface StepperProps {
  className?: string;
  showLabels?: boolean;          // Default: true
  clickable?: boolean;           // Default: true
}
```

### StepNavigation

```typescript
interface StepNavigationProps {
  canGoNext: boolean;
  canGoPrevious: boolean;
  onNext: () => void;
  onPrevious: () => void;
  previousLabel?: string;        // Default: 'Previous'
  nextLabel?: string;           // Default: 'Next'
  loading?: boolean;            // Default: false
}
```

## Sample Step Content

```typescript
const renderStepContent = () => {
  switch (currentStep.id) {
    case 'type':
      return (
        <div>
          <h2>Select Door Type</h2>
          {currentStep.availableOptions.map(option => (
            <div key={option.id}>
              <h3>{option.title}</h3>
              {option.availableItems.map(item => (
                <div 
                  key={item.id}
                  className={`item ${item.isSelected ? 'selected' : ''}`}
                  onClick={() => handleItemSelect(option.id, item)}
                >
                  <img src={item.imageUrl} alt={item.label} />
                  <h4>{item.label}</h4>
                  <p>{item.description}</p>
                </div>
              ))}
            </div>
          ))}
        </div>
      );
    // ... other cases
  }
};
```

## Styling

### CSS Classes

**Stepper:**
- `.stepper` - Main container
- `.stepper__step--active` - Active step
- `.stepper__step--completed` - Completed step  
- `.stepper__step--clickable` - Clickable step

**Layout:**
- `.door-configurator-layout` - Main layout
- `.door-configurator-layout__header` - Stepper area
- `.door-configurator-layout__content` - Content area
- `.door-configurator-layout__footer` - Navigation area

### Customization

```scss
// Override stepper colors
.stepper {
  &__step--active .stepper__step-indicator {
    background-color: your-brand-color;
  }
}

// Override navigation button colors
.step-navigation__button--previous,
.step-navigation__button--next {
  background-color: your-interactive-color;
}
```

## Production Integration

### Store Setup

```typescript
import { configureStore } from '@reduxjs/toolkit';
import doorConfiguratorSlice from './slices/doorConfiguratorSlice';

export const store = configureStore({
  reducer: {
    doorConfigurator: doorConfiguratorSlice,
    // ... your other reducers
  },
});
```

### Provider Setup

```tsx
import { Provider } from 'react-redux';
import { store } from './store';
import DoorConfigurator from './components/DoorConfigurator';

function App() {
  return (
    <Provider store={store}>
      <DoorConfigurator />
    </Provider>
  );
}
```

## Testing

The system includes comprehensive tests for all components:

- **Unit tests** for Redux actions and selectors
- **Component tests** for user interactions
- **Integration tests** for step navigation flow
- **E2E tests** for complete user journeys

## Key Benefits

✅ **Production Ready**: Based on your actual production store structure  
✅ **Fully Typed**: Complete TypeScript support  
✅ **Responsive**: Works on all device sizes  
✅ **Accessible**: Keyboard navigation and screen reader support  
✅ **Customizable**: Easy to theme and modify  
✅ **Performant**: Optimized Redux selectors and memoization  
✅ **Tested**: Comprehensive test coverage  

## Migration Notes

This system is designed to integrate seamlessly with your existing production setup by:
- Using your exact store structure
- Following your naming conventions
- Implementing your business logic requirements
- Supporting your visual design system

The key requirement you specified (Previous button disabled when activeStep is true and step 1) is implemented in the `selectCanGoPrevious` selector. 