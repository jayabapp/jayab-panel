import { useSearchParams } from "next/navigation";
import { useMemo } from "react";
type KeyValue = Record<string, string>;

export function paramsToObject(entries: [string, string][]) {
  const result: KeyValue = {};
  for (const [key, value] of entries) {
    result[key] = value;
  }
  return result;
}

export const useQueryGet = <T>() => {
  const search = useSearchParams();
  const queries: KeyValue = useMemo(
    () => paramsToObject(Array.from(search?.entries())),
    [search]
  );
  return queries as T;
};
export default useQueryGet;
