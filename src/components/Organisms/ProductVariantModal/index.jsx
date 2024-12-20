import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Col, Row } from 'reactstrap';

import { prepareProductFiltersData } from '@/helpers/common';
import productsThunk from '@/slices/products/thunk';
import Field from '@/components/Atoms/Field';
import Button from '@/components/Atoms/Button';
import Form, { useForm } from '../Form';

const ProductVariantModal = () => {
  const dispatch = useDispatch();
  const [form] = useForm();
  const [graphicsCardFieldType, setGraphicsCardFieldType] = useState('text');
  const [isGraphicCardTypeDisabled, setIsgraphicCardTypeDisabled] = useState(true);

  const { productFilterOptions } = useSelector(state => state?.Product) || {};

  const {
    brandOptions,
    ramOptions,
    storageTypeOptions,
    storageSizeOptions,
    processorNameOptions,
    processorGenOptions,
    graphicsCardTypeOptions,
    graphicsCardMemorySizes,
  } = prepareProductFiltersData(productFilterOptions);

  const onChangeGraphicCardType = value => {
    const isValidValue = value && Object.keys(value).length > 0;
    form.setFieldsValue({
      graphicsCardType: isValidValue ? value : { label: '', value: '' },
      graphicsCardMemorySize: !isValidValue && '',
    });

    if (!isValidValue) {
      form.removeFieldError('graphicsCardMemorySize');
    }

    form.setFieldRules('graphicsCardMemorySize', [{ required: isValidValue }]);

    setGraphicsCardFieldType(isValidValue ? 'select' : 'text');
    setIsgraphicCardTypeDisabled(!isValidValue);
  };

  const onSubmit = values => {
    console.log('values: ', values);
  };

  useEffect(() => {
    dispatch(productsThunk.getProductFilterOptions());
  }, []);

  return (
    <Row>
      <Col lg={12}>
        <Form form={form} onSubmit={onSubmit}>
          <Row className="mb-3">
            <Col>
              <Form.Item label="Brand" type="text" name="brand" disabled placeholder="Select" options={brandOptions}>
                <Field />
              </Form.Item>
            </Col>
            <Col>
              <Form.Item
                label="RAM Size"
                name="ram"
                placeholder="Select RAM Size"
                type="select"
                options={ramOptions}
                rules={[{ required: true }]}>
                <Field />
              </Form.Item>
            </Col>
            <Col>
              <Form.Item
                label="Storage Type"
                name="storageType"
                placeholder="Select Storage Type"
                type="select"
                options={storageTypeOptions}
                rules={[{ required: true }]}>
                <Field />
              </Form.Item>
            </Col>
          </Row>
          <Row className="mb-3">
            <Col>
              <Form.Item
                label="Storage Size"
                name="storageSize"
                type="select"
                placeholder="Select Storage Size"
                options={storageSizeOptions}
                rules={[{ required: true }]}>
                <Field />
              </Form.Item>
            </Col>
            <Col>
              <Form.Item
                label="Processor Name"
                name="processorName"
                type="select"
                placeholder="Select Processor Name"
                options={processorNameOptions}
                rules={[{ required: true }]}>
                <Field />
              </Form.Item>
            </Col>
            <Col>
              <Form.Item
                label="Processor Gen"
                name="processorGen"
                type="select"
                placeholder="Select Processor Gen"
                options={processorGenOptions}
                rules={[{ required: true }]}>
                <Field />
              </Form.Item>
            </Col>
          </Row>
          <Row className="mb-3">
            <Col>
              <Form.Item
                label="Graphics Card Type"
                name="graphicsCardType"
                type="select"
                placeholder="Select Graphic Card Type"
                options={graphicsCardTypeOptions}
                onChange={e => onChangeGraphicCardType(e)}>
                <Field />
              </Form.Item>
            </Col>
            <Col>
              <Form.Item
                label="Graphics Card Memory Size"
                name="graphicsCardMemorySize"
                type={graphicsCardFieldType}
                placeholder="Select..."
                disabled
                options={graphicsCardMemorySizes}>
                <Field />
              </Form.Item>
            </Col>
          </Row>
          <Row className="mb-3">
            <Col sm={6}>
              <Form.Item label="Price" name="price" type="number" placeholder="Price" rules={[{ required: true }]}>
                <Field />
              </Form.Item>
            </Col>
          </Row>
          <Row className="mb-3 justify-content-end">
            <Col xs="auto">
              <Button color="primary" type="submit">
                Update Variant
              </Button>
            </Col>
          </Row>
        </Form>
      </Col>
    </Row>
  );
};

export default ProductVariantModal;
