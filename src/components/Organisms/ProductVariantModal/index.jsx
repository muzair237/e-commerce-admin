import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { Col, Row } from 'reactstrap';

import { getNestedValue, handleApiCall, prepareProductFiltersData } from '@/helpers/common';
import productsThunk from '@/slices/products/thunk';
import { amountRegex, integersRegex } from '@/helpers/regexes';
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
  modifyExisting,
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
        costPrice,
        salePrice,
        quantity,
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
        costPrice: parseInt(costPrice, 10),
        salePrice: parseInt(salePrice, 10),
        quantity: quantity ? parseInt(quantity, 10) : 0,
      };

      if (type === 'createFromStart') {
        const isUpdating = typeof modifyExisting === 'number';

        // Check if the variant already exists (ignoring price in both cases)
        const variantExistsIndex = productVariantData.findIndex((variant, index) => {
          const isDuplicate = [
            'ram',
            'storage.size',
            'storage.type',
            'processor.name',
            'processor.generation',
            'graphicsCard.type',
            'graphicsCard.memory',
          ].every(key => getNestedValue(variant, key) === getNestedValue(payload, key));

          return isUpdating ? isDuplicate && index !== modifyExisting : isDuplicate; // Skip the current index if updating
        });

        // If a match is found, show a toast message and exit
        if (variantExistsIndex !== -1) {
          Toast({
            type: 'error',
            message: `This variant matches Variant ${variantExistsIndex + 1}.`,
          });
          setIsLoading(false);

          return;
        }

        // Add or Update the variant
        setProductVariantData(prev => {
          const updatedVariants = [...prev];
          isUpdating ? (updatedVariants[modifyExisting] = payload) : updatedVariants.push(payload);

          return updatedVariants;
        });

        closeMeAndMyParent();
        setIsLoading(false);

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
        costPrice,
        salePrice,
        quantity,
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
        costPrice,
        salePrice,
        quantity: quantity || 0,
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
  console.log('form.getFieldsValue: ', form.getFieldsValue());

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
              <Form.Item
                label="Cost Price"
                name="costPrice"
                type="number"
                placeholder="1200.00"
                rules={[
                  { required: true },
                  {
                    pattern: amountRegex,
                    message: 'Enter a positive number greater than 0 with up to 2 decimal places.',
                  },
                ]}>
                <Field />
              </Form.Item>
            </Col>
            <Col sm={6}>
              <Form.Item
                label="Sale Price"
                name="salePrice"
                type="number"
                placeholder="1400.00"
                rules={[
                  { required: true },
                  {
                    pattern: amountRegex,
                    message: 'Enter a positive number greater than 0 with up to 2 decimal places.',
                  },
                ]}>
                <Field />
              </Form.Item>
            </Col>
          </Row>
          <Row className="mb-3">
            <Col sm={6}>
              <Form.Item
                label="Quantity"
                name="quantity"
                type="number"
                placeholder="100"
                rules={[{ pattern: integersRegex, message: 'Please enter a positive integer (no decimals).' }]}>
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
    costPrice: PropTypes.number,
    salePrice: PropTypes.number,
    quantity: PropTypes.number,
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
  modifyExisting: PropTypes.number,
};

export default ProductVariantModal;
