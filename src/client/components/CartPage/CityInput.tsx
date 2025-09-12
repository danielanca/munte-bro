/* eslint-disable react/prop-types */
import React, { useEffect, useState, useRef } from "react";
import styles from "./CityInputs.module.scss";

interface Suggestion {
  name: string;
}

interface CityInputProps {
  onEasyboxSelect: (selectedCity: Suggestion) => void;
}

const CityInput: React.FC<CityInputProps> = ({ onEasyboxSelect }) => {
  const [inputValue, setInputValue] = useState("");
  const [suggestions, setSuggestions] = useState<any[]>([]); // Adjust type if necessary
  const options = { method: "GET", headers: { "X-API-KEY": "6e8bc29e91849d4556a72edf9bfa72a6" } };
  const [results, setResults] = useState<any[]>([]); // Assume results is an array
  const debounceTimeoutRef = useRef<number | null>(null);
  const [capitalSpecify, setSpecifyCapital] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const response = await fetch("https://api.smartship.ro/geolocation/easybox", options);
        const data = await response.json();
        setResults(data.easybox || []); // Adjust according to actual structure
        if (response.ok) {
          const jsonResponse = await response.json();
          console.log(jsonResponse);
        } else {
          console.error("Error sending order data to the API:", response.statusText);
        }
      } catch (error) {
        console.error(error);
      }
    })();
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
    if (value.toLowerCase().includes("buc")) {
      setSpecifyCapital(true);
    }
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }
    debounceTimeoutRef.current = window.setTimeout(() => {
      if (!value) {
        setSuggestions([]);
        setSpecifyCapital(false);
      } else {
        const searchTerms = value.toLowerCase().split(/\s+/); // Split input value into words
        const filteredResults = results.filter((item: any) =>
          searchTerms.every(
            (term: string) => item.name.toLowerCase().includes(term) || item.city.toLowerCase().includes(term),
          ),
        );
        setSuggestions(filteredResults);
      }
    }, 300);
  };

  const handleSuggestionClick = (easybox: any) => {
    setInputValue(`${easybox.name} ${easybox.city}`);
    setSuggestions([]);
    onEasyboxSelect(easybox);
  };

  useEffect(() => {
    console.log("Suggestions:", suggestions);
  }, [suggestions]);
  return (
    <div className={styles.cityInputsText}>
      <input type="text" value={inputValue} onChange={handleInputChange} placeholder="Oras sau Nume easybox" />
      {capitalSpecify && <p>{"Pentru capitală scrie DOAR Sectorul, fara oras. Exemplu: Sector 3"}</p>}
      {/* <input type="text" value={inputValue} onChange={handleInputChange} placeholder="Nume Easybox" /> */}
      {suggestions.length > 0 && (
        <ul>
          {suggestions.slice(0, 7).map((easybox, index) => (
            <li key={index} onClick={() => handleSuggestionClick(easybox)}>
              {`${easybox.name} ${easybox.city}`}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CityInput;
