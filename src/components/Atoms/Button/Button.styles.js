import styled, { css } from 'styled-components';
import { Button } from 'reactstrap';

export const StyledButton = styled(Button)`
  .loader {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    display: inline-block;
    border: 3px solid transparent;
    border-top-color: var(--primary);
    border-right-color: var(--white);
    box-sizing: border-box;
    animation: rotation 1s linear infinite;
  }

  @keyframes rotation {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
  ${({ loader }) =>
    loader &&
    css`
      pointer-events: none;
      opacity: 0.6;
    `}
`;
