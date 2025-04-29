import React from "react";
import {
  FormGroup,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

const DropDownField = (props) => {
  const {
    options,
    title,
    mainCls,
    id,
    name,
    onChange,
    error,
    onBlur,
    value,
    clsDrop,
    placeholder,
  } = props;

  return (
    <FormGroup className="input-each">
      {title && (
        <InputLabel
          id="demo-simple-select-label"
          className={`${mainCls} input-label`}
        >
          {title}
        </InputLabel>
      )}
      <Select
        className={`${clsDrop}`}
        id={id}
        name={name}
        onChange={onChange}
        error={error}
        onBlur={onBlur}
        value={value || ""}
        IconComponent={KeyboardArrowDownIcon}
        displayEmpty
      >
        <MenuItem value="" className="select-placeholder">
          {placeholder}
        </MenuItem>
        {options.map((item, index) => (
          <MenuItem key={index} value={item.value}>
            {item.title}
          </MenuItem>
        ))}
      </Select>
    </FormGroup>
  );
};

export default DropDownField;
