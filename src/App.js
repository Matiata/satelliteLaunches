import { Stack } from '@mui/material';
import { useState } from 'react';
import { TextField } from '@mui/material';
import LaunchesTable from './components/LaunchesTable';

function App() {
  const [filter, setFilter] = useState('');
  return (
    <div>
      <h2> SpaceX Launches </h2>
      <TextField 
        id='filter'
        label='Name Filter'
        onChange={(event) => setFilter(event.target.value)}
      />
      {/*<Stack direction={'row'}>
      </Stack> */}
      <LaunchesTable />
    </div>
  );
}

export default App;
