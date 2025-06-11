import { useState } from 'react';
import { Provider } from 'react-redux';
import { store } from './store';
import DoorConfigurator from './components/DoorConfigurator';
import OptionCardDemo from './components/OptionCardDemo';
import './App.scss';

function App() {
  const [currentView, setCurrentView] = useState<'configurator' | 'demo'>('configurator');

  return (
    <Provider store={store}>
      <div style={{ 
        position: 'fixed', 
        top: '1rem', 
        right: '1rem', 
        zIndex: 1000,
        display: 'flex',
        gap: '0.5rem'
      }}>
        <button 
          onClick={() => setCurrentView('configurator')}
          style={{
            background: currentView === 'configurator' ? '#3b82f6' : '#e5e7eb',
            color: currentView === 'configurator' ? 'white' : '#374151',
            border: 'none',
            padding: '0.5rem 1rem',
            borderRadius: '6px',
            fontSize: '0.875rem',
            fontWeight: '500',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
        >
          Main App
        </button>
        <button 
          onClick={() => setCurrentView('demo')}
          style={{
            background: currentView === 'demo' ? '#3b82f6' : '#e5e7eb',
            color: currentView === 'demo' ? 'white' : '#374151',
            border: 'none',
            padding: '0.5rem 1rem',
            borderRadius: '6px',
            fontSize: '0.875rem',
            fontWeight: '500',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
        >
          OptionCard Demo
        </button>
      </div>

      {currentView === 'configurator' ? (
        <DoorConfigurator />
      ) : (
        <OptionCardDemo />
      )}
    </Provider>
  );
}

export default App;
