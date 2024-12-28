import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from 'reactstrap';
import { useDispatch } from 'react-redux';

import { handleApiCall } from '@/helpers/common';
import Field from '@/components/Atoms/Field';
import adminThunk from '../../../slices/admins/thunk';
import Button from '../../Atoms/Button';
import { useForm } from '../Form';
import Form from '../Form/Form';

const UpdatePasswordModal = ({ adminId, closeMe }) => {
  const dispatch = useDispatch();
  const [form] = useForm();
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async data => {
    try {
      setIsLoading(true);

      const success = await handleApiCall(dispatch, adminThunk.updatePassword, {
        id: adminId,
        payload: data,
      });

      if (success) {
        closeMe();
      }
    } catch ({ message }) {
      // eslint-disable-next-line no-console
      console.log('Failed to update password: ', message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form form={form} onSubmit={onSubmit}>
      <Row>
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

      <Row className="mb-3">
        <div className="hstack gap-2 justify-content-end">
          <Button type="submit" loading={isLoading} className="btn" color="primary">
            Update Password
          </Button>
        </div>
      </Row>
    </Form>
  );
};

UpdatePasswordModal.propTypes = {
  adminId: PropTypes.number.isRequired,
  closeMe: PropTypes.func.isRequired,
};

export default UpdatePasswordModal;
