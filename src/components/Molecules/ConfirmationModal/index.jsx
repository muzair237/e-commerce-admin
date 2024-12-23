import React from 'react';
import PropTypes from 'prop-types';

import { giveIcon } from '@/helpers/common';
import Button from '@/components/Atoms/Button';

const ConfirmationModal = ({ type, message, isLoading, handleClick }) => (
  <>
    <div className="mt-2 text-center">
      {giveIcon({ type })}
      <div className="mt-4 pt-2 fs-15 mx-4 mx-sm-5">
        <span className="fs-19">{message}</span>
      </div>
    </div>
    <div className="d-flex gap-2 justify-content-center mt-4 mb-2">
      <Button loading={isLoading} onClick={handleClick} color="danger" id="delete-record">
        Yes, {type} it!
      </Button>
    </div>
  </>
);

ConfirmationModal.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  type: PropTypes.oneOf(['delete']).isRequired,
  message: PropTypes.string.isRequired,
  handleClick: PropTypes.func.isRequired,
};

export default ConfirmationModal;
