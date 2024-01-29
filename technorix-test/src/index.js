import React, { useContext, useState } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Details from './Details';
import UserContext from './Context';

function Component5() {
  const [state, dispatch] = useState(null);

  return (
    <UserContext.Provider value={{ state, dispatch }}>
    <React.StrictMode>
    <BrowserRouter>
    
    <Routes>
      <Route path="/" element={<App />} />
        <Route path="/Details" element={<Details />} />
    </Routes>
    </BrowserRouter>
  </React.StrictMode>
  </UserContext.Provider>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Component5 />
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
