import React, { createContext } from "react";

export type GlobalContextType = {
  setShouldShowDocumentsList: React.Dispatch<React.SetStateAction<boolean>>;
};

export const GlobalContext = createContext<GlobalContextType>({
  setShouldShowDocumentsList: () => {
    throw new Error("GlobalContext is not initialized");
  },
});
