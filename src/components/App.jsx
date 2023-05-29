import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import CountryDatasets from './Datasets.jsx';
import '../css/App.css';
import SummaryPage from './Summary.jsx';

function DataTable() {
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
        <Route path="/geonode/datasets/:countryCode" element={<DataTable />} />
        <Route path="/geonode/summary" element={<SummaryPage />} />
      </Routes>
    </Router>
  );
}

export default App;
