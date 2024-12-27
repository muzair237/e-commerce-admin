import React, { useState, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from 'reactstrap';
import { useDispatch, useSelector } from 'react-redux';

import permissionThunk from '@/slices/permissions/thunk';
import { handleApiCall, isObjectEmptyOrFieldsNull } from '@/helpers/common';
import Field from '@/components/Atoms/Field';
import Form from '@/components/Organisms/Form/Form';
import ModalWrapper from '@/components/Molecules/ModalWrapper';
import roleThunk from '../../../slices/roles/thunk';
import Button from '../../Atoms/Button';
import CustomizePermissionModal from '../CustomizePermissionModal';
import { useForm } from '../Form';

const RoleModal = ({ role, closeMe }) => {
  const dispatch = useDispatch();
  const [form] = useForm();
  const {
    permissions: { items: permissions },
  } = useSelector(state => state?.Permission) || [];
  const [isLoading, setIsLoading] = useState(false);

  const [customizePermissionModal, setCustomizePermissionModal] = useState(false);
  const [selectedPermissions, setSelectedPermissions] = useState([]);

  const tabs = useMemo(
    () =>
      permissions
        ?.filter(ele => ele?.parents?.includes('$'))
        ?.map(({ route }) => {
          let label = route?.split('.')[0]?.replace(/^\//, '');
          label = label?.charAt(0)?.toUpperCase() + label?.slice(1)?.toLowerCase();

          return {
            label,
            value: label?.toLowerCase(),
          };
        }),
    [permissions],
  );

  const onSubmit = async data => {
    try {
      setIsLoading(true);
      const payload = {
        ...data,
        permissions: selectedPermissions?.map(select => permissions?.find(item => item.can === select)?.id),
      };

      let success;
      if (!isObjectEmptyOrFieldsNull(role)) {
        success = await handleApiCall(dispatch, roleThunk.updateRole, {
          id: role?.id,
          payload,
        });
      } else {
        success = await handleApiCall(dispatch, roleThunk.createRole, {
          payload,
        });
      }
      if (success) {
        closeMe();
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(`Failed to ${!isObjectEmptyOrFieldsNull(role) ? 'update' : 'create'} role!`);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (role?.permissions && permissions) {
      const perms = permissions
        ?.filter(permission => role?.permissions?.includes(permission.id))
        ?.map(({ can }) => can);
      setSelectedPermissions(perms);
    }
  }, [permissions]);

  useEffect(() => {
    dispatch(permissionThunk.getAllPermissions({ getAll: true }));
  }, []);

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
              <Button onClick={() => setCustomizePermissionModal(true)} className="btn" color="secondary">
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

      {/* Customize Permission Modal */}
      <ModalWrapper
        isOpen={customizePermissionModal}
        toggle={() => setCustomizePermissionModal(false)}
        title="Customize Permissions"
        size="xl"
        backdrop="static"
        isContentCentered={false}>
        <CustomizePermissionModal
          tabs={tabs}
          selected={selectedPermissions}
          setPermissions={setSelectedPermissions}
          permissions={permissions}
          closeMe={() => setCustomizePermissionModal(false)}
        />
      </ModalWrapper>
    </>
  );
};

RoleModal.propTypes = {
  role: PropTypes.shape({
    id: PropTypes.number.isRequired,
    type: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    permissions: PropTypes.arrayOf(PropTypes.number).isRequired,
  }),
  closeMe: PropTypes.func.isRequired,
};

export default RoleModal;
