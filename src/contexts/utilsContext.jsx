import React, { useState } from 'react';
import { createContextHook } from 'use-context-hook';

export const RefetchContext = createContextHook({});

function UtilsContextProvider(props) {
  // Add 'function' keyword here
  const [fetch, refetch] = useState(false);

  return (
    <RefetchContext.Provider
      value={{
        fetch,
        refetch,
      }}>
      {props.children}
    </RefetchContext.Provider>
  );
}

export default UtilsContextProvider;
