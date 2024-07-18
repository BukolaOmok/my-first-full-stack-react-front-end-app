import { useEffect, useState } from "react";
import axios from "axios";
import TimeZoneDisplay from "./TimeZoneDisplay";
import "./App.css";

function App() {
  const [timeZones, setTimeZones] = useState([]);

  useEffect(() => {
    const fetchTimeZones = async () => {
      try {
        const response = await axios.get("https://my-first-full-stack-react-app-backend.onrender.com/timezones");
        setTimeZones(
          response.data.map((tz) => ({
            ...tz,
            time: calculateLocalTime(tz.utcoffset),
          }))
        );
      } catch (error) {
        console.error("Failed to fetch time zones:", error);
      }
    };
    fetchTimeZones();
  }, []);

  function calculateLocalTime(offset) {
    const date = new Date();
    let localHours = date.getUTCHours() + offset;
    const mins = date.getUTCMinutes();

    if (localHours >= 24) {
      localHours -= 24;
    } else if (localHours < 0) {
      localHours += 24;
    }

    return `${localHours.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}`;
  }

  return (
    <div>
      <h1>Some Global Time Zones:</h1>
      {timeZones.map((tz) => (
        <TimeZoneDisplay key={tz.id} city={tz.city} time={tz.time} />
      ))}
    </div>
  );
}

export default App;