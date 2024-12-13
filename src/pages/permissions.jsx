import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Head from 'next/head';
import { Col, Container, Row, Card, CardHeader, UncontrolledTooltip } from 'reactstrap';
import { useDispatch, useSelector } from 'react-redux';
import { format } from 'date-fns';
import { MdOutlineModeEdit, MdDeleteOutline } from 'react-icons/md';
import { useContextHook } from 'use-context-hook';
import { RefetchContext } from '../contexts/refetchContext';
import withAuthProtection from '../components/Common/withAuthProtection';
import { permissionColumns } from '../common/columns';
import TableContainer from '../components/Common/TableContainer';
import BreadCrumb from '../components/Common/BreadCrumb';
import permissionThunk from '../slices/permissions/thunk';
import Button from '../components/Atoms/Button';
import PermissionModal from '../components/Organisms/PermissionModal';
import DeleteModal from '../components/Molecules/DeleteModal';

const Permissions = () => {
  const dispatch = useDispatch();
  const { refetch } = useContextHook(RefetchContext, v => ({
    refetch: v.refetch,
  }));
  const hasPermission = useSelector(state => state?.Auth?.hasPermission);
  const permissions = useSelector(state => state?.Permission?.permissions || {});
  const isLoading = useSelector(state => state?.Permission?.isLoading);

  const [permissionModal, setPermissionModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [permission, setPermission] = useState();
  const [permissionToDelete, setPermissionToDelete] = useState();
  const [filters, setFilters] = useState({
    page: 1,
    itemsPerPage: 10,
    getAll: false,
    startDate: '',
    endDate: '',
    searchText: '',
    sort: 'latest',
    type: '',
  });

  const setSearchQueryCallback = useCallback(newSearchQuery => {
    setFilters(newSearchQuery);
  }, []);

  const deletePermission = () => {
    dispatch(permissionThunk.deletePermission({ permissionToDelete, setDeleteModal, refetch }));
  };

  useEffect(() => {
    dispatch(permissionThunk.getAllPermissions(filters));
  }, [filters, fetch]);

  const actionBtns = _ => (
    <>
      <div className="d-flex gap-3">
        {hasPermission.includes('permissions.update') && (
          <div className="edit">
            <MdOutlineModeEdit
              style={{ cursor: 'pointer' }}
              onClick={() => {
                setPermission(_);
                setPermissionModal(true);
              }}
              color="green"
              size={19}
              id="edit"
            />
            <UncontrolledTooltip placement="top" target="edit">
              Edit
            </UncontrolledTooltip>
          </div>
        )}
        {hasPermission.includes('permissions.delete') && (
          <div className="remove">
            <MdDeleteOutline
              style={{ cursor: 'pointer' }}
              id="delete"
              size={19}
              color="red"
              onClick={() => {
                setPermissionToDelete(_?._id);
                setDeleteModal(true);
              }}
            />
            <UncontrolledTooltip placement="top" target="delete">
              Delete
            </UncontrolledTooltip>
          </div>
        )}
      </div>
    </>
  );
  const { permission_rows, totalCount } = useMemo(
    () => ({
      permission_rows: permissions?.items?.map(_ => [
        format(new Date(_?.createdAt), 'yyyy-MM-dd') || '------------',
        _?.can || '------------',
        _?.description || '------------',
        _?.group || '------------',
        actionBtns(_),
      ]),
      totalCount: permissions?.totalItems,
    }),
    [permissions],
  );

  return (
    <>
      <Head>
        <title>WebNova | PERMISSIONS</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <div className="page-content card-animate">
        <Container fluid>
          <BreadCrumb title="Permissions" />
          <Row>
            <Col lg={12}>
              <Card id="permissionList">
                <CardHeader>
                  <Row className="g-4 align-items-center">
                    <div className="col-sm">
                      <div>
                        <h5 className="card-title mb-0 fw-semibold">Permission List</h5>
                      </div>
                    </div>
                    {hasPermission.includes('permissions.create') && (
                      <div className="col-sm-auto">
                        <div>
                          <Button
                            onClick={() => {
                              setPermission();
                              setPermissionModal(true);
                            }}
                            type="button"
                            className="btn btn-success add-btn"
                            id="create-btn">
                            <i className="ri-add-line align-bottom me-1" /> Create Permission
                          </Button>
                        </div>
                      </div>
                    )}
                  </Row>
                </CardHeader>
                <div className="card-body pt-0">
                  <div>
                    <TableContainer
                      columns={permissionColumns}
                      data={permission_rows || []}
                      isGlobalFilter
                      isLoading={isLoading}
                      isPermissionFilter
                      currentPage={filters?.page}
                      totalCount={totalCount}
                      itemsPerPage={filters?.itemsPerPage}
                      setFilters={setSearchQueryCallback}
                    />
                  </div>
                </div>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
      {permissionModal && (
        <PermissionModal permission={permission} isOpen={permissionModal} setIsOpen={setPermissionModal} />
      )}
      {deleteModal && (
        <DeleteModal
          isOpen={deleteModal}
          setIsOpen={setDeleteModal}
          handleClick={deletePermission}
          message="Are you sure you Want to Delete this Permission?"
        />
      )}
    </>
  );
};

export default withAuthProtection(Permissions);
