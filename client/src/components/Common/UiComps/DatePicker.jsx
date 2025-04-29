import React from "react";
import { DesktopDatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { FormGroup, InputLabel } from "@mui/material";

const Datepicker = (props) => {
  const {
    name,
    id,
    onChange,
    value,
    error,
    helperText,
    label,
    required,
    className,
    minDate,
    maxDate,
    disabled,
    onBlur,
  } = props;

  return (
    <FormGroup className="input-each">
      <InputLabel required={required} className="input-label">
        {label}
      </InputLabel>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DesktopDatePicker
          disabled={disabled}
          minDate={minDate}
          maxDate={maxDate}
          onChange={onChange}
          value={value}
          className={`${className} input-field`}
          format="MM / DD / YYYY"
          slotProps={{
            textField: {
              readOnly: true,
              helperText,
              error,
              fullWidth: true,
              name,
              id,
              onBlur,
            },
          }}
        />
      </LocalizationProvider>
    </FormGroup>
  );
};

export default Datepicker;
