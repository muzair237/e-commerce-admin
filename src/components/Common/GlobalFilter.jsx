import React from 'react';
import { CardBody, Row } from 'reactstrap';
import { GeneralGlobalFilter, RoleGlobalFilter, AdminGlobalFilter } from './Filters';

const GlobalFilter = ({ isGeneralFilter, isRoleFilter, isAdminFilter, setFilters, ...props }) => (
  <CardBody className="border border-dashed border-end-0 border-start-0">
    <form>
      <Row className="g-3">
        {isGeneralFilter && <GeneralGlobalFilter setFilters={setFilters} />}
        {isRoleFilter && <RoleGlobalFilter setFilters={setFilters} />}
        {isAdminFilter && <AdminGlobalFilter setFilters={setFilters} {...props} />}
      </Row>
    </form>
  </CardBody>
);

export default GlobalFilter;
