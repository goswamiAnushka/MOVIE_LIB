import React from "react";
import { DesktopDatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { FormGroup } from "@mui/material";
import dayjs from "dayjs";

const YearPicker = ({
  name,
  id,
  onChange,
  value,
  error,
  helperText,
  className,
  disabled,
  onBlur,
}) => {
  const minDate = dayjs("1700-01-01");
  const maxDate = dayjs().endOf("year");

  return (
    <FormGroup className="input-each">
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DesktopDatePicker
          views={["year"]}
          disabled={disabled}
          minDate={minDate}
          maxDate={maxDate}
          onChange={onChange}
          value={value}
          className={`${className} input-field`}
          format="YYYY" // Display only the year
          slotProps={{
            textField: {
              readOnly: true,
              helperText,
              error,
              fullWidth: true,
              name,
              id,
              onBlur,
              placeholder: "Year", // Add placeholder
            },
          }}
        />
      </LocalizationProvider>
    </FormGroup>
  );
};

export default YearPicker;
