# StepNavigation Component

Simplified step navigation component for production use.

## Features

- **Simplicity**: Only two buttons - Previous and Next
- **Colors**: Uses the interactive blue color from the design system
- **States**: Handles disabled and loading states
- **Responsive**: Works well on mobile devices
- **TypeScript**: Fully typed

## Props

```typescript
interface StepNavigationProps {
  // Navigation states
  canGoNext: boolean;
  canGoPrevious: boolean;
  
  // Main actions
  onNext: () => void;
  onPrevious: () => void;
  
  // Optional labels
  previousLabel?: string;
  nextLabel?: string;
  
  // Loading state
  loading?: boolean;
}
```

## Basic Usage

```tsx
import StepNavigation from './components/StepNavigation';

<StepNavigation
  canGoNext={true}
  canGoPrevious={false}
  onNext={() => console.log('Next clicked')}
  onPrevious={() => console.log('Previous clicked')}
  previousLabel="Previous"
  nextLabel="Next"
/>
```

## Usage with Redux

```tsx
import StepNavigation from './components/StepNavigation';
import { useStepNavigationProps } from './store/hooks/useStepNavigation';

<StepNavigation 
  {...useStepNavigationProps({
    onComplete: (data) => handleComplete(data),
    onStepChange: (step) => console.log('Step:', step),
    previousLabel: 'Back',
    nextLabel: 'Continue',
  })}
/>
```

## States

### Normal State
Both buttons enabled with interactive blue color.

### Disabled State
Buttons are shown in gray when `canGoNext` or `canGoPrevious` are `false`.

### Loading State
When `loading={true}`, both buttons show "Loading..." and are disabled.

## CSS Styles

### Main classes
- `.step-navigation` - Main container
- `.step-navigation__container` - Internal container with flex
- `.step-navigation__button` - Base class for buttons
- `.step-navigation__button--previous` - Previous button
- `.step-navigation__button--next` - Next button

### Responsive
- On mobile (< 768px), buttons take full available width
- Reduced padding on small screens

## Testing

The component includes comprehensive tests for:
- Button rendering
- Disabled states
- Loading state
- Click events
- Custom labels
- Applied CSS classes

## Storybook

Includes 7 different stories covering all use cases:
- Default: Normal state
- OnlyPrevious: Only Previous enabled
- OnlyNext: Only Next enabled
- BothDisabled: Both disabled
- Loading: Loading state
- CustomLabels: Custom labels
- SpanishLabels: Spanish labels

## Migration from previous version

If you had a more complex version of the component, these changes were made:

**Removed:**
- Step counter
- Price information
- Reset button
- Custom buttons
- Complex configurations
- Different sizes and positions

**Kept:**
- canGoNext/canGoPrevious states
- Loading state
- Customizable labels
- onNext/onPrevious functions
- Responsive design

## File structure

```
StepNavigation/
├── StepNavigation.tsx          # Main component
├── StepNavigation.scss         # Styles
├── StepNavigation.test.tsx     # Tests
├── StepNavigation.stories.tsx  # Storybook stories
├── types.ts                    # TypeScript types
├── useStepNavigation.ts        # Custom hook (legacy)
├── index.ts                    # Exports
└── README.md                   # This documentation
```

## Store dependencies

The component integrates with:
- `store/selectors/stepNavigationSelectors.ts` - Redux selectors
- `store/hooks/useStepNavigation.ts` - Hook to connect with Redux 