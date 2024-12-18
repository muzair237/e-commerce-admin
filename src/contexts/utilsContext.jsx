import React, { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import { createContextHook } from 'use-context-hook';

export const UtilsContext = createContextHook({});

function UtilsContextProvider({ children }) {
  const [refetch, setRefetch] = useState(false);

  // Use useMemo to stabilize the context value
  const contextValue = useMemo(() => ({ refetch, setRefetch }), [refetch, setRefetch]);

  return <UtilsContext.Provider value={contextValue}>{children}</UtilsContext.Provider>;
}

UtilsContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default UtilsContextProvider;
