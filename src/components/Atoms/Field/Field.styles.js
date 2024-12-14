import styled from 'styled-components';
import { Input } from 'reactstrap';

// Wrapper to position prefix/suffix inside the input
export const InputWrapper = styled.div`
  display: flex;
  align-items: center;
  position: relative;

  .form-control {
    flex: 1;
  }
`;

export const StyledInput = styled(Input)`
  position: relative;
  border-color: ${({ $isInvalid }) => ($isInvalid ? 'red' : '')};
  transition: border-color 0.5s ease;
  padding-left: ${({ prefix }) => (prefix ? '30px' : '10px')};
  padding-right: ${({ suffix }) => (suffix ? '30px' : '10px')};
`;

// Error styling
export const Error = styled.span`
  font-size: 12.5px;
  color: red;
  margin-top: 1px;
`;
