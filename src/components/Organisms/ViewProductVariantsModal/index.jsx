import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { Row, Table, UncontrolledTooltip } from 'reactstrap';

import productsThunk from '@/slices/products/thunk';
import { MdOutlineModeEditOutline, MdDeleteOutline } from 'react-icons/md';
import { handleApiCall } from '@/helpers/common';
import Skeleton from '@/components/Atoms/Skeleton';
import ModalWrapper from '@/components/Molecules/ModalWrapper';
import ConfirmationModal from '@/components/Molecules/ConfirmationModal';
import ProductVariantModal from '../ProductVariantModal';

const ProductVariants = ({ closeMe, id }) => {
  const dispatch = useDispatch();
  const { productVariants } = useSelector(state => state?.Product) || [];
  const [isLoading, setIsLoading] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState();
  const [updateVariantModal, setUpdateVariantModal] = useState(false);
  const [deleteVariantModal, setDeleteVariantModal] = useState(false);

  const handleDeleteVariant = async () => {
    try {
      setIsLoading(true);
      const success = await handleApiCall(dispatch, productsThunk.deleteProductVariant, { id: selectedVariant?.id });

      if (success) {
        setDeleteVariantModal(false);
        setSelectedVariant(null);
        closeMe();
      }
    } catch ({ message }) {
      console.error('Error deleting variant: ', message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const fetchProductVariants = async () => {
      try {
        setIsLoading(true);
        await dispatch(productsThunk.getProductVariants({ id }));
      } catch ({ message }) {
        // eslint-disable-next-line no-console
        console.log('Error occurred while fetching product variants: ', message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProductVariants();
  }, [dispatch, id]);

  return (
    <>
      <Row className="mx-1">
        <Table className="table table-bordered border-secondary table-wrap rounded">
          <thead>
            <tr>
              {[
                { label: 'Id', colspan: 1 },
                { label: 'RAM', colspan: 1 },
                { label: 'Storage', colspan: 2 },
                { label: 'Processor', colspan: 2 },
                { label: 'Graphics Card', colspan: 1 },
                { label: 'Graphics Card Memory Size', colspan: 1 },
                { label: 'Quantity', colspan: 1 },
                { label: 'Price', colspan: 2 },
                { label: 'Actions', colspan: 2 },
              ].map(item => (
                <th key={item} scope="col" colSpan={item.colspan}>
                  {item.label}
                </th>
              ))}
            </tr>
            <tr>
              {['', '', 'Type', 'Size', 'Name', 'Generation', '', '', '', 'Cost Price', 'Sale Price', '', ''].map(
                label => (
                  <th key={label} scope="col">
                    {label}
                  </th>
                ),
              )}
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              Array.from({ length: 8 }).map(_ => (
                <tr key={_}>
                  {Array.from({ length: 13 }).map(_ => (
                    <td key={_}>
                      <Skeleton height="20px" width="100px" />
                    </td>
                  ))}
                </tr>
              ))
            ) : productVariants.length === 0 ? (
              <tr>
                <td colSpan="13" className="text-center">
                  <span className="fs-5">No variants found!</span>
                </td>
              </tr>
            ) : (
              productVariants.map((variant, index) => (
                <tr key={variant.id}>
                  <th scope="row">{index + 1}</th>
                  <td>{variant.ram}</td>
                  <td>{variant.storage.type}</td>
                  <td>{variant.storage.size}</td>
                  <td>{variant.processor.name}</td>
                  <td>{variant.processor.generation}</td>
                  <td>{variant.graphicsCard.isGraphicsCard ? `${variant.graphicsCard.type}` : 'No Graphics Card'}</td>
                  <td>{variant.graphicsCard.isGraphicsCard ? variant.graphicsCard.memory : 'N/A'}</td>
                  <td>{variant.quantity || 0}</td>
                  <td>{parseFloat(variant.costPrice).toFixed(2)} AED</td>
                  <td>{parseFloat(variant.salePrice).toFixed(2)} AED</td>
                  <td className="text-center">
                    <MdOutlineModeEditOutline
                      onClick={() => {
                        setSelectedVariant(variant);
                        setUpdateVariantModal(true);
                      }}
                      style={{ cursor: 'pointer' }}
                      color="green"
                      size={19}
                      id={`editVariant-${variant.id}`}
                    />
                    <UncontrolledTooltip placement="top" target={`editVariant-${variant.id}`}>
                      Edit Variant
                    </UncontrolledTooltip>
                  </td>
                  <td className="text-center">
                    <MdDeleteOutline
                      onClick={() => {
                        setSelectedVariant(variant);
                        setDeleteVariantModal(true);
                      }}
                      style={{ cursor: 'pointer' }}
                      color="red"
                      size={19}
                      id={`deleteVariant-${variant.id}`}
                    />
                    <UncontrolledTooltip placement="top" target={`deleteVariant-${variant.id}`}>
                      Delete Variant
                    </UncontrolledTooltip>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      </Row>

      {/* Update Product Variant Modal */}
      <ModalWrapper
        isOpen={updateVariantModal}
        toggle={() => setUpdateVariantModal(false)}
        title="Update Variant"
        backdrop="static"
        isContentCentered={false}>
        <ProductVariantModal
          closeMeAndMyParent={() => {
            setUpdateVariantModal(false);
            closeMe();
          }}
          variant={selectedVariant}
        />
      </ModalWrapper>

      {/* Delete Variant Modal */}
      <ModalWrapper
        isOpen={deleteVariantModal}
        toggle={() => setDeleteVariantModal(false)}
        title="Delete Variant"
        backdrop="static"
        isContentCentered={false}>
        <ConfirmationModal
          type="delete"
          message="Are you sure you want to delete this variant?"
          isLoading={isLoading}
          handleClick={handleDeleteVariant}
        />
      </ModalWrapper>
    </>
  );
};

ProductVariants.propTypes = {
  closeMe: PropTypes.func.isRequired,
  id: PropTypes.number.isRequired,
};

export default ProductVariants;
