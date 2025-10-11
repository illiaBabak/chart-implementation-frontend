import { createContext } from "react";

export type GlobalContextType = {
  setShouldShowDocumentsList: (shouldShowDocumentsList: boolean) => void;
};

export const GlobalContext = createContext<GlobalContextType>({
  setShouldShowDocumentsList: () => {
    throw new Error("GlobalContext is not initialized");
  },
});
