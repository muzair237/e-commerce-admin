import styled from 'styled-components';
import { Field } from 'formik';

export const StyledInput = styled(Field)`
  border-color: ${({ $isInvalid }) => ($isInvalid ? 'red' : '')};
  transition: border-color 0.5s ease;
`;

export const Error = styled.span`
  font-size: 12.5px;
  color: red;
  margin-top: 1px;
`;
