import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import RegionSelector from './RegionSelector';
import CountryDatasets from './Datasets.jsx';
import '../css/App.css';
import SummaryPage from './Summary.jsx';

// Component for rendering the DataTable
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
      <div className='Container'>
        <Routes>
          {/* Route for displaying DataTable based on selected countryCode */}
          <Route
            path="/geonode/datasets/:countryCode"
            element={
              <>
                <RegionSelector /> {/* Render RegionSelector component */}
                <DataTable /> {/* Render DataTable component */}
              </>
            }
          />
          <Route path="/geonode/datasets" element={<RegionSelector />} /> {/* Route for displaying RegionSelector only */}
          <Route path="/geonode/summary" element={<SummaryPage />} /> {/* Route for displaying SummaryPage */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
