import React, { useEffect, useState, useRef } from "react";
import styles from "./CountyInput.module.scss";

interface Suggestion {
  name: string;
}

interface CityInputProps {
  onCountySelect: (selectedCity: Suggestion) => void;
}

interface citiesType {
  id: number;
  county: string;
  city: string;
}

/**
 * CountyInput Component
 *
 * This component allows users to search for cities and counties from an external API. It features a debounced input
 * field that provides city and county suggestions as the user types. The suggestions are fetched from a public API
 * and filtered based on the user's input.
 *
 * Props:
 * - onCountySelect: A callback function that is triggered when the user selects a city-county pair from the suggestions.
 *
 * State:
 * - inputValue: The current value entered by the user in the input field.
 * - countySuggestions: A list of city-county pairs that match the user's search input.
 * - results: A list of all available cities fetched from the API.
 *
 * Effects:
 * - Fetches a list of cities from the API based on county IDs and stores them in the `results` state on initial render.
 * - Cleans up any pending debounce timeouts when the component is unmounted.
 *
 * Features:
 * - Debounced input: Ensures that the suggestions are updated only after the user stops typing for a specified time (300ms).
 * - API Integration: Fetches cities from the `smartship.ro` API and handles errors gracefully.
 * - Real-time filtering: Filters the list of cities and counties based on the user's input and displays suggestions.
 * - User selection: Allows the user to click on a suggestion, which updates the input field and triggers the `onCountySelect` callback.
 *
 * @param {CityInputProps} - Props passed to this component
 * @returns {JSX.Element} - The rendered input field with suggestions
 */

const CountyInput: React.FC<CityInputProps> = ({ onCountySelect }) => {
  const [inputValue, setInputValue] = useState("");
  const [countySuggestions, setCountySuggestions] = useState<any[]>([]); // Adjust type if necessary
  const [results, setResults] = useState<any[]>([]);
  const debounceTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    const fetchCities = async () => {
      const countyIds = Array.from({ length: 42 }, (_, index) => index + 1);
      let allCities: citiesType[] = [];

      for (const countyId of countyIds) {
        try {
          const response = await fetch(`https://api.smartship.ro/geolocation/cities?county=${countyId}`);
          if (!response.ok) {
            throw new Error("Network response was not ok.");
          }
          const data = await response.json();
          allCities = allCities.concat(data.cities || []);
        } catch (error) {
          console.error("There was a problem with the fetch operation:", error);
        }
      }
      setResults(allCities);
    };

    fetchCities();
  }, []);

  useEffect(() => {
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, []);

  const handleInputChange = (e: any) => {
    const value = e.target.value;
    setInputValue(value);
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }
    debounceTimeoutRef.current = window.setTimeout(() => {
      if (!value) {
        setCountySuggestions([]);
      } else {
        const searchTerms = value.toLowerCase().split(/\s+/);
        const filteredResults = results.filter((item: any) =>
          searchTerms.every(
            (term: string) => item.city.toLowerCase().includes(term) || item.county.toLowerCase().includes(term)
          )
        );
        setCountySuggestions(filteredResults);
      }
    }, 300);
  };

  const handleSuggestionClick = (cities: any) => {
    setInputValue(`${cities.city},jud.${cities.county}`);
    setCountySuggestions([]);
    onCountySelect(cities);
  };

  useEffect(() => {
    console.log("County Suggestions:", countySuggestions);
  }, [countySuggestions]);

  return (
    <div className={styles.cityInputsText}>
      <input type='text' value={inputValue} onChange={handleInputChange} placeholder='Oras sau nume Judet'  autoComplete="off"/>
      {countySuggestions.length > 0 && (
        <ul>
          {countySuggestions.slice(0, 7).map((cities, index) => (
            <li key={index} onClick={() => handleSuggestionClick(cities)}>
              {`${cities.city}, jud.${cities.county}`}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CountyInput;
