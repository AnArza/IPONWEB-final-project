import { createContext, useState } from "react";

export const AdOpsContext = createContext({
  isAdOps: false,
  setIsAdOps: () => {},
});

export const AdOpsProvider = ({ children }) => {
  const [isAdOps, setIsAdOps] = useState(
    JSON.parse(localStorage.getItem("isAdOps")) || false
  );

  return (
    <AdOpsContext.Provider value={{ isAdOps, setIsAdOps }}>
      {children}
    </AdOpsContext.Provider>
  );
};
