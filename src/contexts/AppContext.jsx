import { createContext, useEffect, useReducer } from "react";
import { reducer } from "../reducer";
import { getCities, getCityForecast } from "../services/api";

export const AppContext = createContext();

const initialState = {
  cities: [],
  inputValue: "",
  selectedCity: { cityName: "", forecast: [] },
};

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    async function getCitiesForecast() {
      try {
        const country = await getCities();

        console.log("CITIES data ::", country);

        dispatch({ type: "SET_CITIES", payload: country.data });
      } catch (error) {
        console.log(error);
      }
    }

    getCitiesForecast();
  }, []);

  function handleInputChange(event) {
    const { value } = event.target;

    console.log("Input Value:", value);

    dispatch({ type: "SET_SEARCH_INPUT", payload: value });
  }

  function handleChosenCity(globalIdLocal, cityName) {
    console.log("globalIdLocal: ", globalIdLocal);
    console.log("cityName:", cityName);

    dispatch({ type: "RESET_INPUT_VALUE" });

    async function getCityForecastById() {
      try {
        const cityForecast = await getCityForecast(globalIdLocal);

        console.log("CITY FORECAST ::", cityForecast);
        dispatch({
          type: "SET_SELECTED_CITY",
          payload: {
            cityName,
            forecast: cityForecast.data,
          },
        });
      } catch (error) {
        console.log(error.message);
      }
    }

    getCityForecastById();
  }

  return (
    <AppContext.Provider
      value={{ ...state, handleChosenCity, handleInputChange }}
    >
      {children}
    </AppContext.Provider>
  );
}
