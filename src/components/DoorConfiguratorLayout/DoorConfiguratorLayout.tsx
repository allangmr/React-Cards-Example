import React from 'react';
import './DoorConfiguratorLayout.scss';
import Stepper from '../Stepper';
import StepNavigation from '../StepNavigation';
import { useDoorConfiguratorNavigation } from '../../hooks/useDoorConfiguratorNavigation';

interface DoorConfiguratorLayoutProps {
  children: React.ReactNode;
  onStepChange?: (stepIndex: number) => void;
  onComplete?: () => void;
  showStepper?: boolean;
  className?: string;
}

const DoorConfiguratorLayout: React.FC<DoorConfiguratorLayoutProps> = ({
  children,
  onStepChange,
  onComplete,
  showStepper = true,
  className = ''
}) => {
  // Get navigation props for StepNavigation
  const stepNavigationProps = useDoorConfiguratorNavigation({
    onStepChange,
    onComplete,
    previousLabel: 'Previous',
    nextLabel: 'Next'
  });

  const handleStepChange = (stepIndex: number) => {
    console.log('Step changed to:', stepIndex);
    if (onStepChange) {
      onStepChange(stepIndex);
    }
  };

  const handleComplete = () => {
    console.log('Door configuration completed!');
    alert('Door configuration completed! Ready to add to cart.');
    if (onComplete) {
      onComplete();
    }
  };

  return (
    <div className={`door-configurator-layout ${className}`}>
      {/* Header with Stepper */}
      {showStepper && (
        <div className="door-configurator-layout__header">
          <Stepper 
            showLabels={true}
            clickable={true}
            className="door-configurator-layout__stepper"
          />
        </div>
      )}

      {/* Main content area */}
      <main className="door-configurator-layout__content">
        {children}
      </main>

      {/* Footer with Step Navigation */}
      <div className="door-configurator-layout__footer">
        <StepNavigation 
          {...stepNavigationProps}
        />
      </div>
    </div>
  );
};

export default DoorConfiguratorLayout; 