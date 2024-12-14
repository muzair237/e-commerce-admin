import React from 'react';
import PropTypes from 'prop-types';
import { ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap';
import { StyledModal } from './ModalWrapper.styles';

const ModalWrapper = ({
  isOpen,
  headerIcon,
  headerIconSize = 100,
  toggle,
  closeable = true,
  size = 'md',
  backdrop,
  scrollable = false,
  children,
  footerBtnText = 'Go Back',
  footerBtnOnClick,
}) => (
  <StyledModal isOpen={isOpen} toggle={toggle} centered size={size} backdrop={backdrop} scrollable={scrollable}>
    <ModalHeader toggle={closeable && toggle}>
      <div>
        <p className="fs-23">Modal Header</p>
        {headerIcon && <div>{React.cloneElement(headerIcon, { size: headerIconSize })}</div>}
      </div>
    </ModalHeader>
    <ModalBody>{children}</ModalBody>
    <ModalFooter>
      <Button color="primary" style={{ width: '100%' }} onClick={footerBtnOnClick ?? toggle}>
        {footerBtnText}
      </Button>
    </ModalFooter>
  </StyledModal>
);

ModalWrapper.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  headerIcon: PropTypes.node,
  headerIconSize: PropTypes.number,
  toggle: PropTypes.func.isRequired,
  closeable: PropTypes.bool,
  size: PropTypes.oneOf(['sm', 'md', 'lg', 'xl']),
  backdrop: PropTypes.oneOf([true, false, 'static']),
  scrollable: PropTypes.bool,
  children: PropTypes.node.isRequired,
  footerBtnText: PropTypes.string,
  footerBtnOnClick: PropTypes.func,
};

export default ModalWrapper;
