import React from 'react';
import StepMenu from '../StepMenu';
import StepNavigation from '../StepNavigation';
import './Layout.scss';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="layout">
      <StepMenu 
        steps={[]} 
        currentStep={1} 
        onStepClick={() => {}} 
      />
      
      <main className="layout__main">
        <div className="layout__content">
          {children}
        </div>
      </main>
      
      <StepNavigation
        currentStep={1}
        totalSteps={5}
        canGoNext={false}
        canGoPrevious={false}

        onNext={() => {}}
        onPrevious={() => {}}
        onReset={() => {}}
        onFinish={() => {}}
      />
    </div>
  );
};

export default Layout; 