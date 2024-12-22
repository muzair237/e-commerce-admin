import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { Col, Row } from 'reactstrap';

import { handleApiCall, prepareProductFiltersData } from '@/helpers/common';
import productsThunk from '@/slices/products/thunk';
import Field from '@/components/Atoms/Field';
import Button from '@/components/Atoms/Button';
import { Toast } from '@/components/Molecules/Toast';
import Form, { useForm } from '../Form';

const ProductVariantModal = ({
  type,
  closeMeAndMyParent,
  productId,
  variant,
  productVariantData,
  setProductVariantData,
}) => {
  const dispatch = useDispatch();
  const [form] = useForm();
  const [isLoading, setIsLoading] = useState(false);
  const [isGraphicCardTypeDisabled, setIsGraphicCardTypeDisabled] = useState(true);

  const { productFilterOptions } = useSelector(state => state?.Product) || {};

  const {
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

    setIsGraphicCardTypeDisabled(!isValidValue);
  };

  const onSubmit = async values => {
    try {
      setIsLoading(true);
      const {
        ramSize,
        storageType,
        storageSize,
        processorName,
        processorGen,
        graphicsCardType,
        graphicsCardMemorySize,
        price,
      } = values;
      const payload = {
        storage: {
          size: storageSize?.label,
          type: storageType?.label,
        },
        ram: ramSize?.label,
        processor: {
          name: processorName?.label,
          generation: processorGen?.label,
        },
        graphicsCard: {
          type: graphicsCardType?.label,
          memory: graphicsCardMemorySize?.label,
          isGraphicsCard: !!graphicsCardType?.label,
        },
        price: parseInt(price, 10),
      };

      if (type === 'createFromStart') {
        // Check if the variant with same values (except price) already exists
        const variantExists = productVariantData.some(
          existingVariant =>
            existingVariant.ram === payload.ram &&
            existingVariant.storage.size === payload.storage.size &&
            existingVariant.storage.type === payload.storage.type &&
            existingVariant.processor.name === payload.processor.name &&
            existingVariant.processor.generation === payload.processor.generation &&
            existingVariant.graphicsCard.type === payload.graphicsCard.type &&
            existingVariant.graphicsCard.memory === payload.graphicsCard.memory,
        );

        if (variantExists) {
          Toast({
            type: 'error',
            message: 'This variant already exists (excluding price).',
          });
          setIsLoading(false);

          return;
        }

        setProductVariantData(prev => [...prev, payload]);
        closeMeAndMyParent();

        return;
      }

      let success;
      if (!productId) {
        success = await handleApiCall(dispatch, productsThunk.updateProductVariant, { id: variant?.id, payload });
      } else {
        success = await handleApiCall(dispatch, productsThunk.createProductVariant, { id: productId, payload });
      }

      if (success) {
        closeMeAndMyParent();
      }
    } catch {
      // eslint-disable-next-line no-console
      console.log(`Error while ${variant ? 'updating' : 'creating'} variant`);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (type !== 'createFromStart') {
      dispatch(productsThunk.getProductFilterOptions());
    }
  }, []);

  useEffect(() => {
    if (variant && Object.keys(variant)?.length > 0) {
      const {
        ram,
        price,
        storage: { size: storageSize, type: storageType } = {},
        processor: { name: processorName, generation: processorGen } = {},
        graphicsCard: { type: graphicsCardType, memory: graphicsCardMemory, isGraphicsCard } = {},
      } = variant;

      const findOption = (options, value) => options?.find(ele => ele.label === value) || { label: value, value };

      const formValues = {
        ramSize: findOption(ramOptions, ram),
        storageType: findOption(storageTypeOptions, storageType),
        storageSize: findOption(storageSizeOptions, storageSize),
        processorName: findOption(processorNameOptions, processorName),
        processorGen: findOption(processorGenOptions, processorGen),
        price,
      };

      if (isGraphicsCard) {
        formValues.graphicsCardType = findOption(graphicsCardTypeOptions, graphicsCardType);
        formValues.graphicsCardMemorySize = findOption(graphicsCardMemorySizes, graphicsCardMemory);
        setIsGraphicCardTypeDisabled(false);
        form.setFieldRules('graphicsCardMemorySize', [{ required: true }]);
      }

      form.setFieldsValue(formValues);
    }
  }, []);

  return (
    <Row>
      <Col lg={12}>
        <Form form={form} onSubmit={onSubmit}>
          <Row className="mb-3">
            <Col>
              <Form.Item
                label="RAM Size"
                name="ramSize"
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
                type="select"
                options={storageTypeOptions}
                rules={[{ required: true }]}>
                <Field />
              </Form.Item>
            </Col>
            <Col>
              <Form.Item
                label="Storage Size"
                name="storageSize"
                type="select"
                options={storageSizeOptions}
                rules={[{ required: true }]}>
                <Field />
              </Form.Item>
            </Col>
          </Row>
          <Row className="mb-3">
            <Col>
              <Form.Item
                label="Processor Name"
                name="processorName"
                type="select"
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
                options={graphicsCardTypeOptions}
                onChange={e => onChangeGraphicCardType(e)}>
                <Field />
              </Form.Item>
            </Col>
            <Col>
              <Form.Item
                label="Graphics Card Memory Size"
                name="graphicsCardMemorySize"
                type="select"
                disabled={isGraphicCardTypeDisabled}
                options={graphicsCardMemorySizes}>
                <Field />
              </Form.Item>
            </Col>
          </Row>
          <Row className="mb-3">
            <Col sm={6}>
              <Form.Item label="Price" name="price" type="number" placeholder="1200" rules={[{ required: true }]}>
                <Field />
              </Form.Item>
            </Col>
          </Row>
          <Row className="mb-3 justify-content-end">
            <Col xs="auto">
              <Button loading={isLoading} color="primary" type="submit">
                {type === 'createFromStart' ? 'Create' : productId ? 'Create' : 'Update'} Variant
              </Button>
            </Col>
          </Row>
        </Form>
      </Col>
    </Row>
  );
};

ProductVariantModal.propTypes = {
  type: PropTypes.oneOf(['createFromStart']),
  closeMeAndMyParent: PropTypes.func,
  productId: PropTypes.number,
  variant: PropTypes.shape({
    id: PropTypes.number,
    ram: PropTypes.string,
    price: PropTypes.number,
    storage: PropTypes.shape({
      size: PropTypes.string,
      type: PropTypes.string,
    }),
    processor: PropTypes.shape({
      name: PropTypes.string,
      generation: PropTypes.string,
    }),
    graphicsCard: PropTypes.shape({
      type: PropTypes.string,
      memory: PropTypes.string,
      isGraphicsCard: PropTypes.bool,
    }),
  }),
  productVariantData: PropTypes.shape({}),
  setProductVariantData: PropTypes.func,
};

export default ProductVariantModal;
