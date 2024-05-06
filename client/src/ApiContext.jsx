/* eslint-disable react/prop-types */
/* eslint-disable react-refresh/only-export-components */
// ApiContext.js
import { createContext, useContext } from 'react';
import { ApiClient } from 'frt-api';

const ApiContext = createContext(null);

export const ApiProvider = ({ children }) => {
  const apiClient = new ApiClient('');
  
  return (
    <ApiContext.Provider value={apiClient}>
      {children}
    </ApiContext.Provider>
  );
};

export const useApiClient = () => {
  return useContext(ApiContext);
};
