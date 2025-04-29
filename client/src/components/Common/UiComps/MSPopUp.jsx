import React from "react";
import { Box, Dialog, DialogContent } from "@mui/material";
import ButtonField from "./ButtonField";

const MSPopUp = ({
  open,
  handleClose,
  imgSrc,
  description,
  title,
  btnTitle,
  btnClick,
}) => {
  return (
    <Dialog open={open} onClose={handleClose} className="custom-popup">
      <DialogContent>
        <Box className="popup-icon">
          <img width={34} height={34} src={imgSrc} alt="" />
        </Box>
        <h3>{title}</h3>
        <p>{description}</p>
        <ButtonField mainCls="p-btn" label={btnTitle} onClick={btnClick} />
      </DialogContent>
    </Dialog>
  );
};

export default MSPopUp;
