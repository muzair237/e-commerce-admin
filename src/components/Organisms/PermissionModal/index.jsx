import React, { useState, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from 'reactstrap';
import { useDispatch, useSelector } from 'react-redux';

import { handleApiCall, isObjectEmptyOrFieldsNull } from '@/helpers/common';
import { useForm } from '@/components/Organisms/Form';
import Field from '@/components/Atoms/Field';
import Form from '@/components/Organisms/Form/Form';
import permissionThunk from '../../../slices/permissions/thunk';
import Button from '../../Atoms/Button';

const PermissionModal = ({ permission, closeMe }) => {
  const dispatch = useDispatch();
  const [form] = useForm();
  const [isLoading, setIsLoading] = useState(false);
  const { parents } = useSelector(state => state.Permission) || [];

  const parentOptions = useMemo(
    () => [
      {
        label: 'No-Parent',
        value: '$',
      },
      ...parents.map(({ can }) => ({
        label: can.split('.nav')[0],
        value: can.split('.nav')[0],
      })),
    ],
    [parents],
  );

  const onSubmit = async data => {
    try {
      setIsLoading(true);
      const payload = {
        ...data,
        parents: data.parents.map(ele => ele.value),
      };

      let success;
      if (!isObjectEmptyOrFieldsNull(permission)) {
        success = await handleApiCall(dispatch, permissionThunk.updatePermission, { id: permission?.id, payload });
      } else {
        success = await handleApiCall(dispatch, permissionThunk.createPermission, { payload });
      }

      if (success) {
        closeMe();
      }
    } catch ({ message }) {
      // eslint-disable-next-line no-console
      console.log(`Failed to ${permission ? 'update' : 'create'} permission`, message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    dispatch(permissionThunk.getUniqueParents());
  }, []);

  useEffect(() => {
    if (!isObjectEmptyOrFieldsNull(permission)) {
      form.setFieldsValue({
        can: permission?.can,
        route: permission?.route,
        description: permission?.description,
        parents: parentOptions?.filter(({ value }) => permission?.parents?.includes(value)),
      });
    }
  }, []);

  return (
    <Row>
      <Col lg={12}>
        <Form form={form} onSubmit={onSubmit}>
          <Row className="mb-2">
            <Col>
              <div>
                <Form.Item
                  label="Route"
                  type="text"
                  name="route"
                  placeholder="/example"
                  rules={[
                    { required: true },
                    { max: 40, message: "Route's Maximum Character Length Is 40" },
                    {
                      pattern: /^\/[a-zA-Z/_.-]+$/,
                      message: 'Route can only contain letters, underscores, dots, and must start with a slash.',
                    },
                  ]}>
                  <Field />
                </Form.Item>
              </div>
            </Col>
            <Col>
              <div>
                <Form.Item
                  label="Can"
                  type="text"
                  name="can"
                  placeholder="example.nav"
                  rules={[
                    { required: true },
                    { pattern: /^[a-zA-Z._-]+$/, message: 'Can can only contain letters, underscores, and dashes' },
                  ]}>
                  <Field />
                </Form.Item>
              </div>
            </Col>
          </Row>
          <Row className="mb-3">
            <Col>
              <div>
                <Form.Item
                  label="Description"
                  type="text"
                  name="description"
                  placeholder="This permission is use to view the example page"
                  rules={[{ required: true }]}>
                  <Field />
                </Form.Item>
              </div>
            </Col>

            <Col>
              <div>
                <Form.Item
                  label="Parents"
                  name="parents"
                  isMulti
                  type="select"
                  closeMenuOnSelect={false}
                  options={parentOptions}
                  rules={[
                    { required: true },
                    { transform: value => !value?.length, message: 'Atleast one parent is required.' },
                  ]}>
                  <Field />
                </Form.Item>
              </div>
            </Col>
          </Row>

          <Row className="mb-3 justify-content-end">
            <Col xs="auto">
              <Button type="submit" loading={isLoading} className="btn btn-primary">
                {!isObjectEmptyOrFieldsNull(permission) ? 'Update Permission' : 'Create Permission'}
              </Button>
            </Col>
          </Row>
        </Form>
      </Col>
    </Row>
  );
};

PermissionModal.propTypes = {
  permission: PropTypes.shape({}),
  closeMe: PropTypes.func.isRequired,
};

export default PermissionModal;
