import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from 'reactstrap';
import { useForm } from '@/components/Organisms/Form';
import Field from '@/components/Atoms/Field';
import Form from '@/components/Organisms/Form/Form';
import Button from '@/components/Atoms/Button';

const BrandModal = ({ currentLogo, isLoading, handleClick }) => {
  const { name, logo } = currentLogo;
  const [form] = useForm();

  useEffect(() => {
    if (currentLogo && Object.keys(currentLogo).length > 0) {
      form.setFieldsValue({
        name,
        logo,
      });
    }
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
          <Form.Item
            label="Upload Logo"
            type="file"
            name="logo"
            displayFile={logo || null}
            rules={[{ required: true }]}>
            <Field />
          </Form.Item>
        </div>
        <div className="mb-3">
          <Button loading={isLoading} color="primary" type="submit" className="w-100">
            {Object.keys(currentLogo)?.length > 0 ? 'Update Brand' : 'Create Brand'}
          </Button>
        </div>
      </Row>
    </Form>
  );
};

BrandModal.propTypes = {
  handleClick: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired,
  currentLogo: PropTypes.shape({
    name: PropTypes.string,
    logo: PropTypes.string,
  }),
};

export default BrandModal;
