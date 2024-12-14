import styled from 'styled-components';
import { Modal } from 'reactstrap';

export const StyledModal = styled(Modal)`
  .modal-content {
    border-radius: 15px;
  }

  .modal-header {
    justify-content: center;
    text-align: center;
  }

  .modal-title {
    margin-bottom: 10px;
  }

  .modal-header svg {
    margin-top: 20px;
  }

  .modal-body {
    text-align: center;
    min-height: 100px;
    font-size: 1.12rem;
  }
`;
