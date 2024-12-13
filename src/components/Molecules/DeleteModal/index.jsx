import React from 'react';
import { Modal, ModalBody } from 'reactstrap';
import { AiOutlineDelete } from 'react-icons/ai';

const DeleteModal = ({ message, isOpen, setIsOpen, handleClick }) => (
  <Modal isOpen={isOpen} toggle={() => setIsOpen(false)} centered>
    <ModalBody className="py-3 px-5">
      <div className="mt-2 text-center">
        <AiOutlineDelete className="animate__animated animate__pulse animate__infinite infinite" size={70} />
        <div className="mt-4 pt-2 fs-15 mx-4 mx-sm-5">
          <h4>Are you sure ?</h4>
          <p className="text-muted mx-4 mb-0">{message}</p>
        </div>
      </div>
      <div className="d-flex gap-2 justify-content-center mt-4 mb-2">
        <button type="button" className="btn w-sm btn-light" data-bs-dismiss="modal" onClick={() => setIsOpen(false)}>
          Close
        </button>
        <button onClick={handleClick} type="button" className="btn w-sm btn-primary " id="delete-record">
          Yes, Delete It!
        </button>
      </div>
    </ModalBody>
  </Modal>
);

export default DeleteModal;
