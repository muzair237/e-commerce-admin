import React from 'react';
import { useRouter } from 'next/router';

function withRouter(Component) {
  function ComponentWithRouterProp(props) {
    const router = useRouter();

    return <Component {...props} router={router} />;
  }

  return ComponentWithRouterProp;
}

export default withRouter;
