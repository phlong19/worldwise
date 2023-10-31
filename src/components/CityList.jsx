import styles from "./CityList.module.css";
import Spinner from "./Spinner";
import CityItem from "./CityItem";

function CityList({ cities, isLoading }) {
  if (isLoading) return <Spinner />;
  return (
    <ul className={styles.cityList}>
      {cities.map((c) => (
        <CityItem key={c.id} city={c} />
      ))}
    </ul>
  );
}

export default CityList;
