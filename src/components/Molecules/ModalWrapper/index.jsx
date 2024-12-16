import React from 'react';
import PropTypes from 'prop-types';
import { ModalBody, ModalFooter } from 'reactstrap';

import { IoCloseOutline } from 'react-icons/io5';
import { StyledModal, ModalHeader } from './ModalWrapper.styles';
import Button from '@/components/Atoms/Button';

const ModalWrapper = ({
  isOpen,
  title = 'Modal Title',
  headerIcon,
  headerIconSize = 100,
  toggle,
  closeable = true,
  isContentCentered = true,
  size = 'md',
  backdrop = true,
  scrollable = false,
  children,
  footerBtnText,
  footerBtnOnClick,
}) => (
  <StyledModal
    $isContentCentered={isContentCentered}
    $shouldApplyBottomPadding={!footerBtnText}
    isOpen={isOpen}
    centered
    size={size}
    backdrop={backdrop}
    scrollable={scrollable}>
    <ModalHeader $closeable={closeable}>
      <span className="title">{title}</span>
      {closeable && <IoCloseOutline onClick={toggle} className="close-icon" size={30} />}
    </ModalHeader>
    <ModalBody>
      <div className="mb-4">{headerIcon && React.cloneElement(headerIcon, { size: headerIconSize })}</div>
      {children}
    </ModalBody>

    {footerBtnText && (
      <ModalFooter>
        <Button color="primary" className="w-100" onClick={footerBtnOnClick ?? toggle}>
          {footerBtnText}
        </Button>
      </ModalFooter>
    )}
  </StyledModal>
);

ModalWrapper.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired,
  headerIcon: PropTypes.node,
  headerIconSize: PropTypes.number,
  toggle: PropTypes.func,
  closeable: PropTypes.bool,
  isContentCentered: PropTypes.bool,
  size: PropTypes.oneOf(['sm', 'md', 'lg', 'xl']),
  backdrop: PropTypes.oneOf([true, false, 'static']),
  scrollable: PropTypes.bool,
  children: PropTypes.node.isRequired,
  footerBtnText: PropTypes.string,
  footerBtnOnClick: PropTypes.func,
};

export default ModalWrapper;
