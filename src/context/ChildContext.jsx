import { createContext, useContext, useState } from 'react';
import { child as initialChild } from '../data/mockData';

const ChildContext = createContext(null);

export function ChildProvider({ children }) {
  const [childData, setChildData] = useState(initialChild);

  function updateChild(partial) {
    setChildData((prev) => ({ ...prev, ...partial }));
  }

  return (
    <ChildContext.Provider value={{ child: childData, updateChild }}>
      {children}
    </ChildContext.Provider>
  );
}

export function useChild() {
  const ctx = useContext(ChildContext);
  if (!ctx) throw new Error('useChild must be used within a ChildProvider');
  return ctx;
}
