import { useNavigate, useSearchParams } from "react-router-dom";
import styles from "./Map.module.css";

function Map() {
  const navigate = useNavigate();
  const [query, setQuery] = useSearchParams();
  const lat = query.get("lat");
  const lng = query.get("lng");

  return (
    <div className={styles.mapContainer} onClick={() => navigate("form")}>
      <h1>
        map position: {lat} & {lng}
      </h1>
    </div>
  );
}

export default Map;
