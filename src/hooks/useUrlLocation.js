import { useSearchParams } from "react-router-dom";

export function useUrlLocation() {
  const [query] = useSearchParams();
  const lat = query.get("lat");
  const lng = query.get("lng");

  return [lat, lng];
}
