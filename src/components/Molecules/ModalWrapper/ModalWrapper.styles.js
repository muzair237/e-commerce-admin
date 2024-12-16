import styled from 'styled-components';
import { Modal } from 'reactstrap';

export const StyledModal = styled(Modal)`
  .modal-content {
    border-radius: 15px;
  }

  /* .modal-header {
    border: 1px solid red;
    display: flex;
    justify-content: space-between;
  } */

  .modal-header svg {
    margin-top: 20px;
  }

  .modal-body {
    padding-top: ${({ $shouldApplyBottomPadding }) => $shouldApplyBottomPadding && '5px'};
    padding-bottom: ${({ $shouldApplyBottomPadding }) => $shouldApplyBottomPadding && '5px'};
    ${({ $isContentCentered }) =>
      $isContentCentered &&
      `
      text-align: center;
    min-height: 100px;
    font-size: 1.12rem;
    `}
  }
`;

export const ModalHeader = styled.div`
  display: flex;
  justify-content: ${({ $closeable }) => ($closeable ? 'space-between' : 'center')};
  padding: 17px 20px 0px 20px;

  .title {
    font-size: 1.45rem;
    font-weight: 450;
  }

  .close-icon {
    cursor: pointer;
  }
`;
