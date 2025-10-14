import { useSearchParams } from "react-router-dom";

export const useUrlParams = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const getParam = (key: string) => searchParams.get(key);

  const setParam = (key: string, value: string) => {
    setSearchParams((prev) => {
      prev.set(key, value);
      return prev;
    });
  };

  const deleteParam = (key: string) => {
    setSearchParams((prev) => {
      prev.delete(key);
      return prev;
    });
  };

  return {
    getParam,
    setParam,
    deleteParam,
  };
};
