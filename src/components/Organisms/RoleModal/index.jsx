import React, { useState, useEffect, useMemo } from 'react';
import { Row, Col } from 'reactstrap';
import { useDispatch, useSelector } from 'react-redux';

import permissionThunk from '@/slices/permissions/thunk';
import { isObjectEmptyOrFieldsNull } from '@/helpers/common';
import Field from '@/components/Atoms/Field';
import Form from '@/components/Organisms/Form/Form';
import roleThunk from '../../../slices/roles/thunk';
import Button from '../../Atoms/Button';
import CustomizePermissionModal from '../CustomizePermissionModal';
import { useForm } from '../Form';

export default function RoleModal({ role, closeMe }) {
  console.log('role: ', role);
  const dispatch = useDispatch();
  const [form] = useForm();
  const { parents: permissions } = useSelector(state => state?.Permission) || [];
  console.log('permissions: ', permissions);
  const isLoading = useSelector(state => state.Role.isLoading || false);

  const [customizePermission, setCustomizePermission] = useState(false);
  const [selectedPermissions, setSelectedPermissions] = useState([]);

  const tabs = useMemo(
    () =>
      permissions.map(({ route }) => {
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
    // const payload = {
    //   ...data,
    //   permissions: selectedPermissions,
    // };
    // if (!role) {
    //   dispatch(roleThunk.createRole({ payload, setIsOpen, refetch }));
    // } else {
    //   dispatch(roleThunk.editRole({ id: role?._id, payload, setIsOpen, refetch }));
    // }
  };

  useEffect(() => {
    dispatch(permissionThunk.getUniqueParents());
  }, []);

  useEffect(
    () => {
      if (role?.permissions && permissions) {
        const perms = permissions
          ?.filter(permission => role.permissions.includes(permission.id))
          ?.map(({ can }) => can);
        setSelectedPermissions(perms);
      }
    },
    [
      // role, permissions
    ],
  );

  useEffect(() => {
    if (!isObjectEmptyOrFieldsNull(role)) {
      form.setFieldsValue({
        type: role?.type,
        description: role?.description,
      });
    }
  }, []);

  return (
    <>
      <Row>
        <Form form={form} onSubmit={onSubmit}>
          <Row className="mb-2">
            <Col>
              <div className="mb-3">
                <Form.Item
                  label="Type"
                  type="text"
                  name="type"
                  placeholder="TESTER"
                  rules={[
                    { required: true },
                    {
                      pattern: /^[A-Z_]+$/,
                      message: 'Role type must be uppercase and only alphabets and _ are allowed',
                    },
                  ]}>
                  <Field />
                </Form.Item>
              </div>
            </Col>
            <Col>
              <div className="mb-3">
                <Form.Item
                  label="Description"
                  type="text"
                  name="description"
                  placeholder="This is the role for a TESTER"
                  rules={[{ required: true }]}>
                  <Field />
                </Form.Item>
              </div>
            </Col>
          </Row>
          <Row className="mb-3 text-end">
            <Col>
              <Button onClick={() => setCustomizePermission(true)} className="btn" color="secondary">
                Customize Permissions
              </Button>
            </Col>
          </Row>

          <Row className="mb-3 justify-content-end">
            <Col xs="auto">
              <Button
                color="primary"
                type="submit"
                disabled={!selectedPermissions?.length}
                loading={isLoading}
                className="btn">
                {!isObjectEmptyOrFieldsNull(role) ? 'Update Role' : 'Create Role'}
              </Button>
            </Col>
          </Row>
        </Form>
      </Row>

      {customizePermission && (
        <CustomizePermissionModal
          isEdit={!isObjectEmptyOrFieldsNull(role)}
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
