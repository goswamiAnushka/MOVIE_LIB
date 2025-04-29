import React from "react";
import { Button } from "@mui/material";

const ButtonField = (props) => {
  const {
    img,
    label,
    alt,
    imgHeight,
    imgWidth,
    mainCls,
    type,
    onClick,
    fullWidth,
    customJsx,
  } = props;

  // Ensure that the props for image are not undefined or null
  const imageJsx = img ? (
    <img
      src={img}
      alt={alt || "button image"}
      width={imgWidth || 24}  // Set default width if not provided
      height={imgHeight || 24} // Set default height if not provided
    />
  ) : null;

  return (
    <Button
      fullWidth={fullWidth || false} // Ensure fullWidth is boolean
      className={mainCls || ""} // Ensure class is applied correctly
      type={type || "button"} // Default to 'button' if type is not passed
      onClick={onClick || (() => {})} // Default to empty function if onClick is undefined
    >
      {imageJsx}
      {customJsx || <span>{label}</span>} {/* If custom JSX is passed, use it */}
    </Button>
  );
};

export default ButtonField;
