import styles from "./CountryList.module.css";
import Spinner from "./Spinner";
import CountryItem from "./CountryItem";
import Message from "./Message";
import { useCities } from "../contexts/CitiesContext";

function CountryList() {
  const { cities, isLoading } = useCities();

  if (isLoading) return <Spinner />;
  if (!cities.length)
    return <Message message="Add your first city by clicking on the map" />;

  const countries = cities.reduce((arr, cur) => {
    if (!arr.map((c) => c.country).includes(cur.country)) {
      return [...arr, { country: cur.country, emoji: cur.emoji }];
    } else return arr;
  }, []);

  return (
    <ul className={styles.countryList}>
      {countries.map((c) => (
        <CountryItem key={c.country} country={c} />
      ))}
    </ul>
  );
}

export default CountryList;
