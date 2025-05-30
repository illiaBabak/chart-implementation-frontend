import { JSX } from "react";
import { DropdownMenu } from "src/components/DropdownMenu";

export const App = (): JSX.Element => {
  return (
    <div className="flex bg-gray-200 w-screen h-screen p-8">
      <DropdownMenu />
    </div>
  );
};
