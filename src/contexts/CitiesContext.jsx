import {
  useEffect,
  createContext,
  useContext,
  useReducer,
  useCallback,
} from "react";

const CitiesContext = createContext();
const BASE_URL = "http://localhost:8080";

const initialState = {
  cities: [],
  isLoading: false,
  currentCity: {},
  error: "",
};

function reducer(state, action) {
  switch (action.type) {
    case "loading":
      return { ...state, isLoading: true };
    case "cities/loaded":
      return { ...state, isLoading: false, cities: action.payload };
    case "city/loaded":
      return { ...state, isLoading: false, currentCity: action.payload };
    case "cities/created":
      return {
        ...state,
        isLoading: false,
        cities: [...state.cities, action.payload],
        currentCity: action.payload,
      };
    case "cities/deleted":
      return {
        ...state,
        isLoading: false,
        cities: state.cities.filter((c) => c.id !== action.payload),
        currentCity: {},
      };
    case "rejected": {
      return { ...state, isLoading: false, error: action.payload };
    }
    default:
      throw new Error("Unknown action");
  }
}

function CitiesProvider({ children }) {
  const [{ cities, isLoading, currentCity, error }, dispatch] = useReducer(
    reducer,
    initialState
  );

  useEffect(function () {
    async function fetchData() {
      dispatch({ type: "loading" });
      try {
        const res = await fetch(`${BASE_URL}/cities`);
        const data = await res.json();
        dispatch({ type: "cities/loaded", payload: data });
      } catch {
        dispatch({ type: "rejected", payload: "error while fetching data" });
      }
    }
    fetchData();
  }, []);

  const getCity = useCallback(
    async function getCity(id) {
      // id in City component, come from url => string, so we have to convert to number here
      if (Number(id) === currentCity.id) return;
      dispatch({ type: "loading" });
      try {
        const res = await fetch(`${BASE_URL}/cities/${id}`);
        const data = await res.json();
        dispatch({ type: "city/loaded", payload: data });
      } catch {
        dispatch({ type: "rejected", payload: "Error while fetching cities" });
      }
    },
    [currentCity.id]
  );

  async function createCity(city) {
    dispatch({ type: "loading" });
    try {
      const res = await fetch(`${BASE_URL}/cities/`, {
        method: "POST",
        body: JSON.stringify(city),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      // updates cities, manually in small app, using react-query to auto re-fetch new added data
      dispatch({ type: "cities/created", payload: data });
    } catch {
      dispatch({
        type: "rejected",
        payload: "Can't create city right now, please try again later",
      });
    }
  }

  async function deleteCity(id) {
    dispatch({ type: "loading" });
    try {
      const res = await fetch(`${BASE_URL}/cities/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      console.log(data);
      dispatch({ type: "cities/deleted", payload: id });
    } catch {
      dispatch({ type: "rejected", payload: "Delete city failed" });
    }
  }

  return (
    <CitiesContext.Provider
      value={{
        cities,
        isLoading,
        currentCity,
        error,
        getCity,
        createCity,
        deleteCity,
      }}
    >
      {children}
    </CitiesContext.Provider>
  );
}

function useCities() {
  const context = useContext(CitiesContext);
  if (context === undefined)
    throw new Error("Context was used outside Provider");
  return context;
}

export { CitiesProvider, useCities };
