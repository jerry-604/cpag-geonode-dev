import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import CountryDatasets from './page';
import './App.css';

function MainApp() {
  const location = useLocation();
  const countryCode = location.pathname.split('/')[3];

  return (
    <div className="App">
        <CountryDatasets countryCode={countryCode} />
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/geonode/datasets/:countryCode" element={<MainApp />} />
      </Routes>
    </Router>
  );
}

export default App;
