import React from 'react';
import { Label as BLabel } from 'reactstrap';

const Label = ({ id, children }) => (
  <BLabel htmlFor={id} className="form-label">
    {children}
  </BLabel>
);

export default Label;
