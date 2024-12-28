import React, { useState, useMemo, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from 'reactstrap';
import { useDispatch, useSelector } from 'react-redux';

import { handleApiCall, isObjectEmptyOrFieldsNull } from '@/helpers/common';
import Field from '@/components/Atoms/Field';
import adminThunk from '../../../slices/admins/thunk';
import Button from '../../Atoms/Button';
import Form from '../Form/Form';
import { useForm } from '../Form';

const AdminModal = ({ admin, closeMe }) => {
  const dispatch = useDispatch();
  const [form] = useForm();
  const [isLoading, setIsLoading] = useState(false);
  const { uniqueRoles } = useSelector(state => state?.Role) || [];

  const roleOptions = useMemo(
    () => [
      ...uniqueRoles.map(ele => ({
        label: ele?.type,
        value: ele?.id,
      })),
    ],
    [uniqueRoles],
  );

  const onSubmit = async values => {
    try {
      setIsLoading(true);
      const payload = {
        ...values,
        roles: values?.roles?.map(role => role?.value),
      };

      let success;

      if (!isObjectEmptyOrFieldsNull(admin)) {
        success = await handleApiCall(dispatch, adminThunk.updateAdmin, {
          id: admin?.id,
          payload,
        });
      } else {
        success = await handleApiCall(dispatch, adminThunk.createAdmin, {
          payload,
        });
      }

      if (success) {
        closeMe();
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(`Failed to ${!isObjectEmptyOrFieldsNull(admin) ? 'update' : 'create'} admin`);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!isObjectEmptyOrFieldsNull(admin)) {
      form.setFieldsValue({
        name: admin?.name,
        email: admin?.email,
        roles: roleOptions?.filter(({ label }) => admin?.roles?.includes(label)),
      });
    }
  }, []);

  return (
    <Form form={form} onSubmit={onSubmit}>
      <Row className="mb-2">
        <Col>
          <Form.Item label="Name" type="text" name="name" placeholder="John Doe" rules={[{ required: true }]}>
            <Field />
          </Form.Item>
        </Col>
        <Col>
          <Form.Item
            label="Email"
            type="text"
            name="email"
            placeholder="admin@example.com"
            rules={[{ required: true }, { email: true }]}>
            <Field />
          </Form.Item>
        </Col>
      </Row>
      <Row className="mb-3">
        <Col>
          <Form.Item
            label="Roles"
            type="select"
            isMulti
            name="roles"
            closeMenuOnSelect={false}
            options={roleOptions}
            rules={[
              { required: true },
              { transform: value => !value?.length, message: 'Atleast one role is required.' },
            ]}>
            <Field />
          </Form.Item>
        </Col>
      </Row>
      {isObjectEmptyOrFieldsNull(admin) && (
        <Row className="mb-2">
          <Col>
            <div className="mb-3">
              <Form.Item
                label="New Password"
                type="password"
                name="newPassword"
                placeholder="********"
                rules={[{ required: true }, { password: true }]}>
                <Field />
              </Form.Item>
            </div>
          </Col>
          <Col>
            <div className="mb-3">
              <Form.Item
                label="Confirm Password"
                type="password"
                name="confirmPassword"
                placeholder="********"
                rules={[
                  { required: true },
                  {
                    transform: value => value !== form.getFieldValue('newPassword'),
                    message: 'The two passwords you entered do not match.',
                  },
                ]}>
                <Field />
              </Form.Item>
            </div>
          </Col>
        </Row>
      )}

      <Row className="mb-3">
        <div className="hstack gap-2 justify-content-end">
          <Button type="submit" loading={isLoading} className="btn" color="primary">
            {!isObjectEmptyOrFieldsNull(admin) ? 'Update Admin' : 'Create Admin'}
          </Button>
        </div>
      </Row>
    </Form>
  );
};

AdminModal.propTypes = {
  admin: PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
    email: PropTypes.string,
    roles: PropTypes.arrayOf(PropTypes.string),
  }),
  closeMe: PropTypes.func,
};

export default AdminModal;
