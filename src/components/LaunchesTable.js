import React, { useEffect, useState } from "react";
import { Checkbox, Stack, Table, TableBody, TableCell, TableFooter,
  TableHead, TablePagination, TableRow, TextField } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import RefreshIcon from '@mui/icons-material/Refresh';
import DateFilter from "./DateFilter";

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
  const [dateFilter, setDateFilter] = useState('');
  const [badDate, setBadDate] = useState(false);
  const [successFilter, setSuccessFilter] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [dataLength, setDataLength] = useState(0);
  const [page, setPage] = useState(0);
  const [refresh, setRefresh] = useState(true);

  function showLaunches(rows){
    let res = [];
    if(rows && rows.length > 0){
      res = rows;
      if(filter !== ''){
        res = res.filter(row => row.name.includes(filter));
      }
      if(successFilter){
        res = res.filter(row => row.success);
      }
      if(dateFilter.length === 10){
        let yearFilter = parseInt(dateFilter.slice(0,4), 10);
        let monthFilter = parseInt(dateFilter.slice(5,7), 10);
        let dayFilter = parseInt(dateFilter.slice(8,10), 10);
        res = res.filter(row => {
          let year = parseInt(row.date_utc.slice(0,4), 10);
          let month = parseInt(row.date_utc.slice(5,7), 10);
          let day = parseInt(row.date_utc.slice(8,10), 10);
          if(year > yearFilter) return true;
          if(year === yearFilter && month > monthFilter) return true;
          if(year === yearFilter && month === monthFilter && day >= dayFilter) return true;
        })
      }
      res = res
      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
      .map((row) =>(
        <TableRow key={row.id}>
          <TableCell> {row.name} </TableCell>
          <TableCell> {row.date_utc.slice(0,10)} </TableCell>
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
    if(successFilter){
      if(dateFilter !== '' && !badDate){
        let yearFilter = parseInt(dateFilter.slice(0,4), 10);
        let monthFilter = parseInt(dateFilter.slice(5,7), 10);
        let dayFilter = parseInt(dateFilter.slice(8,10), 10);
        rows.filter(row => {
          if(row.success && row.name.includes(filter)){
            let year = parseInt(row.date_utc.slice(0,4), 10);
            let month = parseInt(row.date_utc.slice(5,7), 10);
            let day = parseInt(row.date_utc.slice(8,10), 10);
            if(year > yearFilter) dataSize += 1;
            if(year === yearFilter && month > monthFilter) dataSize += 1;
            if(year === yearFilter && month === monthFilter && day >= dayFilter) dataSize += 1;
          }
        })
      }else{
        rows.filter(row => {
          if(row.success && row.name.includes(filter)){
            dataSize += 1;
          }
        })
      }
    }else if(dateFilter !== '' && !badDate){
      let yearFilter = parseInt(dateFilter.slice(0,4), 10);
      let monthFilter = parseInt(dateFilter.slice(5,7), 10);
      let dayFilter = parseInt(dateFilter.slice(8,10), 10);
      rows.filter(row => {
        if(row.name.includes(filter)){
          let year = parseInt(row.date_utc.slice(0,4), 10);
          let month = parseInt(row.date_utc.slice(5,7), 10);
          let day = parseInt(row.date_utc.slice(8,10), 10);
          if(year > yearFilter) dataSize += 1;
          if(year === yearFilter && month > monthFilter) dataSize += 1;
          if(year === yearFilter && month === monthFilter && day >= dayFilter) dataSize += 1;
        }
      })
    }else{
      rows.filter(row => {
        if(row.name.includes(filter)){
          dataSize += 1;
        }
      })
    }

    setDataLength(dataSize);
    setPage(0);

  },[filter, successFilter, badDate, dateFilter]);

  return(
    <div>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>
              <Stack direction={"row"} alignItems="center" spacing={1}>
                <div>
                  Name
                </div>
                <TextField
                  id='filter'
                  label='Name Filter'
                  size="small"
                  onChange={(event) => setFilter(event.target.value)}
                />
              </Stack>
            </TableCell>
            <TableCell>
              <Stack direction={"row"} alignItems="center" spacing={1}>
                <div>
                  Date
                </div>
                <DateFilter 
                  badDate={badDate}
                  setBadDate={setBadDate}
                  setDateFilter={setDateFilter}
                />
              </Stack>
            </TableCell>
            <TableCell>
              <Stack direction={"row"} alignItems="center" spacing={0}>
                <div>
                  Success
                </div>
                <Checkbox onClick={() => setSuccessFilter(!successFilter)}/>
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