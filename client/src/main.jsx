import React from 'react';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';
import contractorstore from './redux/store';
import { Provider } from 'react-redux';
createRoot(document.getElementById('root')).render(
  <StrictMode>
     <Provider store={contractorstore}> 
      <App />
    </Provider>
   
  </StrictMode>,
);



