import { useEffect, useState } from "react";
import axios from "axios";
import { url } from "../api/api";

interface LocationItem {
  id: number;
  name: string;
  status: number;
  country_id?: number;
  state_id?: number;
}

interface LocationState {
  countries: LocationItem[];
  states: LocationItem[];
  cities: LocationItem[];
}

const countriesData = [
  {
    id: 1,
    // sortname: "IN",
    name: "India",
    status: 1,
    // created_date: "2023-10-01T10:00:00Z",
    // modified_date: "2023-10-01T10:00:00Z",
  },
  {
    id: 2,
    // sortname: "US",
    name: "United States",
    status: 1,
    // created_date: "2023-10-01T10:00:00Z",
    // modified_date: "2023-10-01T10:00:00Z",
  },
];

const statesData = [
  {
    id: 1,
    name: "Maharashtra",
    country_id: 1,
    // zone: "west",
    // code: "MH",
    status: 1,
    // created_date: "2023-10-01T10:00:00Z",
    // modified_date: "2023-10-01T10:00:00Z",
  },
  {
    id: 2,
    name: "California",
    country_id: 2,
    // zone: "north",
    // code: "CA",
    status: 1,
    // created_date: "2023-10-01T10:00:00Z",
    // modified_date: "2023-10-01T10:00:00Z",
  },
];

const citiesData = [
  {
    id: 1,
    name: "Mumbai",
    state_id: 1,
    status: 1,
    // created_date: "2023-10-01T10:00:00Z",
    // updated_date: "2023-10-01T10:00:00Z",
  },
  {
    id: 2,
    name: "San Francisco",
    state_id: 2,
    status: 1,
    // created_date: "2023-10-01T10:00:00Z",
    // updated_date: "2023-10-01T10:00:00Z",
  },
];

const useLocationData = () => {
  const [countries, setCountries] = useState<LocationItem[]>(countriesData);
  const [states, setStates] = useState<LocationItem[]>(statesData);
  const [cities, setCities] = useState<LocationItem[]>(citiesData);

  // // Helper function to safely get data from localStorage
  // const getLocalStorageData = () => {
  //   try {
  //     const storedCountries = localStorage.getItem("countries");
  //     const storedStates = localStorage.getItem("states");
  //     const storedCities = localStorage.getItem("cities");

  //     return {
  //       countries: storedCountries ? JSON.parse(storedCountries) : null,
  //       states: storedStates ? JSON.parse(storedStates) : null,
  //       cities: storedCities ? JSON.parse(storedCities) : null,
  //     };
  //   } catch (error) {
  //     console.error("Error reading from localStorage:", error);
  //     return { countries: null, states: null, cities: null };
  //   }
  // };

  // // Helper function to safely set data in localStorage
  // const setLocalStorageData = (data: LocationState) => {
  //   try {
  //     localStorage.setItem("countries", JSON.stringify(data.countries));
  //     localStorage.setItem("states", JSON.stringify(data.states));
  //     localStorage.setItem("cities", JSON.stringify(data.cities));
  //   } catch (error) {
  //     console.error("Error writing to localStorage:", error);
  //   }
  // };

  // // Helper function to fetch data from API
  // const fetchFromAPI = async () => {
  //   try {
  //     const [countryRes, stateRes, cityRes] = await Promise.all([
  //       axios.get<{ data: LocationItem[] }>(`${url}/api/countries`),
  //       axios.get<{ data: LocationItem[] }>(`${url}/api/states`),
  //       axios.get<{ data: LocationItem[] }>(`${url}/api/cities`),
  //     ]);

  //     console.log({ countryRes });

  //     const locationData = {
  //       countries: countryRes.data.data,
  //       states: stateRes.data.data,
  //       cities: cityRes.data.data,
  //     };

  //     // Update state
  //     setCountries(locationData.countries);
  //     setStates(locationData.states);
  //     setCities(locationData.cities);

  //     // Store in localStorage
  //     setLocalStorageData(locationData);

  //     return locationData;
  //   } catch (error) {
  //     console.error("Error fetching location data:", error);
  //     return null;
  //   }
  // };

  const getLocationNames = (cityId: any, stateId: any, countryId: any) => {
    const cityName = cities.find((city) => city.id == cityId)?.name || "";
    const stateName = states.find((state) => state.id == stateId)?.name || "";
    const countryName =
      countries.find((country) => country.id == countryId)?.name || "";

    return {
      cityName,
      stateName,
      countryName,
    };
  };

  // useEffect(() => {
  //   const initializeData = async () => {
  //     // First try to get from localStorage
  //     const storedData = getLocalStorageData();

  //     if (
  //       storedData.countries?.length &&
  //       storedData.states?.length &&
  //       storedData.cities?.length
  //     ) {
  //       // Use stored data if available
  //       setCountries(storedData.countries);
  //       setStates(storedData.states);
  //       setCities(storedData.cities);
  //     } else {
  //       // Fetch from API if stored data is not available or incomplete
  //       await fetchFromAPI();
  //     }
  //   };

  //   initializeData();

  //   // Add event listener for storage changes (works across tabs)
  //   const handleStorageChange = (e: StorageEvent) => {
  //     if (e.key === "countries" || e.key === "states" || e.key === "cities") {
  //       const storedData = getLocalStorageData();
  //       if (storedData.countries && storedData.states && storedData.cities) {
  //         setCountries(storedData.countries);
  //         setStates(storedData.states);
  //         setCities(storedData.cities);
  //       }
  //     }
  //   };

  //   window.addEventListener("storage", handleStorageChange);

  //   return () => {
  //     window.removeEventListener("storage", handleStorageChange);
  //   };
  // }, []);

  return { countries, states, cities, getLocationNames };
};

export default useLocationData;
