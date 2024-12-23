import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { Row, Col } from 'reactstrap';

import { convertToFormData, handleApiCall, prepareProductFiltersData, traverseAndModifyObject } from '@/helpers/common';
import productsThunk from '@/slices/products/thunk';
import Field from '@/components/Atoms/Field';
import ModalWrapper from '@/components/Molecules/ModalWrapper';
import Button from '@/components/Atoms/Button';
import Form, { useForm } from '../Form';
import ProductVariantModal from '../ProductVariantModal';

const ProductModal = ({ product, closeMe }) => {
  const dispatch = useDispatch();
  const [form] = useForm();
  const { images } = product;
  const [isLoading, setIsLoading] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState({});
  const [productVariantData, setProductVariantData] = useState([]);
  const [productVariantModal, setProductVariantModal] = useState(false);
  const [currentVariantNumber, setCurrentVariantNumber] = useState(false);

  const { productFilterOptions } = useSelector(state => state?.Product) || {};

  const { brandOptions, screenSizeOptions } = prepareProductFiltersData(productFilterOptions);

  const onSubmit = async values => {
    const { images, ...rest } = values;

    try {
      setIsLoading(true);

      const productPayload = {
        ...traverseAndModifyObject(rest),
        name: rest?.model,
        brandId: rest.brandId?.value,
        images: images || [],
      };

      let success;
      if (Object.keys(product)?.length > 0) {
        const formData = convertToFormData(productPayload);
        success = await handleApiCall(dispatch, productsThunk.updateProduct, {
          id: product?.id,
          payload: formData,
        });
      } else {
        success = await handleApiCall(dispatch, productsThunk.createProduct, {
          payload: convertToFormData({
            product: productPayload,
            variations: productVariantData,
          }),
        });
      }

      if (success) {
        closeMe();
      }
    } catch ({ message }) {
      // eslint-disable-next-line no-console
      console.log('Error in creating product: ', message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    dispatch(productsThunk.getProductFilterOptions());
  }, []);

  useEffect(() => {
    if (Object.keys(product)?.length > 0) {
      form.setFieldsValue({
        model: product?.model,
        brandId: brandOptions?.find(ele => ele?.value === product?.brandId),
        images: product?.images,
        screenSize: screenSizeOptions?.find(ele => ele?.label === product?.screenSize),
        description: product?.description,
      });
    }
  }, [brandOptions, screenSizeOptions]);

  return (
    <>
      <Row>
        <Col lg={12}>
          <Form form={form} onSubmit={onSubmit}>
            <Row className="mb-3">
              <Col>
                <Form.Item
                  label="Model"
                  name="model"
                  placeholder="HP Spectre x360 16"
                  type="text"
                  rules={[{ required: true }]}>
                  <Field />
                </Form.Item>
              </Col>
              <Col>
                <Form.Item
                  label="Brand"
                  name="brandId"
                  placeholder="Brand"
                  type="select"
                  options={brandOptions}
                  rules={[{ required: true }]}>
                  <Field />
                </Form.Item>
              </Col>
              <Col>
                <Form.Item
                  label="Screen Size"
                  name="screenSize"
                  placeholder="Select Screen Size"
                  type="select"
                  options={screenSizeOptions}
                  rules={[{ required: true }]}>
                  <Field />
                </Form.Item>
              </Col>
            </Row>
            <Row className="mb-3">
              <Form.Item
                label="Images"
                name="images"
                placeholder="Select Product Images"
                multiple
                maxFiles={4}
                displayFile={images || null}
                type="file"
                options={screenSizeOptions}
                rules={[{ required: true }]}>
                <Field />
              </Form.Item>
            </Row>
            <Row className="mb-3">
              <Col>
                <Form.Item
                  label="Description"
                  name="description"
                  placeholder="Enter a brief description about the product, including its features and specifications."
                  type="textarea"
                  rules={[{ required: true }]}
                  rows="3">
                  <Field />
                </Form.Item>
              </Col>
            </Row>
            {productVariantData?.length > 0 && (
              <Row className="mb-3">
                <h5 className="text-dark">Variants:</h5>
                {productVariantData?.map((ele, index) => (
                  <Col key={ele} xs="auto">
                    <Button
                      onClick={() => {
                        setCurrentVariantNumber(index);
                        setSelectedVariant(ele);
                        setProductVariantModal(true);
                      }}
                      color="secondary">
                      Variant {index + 1}
                    </Button>
                  </Col>
                ))}
              </Row>
            )}
            <Row className="mb-3 justify-content-between">
              {!Object.keys(product)?.length > 0 && (
                <Col>
                  <Button
                    onClick={() => {
                      setCurrentVariantNumber();
                      setSelectedVariant({});
                      setProductVariantModal(true);
                    }}
                    type="button"
                    color="danger">
                    Add Variant
                  </Button>
                </Col>
              )}
              <Col className="text-end">
                <Button type="submit" loading={isLoading} color="primary">
                  {Object.keys(product)?.length > 0 ? 'Update Product' : 'Create Product'}
                </Button>
              </Col>
            </Row>
          </Form>
        </Col>
      </Row>

      {/* Product Variants Modal */}
      <ModalWrapper
        isOpen={productVariantModal}
        toggle={() => setProductVariantModal(false)}
        title="Create Variant"
        size="md"
        backdrop="static"
        isContentCentered={false}>
        <ProductVariantModal
          type="createFromStart"
          variant={selectedVariant}
          closeMeAndMyParent={() => {
            setProductVariantModal(false);
          }}
          productVariantData={productVariantData}
          setProductVariantData={setProductVariantData}
          modifyExisting={currentVariantNumber}
        />
      </ModalWrapper>
    </>
  );
};

ProductModal.propTypes = {
  product: PropTypes.shape({}),
  closeMe: PropTypes.func.isRequired,
};

export default ProductModal;
