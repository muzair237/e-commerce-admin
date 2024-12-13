import React from 'react';
import { Row, Col, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { useContextHook } from 'use-context-hook';
import { RefetchContext } from '../../../contexts/refetchContext';
import Label from '../../Atoms/Label';
import Input from '../../Atoms/Input';
import adminThunk from '../../../slices/admins/thunk';
import Button from '../../Atoms/Button';

export default function UpdatePasswordModal({ adminId, isOpen, setIsOpen }) {
  const dispatch = useDispatch();

  const { refetch } = useContextHook(RefetchContext, v => ({
    refetch: v.refetch,
  }));

  const isLoading = useSelector(state => state.Admin.isLoading || false);

  const initialValues = {
    password: '',
    confirm_password: '',
  };

  const validationSchema = Yup.object().shape({
    password: Yup.string()
      .required('Please Enter Password!')
      .matches(
        '^(?=.*[!@#$%^&*])(?=.*\\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$',
        'Password must contain at least one lowercase letter, one uppercase letter, one digit, and one special character.',
      ),
    confirm_password: Yup.string()
      .when('password', {
        is: val => val && val.length > 0,
        then: () => Yup.string().oneOf([Yup.ref('password')], 'Both passwords need to be the same'),
      })
      .required('Please Confirm Password'),
  });

  const onSubmit = data => {
    const payload = {
      password: data?.password,
    };
    dispatch(adminThunk.editAdmin({ id: adminId, payload, setIsOpen, refetch }));
  };

  return (
    <>
      <Modal id="showModal" backdrop="static" isOpen={isOpen} centered>
        <ModalHeader className="bg-light p-3" toggle={() => setIsOpen(false)}>
          Update Password
        </ModalHeader>
        <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
          <Form>
            <ModalBody>
              <Row>
                <Col>
                  <Label className="form-label">Password *</Label>
                  <div className="position-relative auth-pass-inputgroup mb-3">
                    <Input name="password" type="password" placeholder="Password" />
                  </div>
                </Col>
                <Col>
                  <Label className="form-label">Confirm Password *</Label>
                  <div className="position-relative auth-pass-inputgroup mb-3">
                    <Input name="confirm_password" type="password" placeholder="Confirm Password" />
                  </div>
                </Col>
              </Row>
            </ModalBody>

            <ModalFooter>
              <div className="hstack gap-2 justify-content-end">
                <Button type="submit" loading={isLoading} className="btn btn-success">
                  Update Password
                </Button>
              </div>
            </ModalFooter>
          </Form>
        </Formik>
      </Modal>
    </>
  );
}
