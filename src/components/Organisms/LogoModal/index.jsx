import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from 'reactstrap';
import { useForm } from '@/components/Organisms/Form';
import Field from '@/components/Atoms/Field';
import Form from '@/components/Organisms/Form/Form';
import Button from '@/components/Atoms/Button';

const LogoModal = ({ currentLogo, handleClick }) => {
  const { name, logo } = currentLogo;
  const [form] = useForm();

  useEffect(() => {
    form.setFieldsValue({
      name,
      logo,
    });
  }, []);

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
          <Form.Item label="Upload Logo" type="file" name="logo" displayFile={logo} rules={[{ required: true }]}>
            <Field />
          </Form.Item>
        </div>
        <div className="mb-3">
          <Button color="primary" type="submit" className="w-100">
            Submit
          </Button>
        </div>
      </Row>
    </Form>
  );
};

LogoModal.propTypes = {
  handleClick: PropTypes.func.isRequired,
  currentLogo: PropTypes.shape({
    name: PropTypes.string,
    logo: PropTypes.string,
  }),
};

export default LogoModal;
