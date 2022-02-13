import React, { useEffect, useState } from "react";
import { Checkbox, Stack, Table, TableBody, TableCell, TableFooter,
  TableHead, TablePagination, TableRow, TextField } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import RefreshIcon from '@mui/icons-material/Refresh';

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
  const [filter, setFilter] = useState('');
  const [successFilter, setSuccessFilter] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [dataLength, setDataLength] = useState(0);
  const [page, setPage] = useState(0);
  const [refresh, setRefresh] = useState(true);

  function showLaunches(rows){
    let res = [];
    if(rows && rows.length > 0){
      res = rows;
      if(!(filter === '')){
        res = rows.filter(row => row.name.includes(filter));
      }
      res = res
      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
      .map((row) =>(
        <TableRow key={row.id}>
          <TableCell> {row.name} </TableCell>
          <TableCell> {row.date_utc} </TableCell>
          <TableCell>
            {row.success ? <CheckIcon /> : <CloseIcon />}
          </TableCell>
        </TableRow>
      ))
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
    setDataLength(rows.length);

    return () => {
      isMounted = false;
    };

  },[refresh]);

   useEffect(() => {
    let dataSize = 0;
    rows.filter(row => {
      if(row.name.includes(filter)){
        dataSize += 1;
      }
    })

    setDataLength(dataSize);

  },[filter]) 

  return(
    <div>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>
              <Stack direction={"row"} alignItems="center" spacing={2}>
                <div>
                  Name
                </div>
                <TextField
                  id='filter'
                  label='Name Filter'
                  onChange={(event) => setFilter(event.target.value)}
                />
              </Stack>
            </TableCell>
            <TableCell>
              Date
            </TableCell>
            <TableCell>
              <Stack direction={"row"} alignItems="center" spacing={0}>
                <div>
                  Success
                </div>
                <Checkbox onClick={() => setSuccessFilter(true)}/>
              </Stack>
            </TableCell>
            <TableCell>
              <IconButton onClick={() => setRefresh(true)}>
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
              count={dataLength}
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