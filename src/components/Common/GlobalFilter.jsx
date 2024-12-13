import React from 'react';
import { CardBody, Row } from 'reactstrap';
import { PermissionGlobalFilter, RoleGlobalFilter, AdminGlobalFilter } from './Filters';

const GlobalFilter = ({ isPermissionFilter, isRoleFilter, isAdminFilter, setFilters, ...props }) => (
  <CardBody className="border border-dashed border-end-0 border-start-0">
    <form>
      <Row className="g-3">
        {isPermissionFilter && <PermissionGlobalFilter setFilters={setFilters} />}
        {isRoleFilter && <RoleGlobalFilter setFilters={setFilters} />}
        {isAdminFilter && <AdminGlobalFilter setFilters={setFilters} {...props} />}
      </Row>
    </form>
  </CardBody>
);

export default GlobalFilter;
