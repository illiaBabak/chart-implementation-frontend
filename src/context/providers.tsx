import { GlobalContext, GlobalContextType } from "./contexts";
import { ReactNode } from "react";

type GlobalProviderProps = {
  children: ReactNode;
  value: GlobalContextType;
};

export const GlobalProvider = ({ children, value }: GlobalProviderProps) => (
  <GlobalContext.Provider value={value}>{children}</GlobalContext.Provider>
);
