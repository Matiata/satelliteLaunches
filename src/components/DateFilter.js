import { TextField } from "@mui/material";
import React, { useEffect, useState } from "react";


function DateFilter(props){
  const { badDate, setBadDate, setDateFilter } = props;
  const [pickedDate, setPickedDate] = useState('');

  const isDate = (date) => /^\d{4}\-(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01])$/.test(date)

  useEffect(() => {
    if(pickedDate === ''){
      setBadDate(false);
    }else if(isDate(pickedDate)){
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
      error={badDate}
      onChange={(event) => setPickedDate(event.target.value)}
    />

  );
}


export default DateFilter;