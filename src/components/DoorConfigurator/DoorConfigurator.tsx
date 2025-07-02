import React from 'react';
import './DoorConfigurator.scss';
import DoorConfiguratorLayout from '../DoorConfiguratorLayout/DoorConfiguratorLayout';
import { useSelector } from 'react-redux';
import { selectCurrentStep } from '../../store/selectors/doorConfiguratorSelectors';

const DoorConfigurator: React.FC = () => {
  const currentStep = useSelector(selectCurrentStep);

  const handleStepChange = (stepIndex: number) => {
    console.log('Step changed to:', stepIndex);
    // Additional logic for step changes can be added here
  };

  const handleComplete = () => {
    console.log('Door configuration completed!');
    alert('Door configuration completed! Your custom door is ready to add to cart.');
  };

  const renderStepContent = () => {
    if (!currentStep) {
      return <div>Loading...</div>;
    }

    switch (currentStep.id) {
      case 'type':
        return (
          <div className="door-configurator__step-content">
            <h2>Select Door Type</h2>
            <p>Choose the type of door you want to configure.</p>
            
            {currentStep.availableOptions.map((option) => (
              <div key={option.id} className="door-configurator__option-group">
                <h3>{option.title}</h3>
                {option.subTitle && <p>{option.subTitle}</p>}
                
                <div className="door-configurator__items">
                  {option.availableItems.map((item) => (
                    <div 
                      key={item.id}
                      className={`door-configurator__item ${item.isSelected ? 'selected' : ''}`}
                    >
                      <img src={item.imageUrl} alt={item.label} />
                      <h4>{item.label}</h4>
                      <p>{item.description}</p>
                      {item.isMostPopular && (
                        <span className="door-configurator__popular-tag">
                          {item.tag.label}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        );

      case 'material':
        return (
          <div className="door-configurator__step-content">
            <h2>Select Material</h2>
            <p>Choose the material for your door.</p>
            <div className="door-configurator__placeholder">
              Material selection options will be displayed here.
            </div>
          </div>
        );

      case 'finish':
        return (
          <div className="door-configurator__step-content">
            <h2>Select Finish</h2>
            <p>Choose the finish for your door.</p>
            <div className="door-configurator__placeholder">
              Finish selection options will be displayed here.
            </div>
          </div>
        );

      case 'hardware':
        return (
          <div className="door-configurator__step-content">
            <h2>Select Hardware</h2>
            <p>Choose the hardware for your door.</p>
            <div className="door-configurator__placeholder">
              Hardware selection options will be displayed here.
            </div>
          </div>
        );

      default:
        return (
          <div className="door-configurator__step-content">
            <h2>Unknown Step</h2>
            <p>This step is not configured yet.</p>
          </div>
        );
    }
  };

  return (
    <div className="door-configurator">
      <DoorConfiguratorLayout
        onStepChange={handleStepChange}
        onComplete={handleComplete}
        showStepper={true}
      >
        {renderStepContent()}
      </DoorConfiguratorLayout>
    </div>
  );
};

export default DoorConfigurator; 