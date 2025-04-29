import React, { useState } from "react";
import {
  FormGroup,
  IconButton,
  InputAdornment,
  InputLabel,
  TextField,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

const TextFieldInput = ({
  mainClassname,
  labelClass,
  lable,
  id,
  placeholder,
  onChange,
  onBlur,
  onClick,
  error,
  helperText,
  required,
  multiline,
  rows,
  variant,
  disabled,
  autoFocus,
  autoComplete,
  name,
  type,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <FormGroup className={`${mainClassname} input-each`}>
      <InputLabel required className={`${labelClass} input-label`}>
        {lable}
      </InputLabel>
      <TextField
        type={type === "password" ? (showPassword ? "text" : "password") : type}
        className="input-field"
        id={id}
        placeholder={placeholder}
        onChange={onChange}
        onBlur={onBlur}
        onClick={onClick}
        error={error}
        helperText={helperText}
        required={required}
        multiline={multiline}
        rows={rows}
        variant={variant || "outlined"}
        disabled={disabled}
        autoFocus={autoFocus}
        autoComplete={autoComplete}
        name={name}
        slotProps={{
          input: {
            endAdornment:
              type === "password" ? (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={() => {
                      setShowPassword(!showPassword);
                    }}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ) : null,
          },
        }}
      />
    </FormGroup>
  );
};

export default TextFieldInput;
