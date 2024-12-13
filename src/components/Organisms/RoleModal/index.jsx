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
import Button from '../../Atoms/Button';
import CustomizePermissionModal from '../CustomizePermissionModal';

export default function RoleModal({ role, isOpen, setIsOpen }) {
  const dispatch = useDispatch();
  const permissions = useSelector(state => state?.Role?.permissions || []);
  const isLoading = useSelector(state => state.Role.isLoading || false);

  const [customizePermission, setCustomizePermission] = useState(false);
  const [selectedPermissions, setSelectedPermissions] = useState([]);
  const [isEdit, setIsEdit] = useState(false);

  const { refetch } = useContextHook(RefetchContext, v => ({
    refetch: v.refetch,
  }));

  const initialValues = { type: '', description: '' };
  const validationSchema = Yup.object().shape({
    type: Yup.string()
      .required('Please Enter Type!')
      .matches(/^[A-Z_]+$/, 'Role type must be uppercase and only alphabets and _ are allowed'),
    description: Yup.string()
      .required('Please Enter Description')
      .max(40, "Description's Maximum Character Length Is 40."),
  });

  const tabs = useMemo(
    () =>
      permissions
        ?.filter(ele => ele?.parent?.includes('$'))
        .map(({ route }) => {
          let label = route?.split('.')[0]?.replace(/^\//, '');
          label = label?.charAt(0)?.toUpperCase() + label?.slice(1)?.toLowerCase();
          return {
            label,
            value: label?.toLowerCase(),
          };
        }),
    [permissions],
  );
  const onSubmit = data => {
    const payload = {
      ...data,
      permissions: selectedPermissions,
    };
    if (!role) {
      dispatch(roleThunk.createRole({ payload, setIsOpen, refetch }));
    } else {
      dispatch(roleThunk.editRole({ id: role?._id, payload, setIsOpen, refetch }));
    }
  };

  useEffect(() => {
    dispatch(roleThunk.getUniqueParents());
    if (role) setIsEdit(true);
  }, []);

  useEffect(() => {
    if (role && role.permissions && permissions) {
      const perms = permissions?.filter(permission => role.permissions.includes(permission._id))?.map(({ can }) => can);
      setSelectedPermissions(perms);
    }
  }, [role, permissions]);

  return (
    <>
      <Modal id="showModal" backdrop="static" isOpen={isOpen} centered>
        <ModalHeader className="bg-light p-3" toggle={() => setIsOpen(false)}>
          {role ? 'Edit Role' : 'Add Role'}
        </ModalHeader>
        <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
          <Form>
            <ModalBody>
              <Row>
                <Col>
                  <Label className="form-label">Type *</Label>
                  <Input name="type" value={role && role?.type} type="text" placeholder="USER" />
                </Col>
                <Col>
                  <Label className="form-label">Description *</Label>
                  <Input
                    name="description"
                    value={role && role?.description}
                    type="text"
                    placeholder="Role for a User"
                  />
                </Col>
              </Row>
              <Row className="mt-4 text-end">
                <Col>
                  <Button onClick={() => setCustomizePermission(true)} className="btn" color="primary">
                    Customize Permissions
                  </Button>
                </Col>
              </Row>
            </ModalBody>

            <ModalFooter>
              <div className="hstack gap-2 justify-content-end">
                <Button
                  type="submit"
                  disabled={!selectedPermissions?.length}
                  loading={isLoading}
                  className="btn btn-success">
                  {role ? 'Edit Role' : 'Create Role'}
                </Button>
              </div>
            </ModalFooter>
          </Form>
        </Formik>
      </Modal>
      {customizePermission && (
        <CustomizePermissionModal
          isEdit={isEdit}
          tabs={tabs}
          selected={selectedPermissions}
          setPermissions={setSelectedPermissions}
          permissions={permissions}
          isOpen={customizePermission}
          setIsOpen={setCustomizePermission}
        />
      )}
    </>
  );
}
