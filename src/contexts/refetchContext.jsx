import React, { useState } from 'react';
import { createContextHook } from 'use-context-hook';

export const RefetchContext = createContextHook({});

function RefetchContextProvider(props) {
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

export default RefetchContextProvider;
