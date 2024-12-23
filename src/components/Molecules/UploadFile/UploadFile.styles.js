import styled from 'styled-components';

export const UploadFileWrapper = styled.div`
  width: 100%;
  cursor: ${({ $shouldPoint }) => ($shouldPoint ? 'pointer' : 'not-allowed')};
  /* cursor: pointer; */
  border-radius: 7px;
  border: 1px solid transparent;
  border-color: ${({ $isInvalid }) => ($isInvalid ? 'red' : '')};
  transition: border-color 0.5s ease;
`;
