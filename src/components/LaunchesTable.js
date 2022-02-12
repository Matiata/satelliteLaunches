import React, { useEffect, useState } from "react";
import { Checkbox, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import RefreshIcon from '@mui/icons-material/Refresh'

async function fetchData(){
  const endpoint = 'https://api.spacexdata.com/v5/launches/';
  const requestOptions = {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  };

  const data = fetch(endpoint, requestOptions)
    .then(async (response) => {
      const isJson = response.headers.get('content-type')?.includes('application/json');
      const payload = isJson && await response.json();
      if (!response.ok) {
        return Promise.reject(response.status);
      }
      return payload;
    })
    .catch((error) => Promise.reject(error));
    return data;
}

function showLaunches(rows){
  let res = []
  if(rows){
    if(rows.length > 0){
      res = rows.map((row) =>(
        <TableRow key={row.id}>
          <TableCell> {row.id} </TableCell>
          <TableCell> {row.name} </TableCell>
          <TableCell>
            {row.success ? <Checkbox checked/> : <Checkbox checked={false}/>}
          </TableCell>
        </TableRow>
      ))
    }
  }
  return res;
}

function LaunchesTable(){
  const [rows, setRows] = useState([]);
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    let isMounted = true;
    async function updateLaunches(){
      if (isMounted && refresh){
        fetchData()
        .then(async (response) => {
          if (isMounted){
            setRows(response)
            setRefresh(false);
          }
        })
        .catch((error) => {
          console.error('Oops something went wrong..', error);
          isMounted = false;
          setRefresh(false);
        })
      }
    }

    updateLaunches();

    return () => {
      isMounted = false;
    };

  },[refresh]);

  return(
    <div>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>
              ID
            </TableCell>
            <TableCell>
              Name
            </TableCell>
            <TableCell>
              Success
            </TableCell>
            <TableCell>
              <IconButton onClick={() => {setRefresh(true)}}>
                <RefreshIcon />
              </IconButton>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {showLaunches(rows)}
        </TableBody>
      </Table>
    </div>
  );
}


export default LaunchesTable;