import React from "react";

import { StyledInputIcon } from "./InputIcon.styles";

const InputIcon = ({ prefix, invalid, suffix, children, disabled, ...props }) => (
  <StyledInputIcon $prefix={prefix} $invalid={invalid} $suffix={suffix} disabled={disabled} {...props}>
    {children}
  </StyledInputIcon>
);

export default InputIcon;
