import React from 'react';
import { Provider } from 'react-redux';
import { store } from './store';
import DoorConfigurator from './components/DoorConfigurator';
import './App.scss';

function App() {
  return (
    <Provider store={store}>
      <DoorConfigurator />
    </Provider>
  );
}

export default App;
