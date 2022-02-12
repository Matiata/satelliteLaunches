import React, { useEffect, useState } from "react";
import { Checkbox, Table, TableBody, TableCell, TableFooter,
  TableHead, TablePagination, TableRow } from '@mui/material';
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

function LaunchesTable(){
  const [rows, setRows] = useState([]);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [page, setPage] = useState(0);
  const [refresh, setRefresh] = useState(false);

  function showLaunches(rows){
    let res = []
    if(rows){
      if(rows.length > 0){
        res = rows
        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
        .map((row) =>(
          <TableRow key={row.id}>
            <TableCell> {row.name} </TableCell>
            <TableCell> {row.date_utc} </TableCell>
            <TableCell>
              {row.success ? <Checkbox checked/> : <Checkbox checked={false}/>}
            </TableCell>
          </TableRow>
        ))
      }
    }
    return res;
  }

  function handleChangePage (event, newPage){
    setPage(newPage);
  }

  function handleChangeRowsPerPage(event){
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  }

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
              Name
            </TableCell>
            <TableCell>
              Date
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
        <TableFooter>
          <TableRow>
            <TablePagination 
              rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
              component="div"
              count={rows.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              showFirstButton
              showLastButton
            />
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  );
}


export default LaunchesTable;