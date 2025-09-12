import { useState, useEffect } from "react";
import config from "../Frame/configurations";

const useMoonData = (selectedDate: Date, reloadTrigger: number) => {
  const [moonPhase, setMoonPhase] = useState<string>(""); 
  const [moonEmoji, setMoonEmoji] = useState<string>(""); 
  const [moonIllumination, setMoonIllumination] = useState<string>("");

  useEffect(() => {
    const fetchMoonData = async () => {
      try {
        const url = `https://moon-phase.p.rapidapi.com/advanced?lat=51.4768&lon=-0.0004&date=${selectedDate.toISOString().split("T")[0]}`;
        const options = {
          method: 'GET',
          headers: {
            'x-rapidapi-key': config.APIKey || '', 
            'x-rapidapi-host': 'moon-phase.p.rapidapi.com',
          }
        };

        const response = await fetch(url, options);
        if (response.ok) {
          const data = await response.json();
          setMoonPhase(data.moon.phase_name); // Extract moon phase name
          setMoonEmoji(data.moon.emoji); // Extract moon emoji
          setMoonIllumination(data.moon.illumination); // Extract moon illumination percentage
        } else {
          console.error("Failed to fetch moon data", await response.json());
        }
      } catch (error) {
        console.error("Error fetching moon data:", error);
      }
    };

    fetchMoonData();
  }, [selectedDate, reloadTrigger]);

  return { moonPhase, moonEmoji, moonIllumination };
};

export default useMoonData;
