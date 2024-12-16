import React from 'react';
import propTypes from 'prop-types';
import { Row, Col } from 'reactstrap';
import { useForm } from '@/components/Organisms/Form';
import Field from '@/components/Atoms/Field';
import Form from '@/components/Organisms/Form/Form';
import Button from '@/components/Atoms/Button';

const LogoModal = ({ handleClick }) => {
  const [form] = useForm();

  return (
    <Form form={form} onSubmit={handleClick}>
      <Row>
        <Col>
          <div className="mb-3">
            <Form.Item label="Name" type="text" name="name" placeholder="Name" rules={[{ required: true }]}>
              <Field />
            </Form.Item>
          </div>
        </Col>
        <div className="mb-3">
          <Form.Item label="Upload Logo" type="file" name="logo" rules={[{ required: true }]}>
            <Field />
          </Form.Item>
        </div>
        <div className="mb-3">
          <Button color="primary" className="w-100" onClick={handleClick}>
            Submit
          </Button>
        </div>
      </Row>
    </Form>
  );
};

LogoModal.propTypes = {
  handleClick: propTypes.func.isRequired,
};

export default LogoModal;
