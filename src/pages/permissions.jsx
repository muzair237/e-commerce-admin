import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Head from 'next/head';
import { useDispatch, useSelector } from 'react-redux';
import { Col, Container, Row, Card, CardHeader, UncontrolledTooltip } from 'reactstrap';
import { useContextHook } from 'use-context-hook';
import { MdDeleteOutline, MdOutlineModeEdit } from 'react-icons/md';
import { format } from 'date-fns';

import permissionsThunk from '@/slices/permissions/thunk';
import { permissionColumns } from '@/common/columns';
import { UtilsContext } from '@/contexts/utilsContext';
import { handleApiCall } from '@/helpers/common';
import BreadCrumb from '@/components/Common/BreadCrumb';
import TableContainer from '@/components/Common/TableContainer';
import ModalWrapper from '@/components/Molecules/ModalWrapper';
import PermissionModal from '@/components/Organisms/PermissionModal';
import Button from '@/components/Atoms/Button';
import withAuthProtection from '@/components/Common/withAuthProtection';
import ConfirmationModal from '@/components/Molecules/ConfirmationModal';

const Permissions = () => {
  const dispatch = useDispatch();
  const [currentPermission, setCurrentPermission] = useState({});
  const [permissionModal, setPermissionModal] = useState(false);
  const [deletePermissionModal, setDeletePermissionModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { permissions } = useSelector(state => state?.Permission) || {};
  const { tableLoading } = useSelector(state => state?.Permission) || false;
  const { refetch, setRefetch } = useContextHook(UtilsContext, ['refetch', 'setRefetch']);

  const [filters, setFilters] = useState({
    page: 1,
    itemsPerPage: 10,
    getAll: false,
    startDate: '',
    endDate: '',
    searchText: '',
    sort: 'latest',
  });

  const setSearchQueryCallback = useCallback(newSearchQuery => {
    setFilters(newSearchQuery);
  }, []);

  const handleDeletePermission = async () => {
    try {
      setIsLoading(true);
      const success = await handleApiCall(dispatch, permissionsThunk.deletePermission, { id: currentPermission?.id });

      if (success) {
        setDeletePermissionModal(false);
        setCurrentPermission({});
        setRefetch(prev => !prev);
      }
    } catch ({ message }) {
      console.error('Error deleting permission: ', message);
    } finally {
      setIsLoading(false);
    }
  };

  const actionBtns = _ => (
    <div className="d-flex gap-3">
      <div className="edit">
        <MdOutlineModeEdit
          style={{ cursor: 'pointer' }}
          onClick={() => {
            setCurrentPermission(_);
            setPermissionModal(true);
          }}
          color="green"
          size={19}
          id="edit"
        />
        <UncontrolledTooltip placement="top" target="edit">
          Edit Permission
        </UncontrolledTooltip>
      </div>
      <div className="deletePermission">
        <MdDeleteOutline
          style={{ cursor: 'pointer' }}
          onClick={() => {
            setCurrentPermission(_);
            setDeletePermissionModal(true);
          }}
          color="red"
          size={19}
          id="deletePermission"
        />
        <UncontrolledTooltip placement="top" target="deletePermission">
          Delete Permission
        </UncontrolledTooltip>
      </div>
    </div>
  );

  const { permissions_rows, totalCount } = useMemo(
    () => ({
      permissions_rows: permissions?.items?.map(_ => [
        format(new Date(_?.created_at), 'MMMM dd, yyyy') || '------------',
        _?.can || '------------',
        _?.description || '------------',
        actionBtns(_),
      ]),
      totalCount: permissions?.totalItems,
    }),
    [permissions],
  );

  useEffect(() => {
    dispatch(permissionsThunk.getAllPermissions(filters));
  }, [filters, refetch]);

  return (
    <>
      <Head>
        <title>WebNova | PERMISSIONS</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>

      <div className="page-content">
        <Container fluid>
          <BreadCrumb title="Permissions" />
          <Row>
            <Col lg={12}>
              <Card id="permissionList">
                <CardHeader>
                  <Row className="g-4 align-items-center">
                    <div className="col-sm">
                      <div>
                        <h5 className="card-title mb-0 fw-semibold">Permissions</h5>
                      </div>
                    </div>
                    <div className="col-sm-auto">
                      <div>
                        <Button
                          onClick={() => {
                            setCurrentPermission({});
                            setPermissionModal(true);
                          }}
                          type="button"
                          className="btn btn-dark add-btn"
                          id="create-btn">
                          <i className="ri-add-line align-bottom me-1" /> Create Permission
                        </Button>
                      </div>
                    </div>
                  </Row>
                </CardHeader>
                <div className="card-body pt-0">
                  <div>
                    <TableContainer
                      columns={permissionColumns}
                      data={permissions_rows || []}
                      isLoading={tableLoading}
                      isGeneralGlobalFilter
                      currentPage={+filters?.page}
                      totalCount={+totalCount}
                      itemsPerPage={+filters?.itemsPerPage}
                      setFilters={setSearchQueryCallback}
                    />
                  </div>
                </div>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>

      {/* Permission Modal */}
      <ModalWrapper
        isOpen={permissionModal}
        toggle={() => setPermissionModal(false)}
        title={Object.keys(currentPermission)?.length > 0 ? 'Update Permission' : 'Create Permission'}
        size="md"
        backdrop="static"
        isContentCentered={false}>
        <PermissionModal
          permission={currentPermission}
          closeMe={() => {
            setPermissionModal(false);
            setRefetch(prev => !prev);
          }}
        />
      </ModalWrapper>

      {/* Delete Permission Confirmation Modal */}
      <ModalWrapper
        isOpen={deletePermissionModal}
        toggle={() => setDeletePermissionModal(false)}
        title="Delete Permission"
        backdrop="static"
        isContentCentered={false}>
        <ConfirmationModal
          type="delete"
          message="Are you sure you want to delete this permission?"
          isLoading={isLoading}
          handleClick={handleDeletePermission}
        />
      </ModalWrapper>
    </>
  );
};

export default withAuthProtection(Permissions);
