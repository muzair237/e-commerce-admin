import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Head from 'next/head';
import { Col, Container, Row, Card, CardHeader, UncontrolledTooltip } from 'reactstrap';
import { useDispatch, useSelector } from 'react-redux';
import { format } from 'date-fns';
import { MdOutlineModeEdit, MdDeleteOutline } from 'react-icons/md';
import { useContextHook } from 'use-context-hook';
import { RefetchContext } from '../contexts/refetchContext';
import withAuthProtection from '../components/Common/withAuthProtection';
import { roleColumns } from '../common/columns';
import TableContainer from '../components/Common/TableContainer';
import BreadCrumb from '../components/Common/BreadCrumb';
import roleThunk from '../slices/roles/thunk';
import Button from '../components/Atoms/Button';
import RoleModal from '../components/Organisms/RoleModal';
import DeleteModal from '../components/Molecules/DeleteModal';

const Roles = () => {
  const dispatch = useDispatch();
  const { fetch, refetch } = useContextHook(RefetchContext, v => ({
    fetch: v.fetch,
    refetch: v.refetch,
  }));
  const roles = useSelector(state => state?.Role?.roles || {});
  const isLoading = useSelector(state => state?.Role?.isLoading);
  const hasPermission = useSelector(state => state?.Auth?.hasPermission);

  const [roleModal, setRoleModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [role, setRole] = useState();
  const [roleToDelete, setRoleToDelete] = useState();
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

  const deleteRole = () => {
    dispatch(roleThunk.deleteRole({ roleToDelete, setDeleteModal, refetch }));
  };

  useEffect(() => {
    dispatch(roleThunk.getAllRoles(filters));
  }, [filters, fetch]);

  const actionBtns = _ => (
    <>
      <div className="d-flex gap-3">
        {hasPermission.includes('roles.update') && (
          <div className="edit">
            <MdOutlineModeEdit
              style={{ cursor: 'pointer' }}
              onClick={() => {
                setRole(_);
                setRoleModal(true);
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
        {hasPermission.includes('roles.delete') && (
          <div className="remove">
            <MdDeleteOutline
              style={{ cursor: 'pointer' }}
              id="delete"
              size={19}
              color="red"
              onClick={() => {
                setRoleToDelete(_?._id);
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
  const { role_rows, totalCount } = useMemo(
    () => ({
      role_rows: roles?.items?.map(_ => [
        format(new Date(_?.createdAt), 'yyyy-MM-dd') || '------------',
        _?.type || '------------',
        _?.description || '------------',
        actionBtns(_),
      ]),
      totalCount: roles?.totalItems,
    }),
    [roles?.items],
  );

  return (
    <>
      <Head>
        <title>WebNova | ROLES</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <div className="page-content card-animate">
        <Container fluid>
          <BreadCrumb title="Roles" />
          <Row>
            <Col lg={12}>
              <Card id="roleList">
                <CardHeader>
                  <Row className="g-4 align-items-center">
                    <div className="col-sm">
                      <div>
                        <h5 className="card-title mb-0 fw-semibold">Role List</h5>
                      </div>
                    </div>
                    {hasPermission.includes('roles.create') && (
                      <div className="col-sm-auto">
                        <div>
                          <Button
                            onClick={() => {
                              setRole();
                              setRoleModal(true);
                            }}
                            type="button"
                            className="btn btn-success add-btn"
                            id="create-btn">
                            <i className="ri-add-line align-bottom me-1" /> Create Role
                          </Button>{' '}
                        </div>
                      </div>
                    )}
                  </Row>
                </CardHeader>
                <div className="card-body pt-0">
                  <div>
                    <TableContainer
                      columns={roleColumns}
                      data={role_rows || []}
                      isGlobalFilter
                      isLoading={isLoading}
                      isRoleFilter
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
      {roleModal && <RoleModal role={role} isOpen={roleModal} setIsOpen={setRoleModal} />}
      {deleteModal && (
        <DeleteModal
          isOpen={deleteModal}
          setIsOpen={setDeleteModal}
          handleClick={deleteRole}
          message="Are you sure you Want to Delete this Role?"
        />
      )}
    </>
  );
};

export default withAuthProtection(Roles);
