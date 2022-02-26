import React from 'react';
import LaunchesTable from './components/LaunchesTable';
import './App.css'

function App() {
  return (
    <div>
      <h2 className='title'> SpaceX Satellite Launches </h2>
      <LaunchesTable />
    </div>
  );
}

export default App;
