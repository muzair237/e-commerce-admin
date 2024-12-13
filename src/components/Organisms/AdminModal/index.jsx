import React, { useState, useEffect, useMemo } from 'react';
import { Row, Col, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { useContextHook } from 'use-context-hook';
import { RefetchContext } from '../../../contexts/refetchContext';
import Label from '../../Atoms/Label';
import Input from '../../Atoms/Input';
import roleThunk from '../../../slices/roles/thunk';
import adminThunk from '../../../slices/admins/thunk';
import Button from '../../Atoms/Button';

export default function AdminModal({ admin, uniqueRoles, isOpen, setIsOpen }) {
  const dispatch = useDispatch();

  const [isEdit, setIsEdit] = useState(false);

  const { refetch } = useContextHook(RefetchContext, v => ({
    refetch: v.refetch,
  }));

  const isLoading = useSelector(state => state.Admin.isLoading || false);

  const roleOptions = useMemo(
    () => [
      ...uniqueRoles.map(ele => ({
        label: ele?.type,
        value: ele?._id,
      })),
    ],
    [uniqueRoles],
  );

  const initialValues = {
    name: '',
    email: '',
    roles: [],
    ...(isEdit ? {} : { password: '', confirm_password: '' }),
  };

  const validationSchema = Yup.object().shape({
    name: Yup.string().min(3, 'Name must be of 3 Characters!').required('Please Enter Full Name!'),
    email: Yup.string().email('Invalid Email').required('Please Enter Email!'),
    roles: Yup.array().min(1, 'Please select at least One Role!'),
    ...(isEdit
      ? {}
      : {
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
        }),
  });

  const onSubmit = data => {
    if (!admin) {
      const payload = {
        ...data,
        roles: data.roles.map(({ value }) => value),
      };
      dispatch(adminThunk.createAdmin({ payload, setIsOpen, refetch }));
    } else {
      const payload = {
        name: data?.name,
        email: data?.email,
        roles: data.roles.map(({ value }) => value),
      };
      dispatch(adminThunk.editAdmin({ id: admin?._id, payload, setIsOpen, refetch }));
    }
  };

  useEffect(() => {
    dispatch(roleThunk.getUniqueParents());
    if (admin) setIsEdit(true);
  }, []);

  return (
    <>
      <Modal id="showModal" backdrop="static" isOpen={isOpen} centered>
        <ModalHeader className="bg-light p-3" toggle={() => setIsOpen(false)}>
          {isEdit ? 'Edit Admin' : 'Create Admin'}
        </ModalHeader>
        <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
          <Form>
            <ModalBody>
              <Row>
                <Col>
                  <Label className="form-label">Full Name *</Label>
                  <Input name="name" value={admin && admin?.name} type="text" placeholder="John Doe" />
                </Col>
                <Col>
                  <Label className="form-label">Email *</Label>
                  <Input name="email" value={admin && admin?.email} type="email" placeholder="admin@aiva.com" />
                </Col>
              </Row>
              <Row className="mt-4">
                <Col>
                  <Label className="form-label">Roles *</Label>
                  <Input
                    defaultValue={
                      admin && admin.roles.map(role => roleOptions.find(option => option.value === role._id))
                    }
                    name="roles"
                    type="select"
                    options={roleOptions}
                    isMulti
                    isSearchable
                    hideSelectedOptions={false}
                  />
                </Col>
              </Row>
              {!isEdit && (
                <Row className="mt-3">
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
              )}
            </ModalBody>

            <ModalFooter>
              <div className="hstack gap-2 justify-content-end">
                <Button type="submit" loading={isLoading} className="btn btn-success">
                  {isEdit ? 'Edit Admin' : 'Create Admin'}
                </Button>
              </div>
            </ModalFooter>
          </Form>
        </Formik>
      </Modal>
    </>
  );
}
