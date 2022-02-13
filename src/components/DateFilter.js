import React, { useEffect, useState } from "react";
import PropTypes from 'prop-types';
import { TextField } from "@mui/material";


function DateFilter(props){
  const { badDate, setBadDate, setDateFilter } = props;
  const [pickedDate, setPickedDate] = useState('');

  const isDate = (date) => /^\d{4}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$/.test(date)

  useEffect(() => {
    if(isDate(pickedDate) || pickedDate === ''){
      setBadDate(false);
      setDateFilter(pickedDate);
    }else{
      setBadDate(true);
    }
  },[pickedDate])

  return(
    <TextField
      id="dateFilter"
      label="YYYY-MM-DD"
      size="small"
      error={badDate}
      onChange={(event) => setPickedDate(event.target.value)}
    />

  );
}

DateFilter.propTypes ={
  badDate : PropTypes.bool,
  setBadDate : PropTypes.func,
  setDateFilter : PropTypes.func
}

export default DateFilter;