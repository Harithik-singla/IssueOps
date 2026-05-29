import { createContext, useContext, useState } from 'react';
import { mockWorkspaces } from '../data/mockData';

const WorkspaceContext = createContext(null);

export function WorkspaceProvider({ children }) {
  const [currentWorkspace, setCurrentWorkspace] = useState(mockWorkspaces[0]);

  const switchWorkspace = (workspace) => setCurrentWorkspace(workspace);

  return (
    <WorkspaceContext.Provider value={{ currentWorkspace, setCurrentWorkspace: switchWorkspace }}>
      {children}
    </WorkspaceContext.Provider>
  );
}

export const useWorkspace = () => {
  const ctx = useContext(WorkspaceContext);
  if (!ctx) throw new Error('useWorkspace must be used within WorkspaceProvider');
  return ctx;
};
