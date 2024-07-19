import { useState } from "react";
import axios from "axios";
import TimeZoneDisplay from "./TimeZoneDisplay";
import "./App.css";

const apiBaseURL = import.meta.env.VITE_API_BASE_URL;
if (!apiBaseURL) {
    throw new Error("missing import.meta.env.VITE_API_BASE_URL");
}

function App() {
  const [timeZones, setTimeZones] = useState([]);
  const [newCity, setNewCity] = useState("");
  const [newOffset, setNewOffset] = useState("");

  const fetchTimeZones = async () => {
    try {
      const url = apiBaseURL + "/timezones";
      const response = await axios.get(url
      );
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

  const addTimeZone = async () => {
    try {
      const url = apiBaseURL + "/timezones";
      const response = await axios.post(url,
        {
          city: newCity,
          utcoffset: parseInt(newOffset, 10),
        }
      );
      setTimeZones([
        ...timeZones,
        {
          ...response.data,
          time: calculateLocalTime(response.data.utcoffset),
        },
      ]);
      setNewCity("");
      setNewOffset("");
    } catch (error) {
      console.error("Failed to add timezone:", error);
    }
  };

  function calculateLocalTime(offset) {
    const date = new Date();
    let localHours = date.getUTCHours() + offset;
    const mins = date.getUTCMinutes();

    if (localHours >= 24) {
      localHours -= 24;
    } else if (localHours < 0) {
      localHours += 24;
    }

    return `${localHours.toString().padStart(2, "0")}:${mins
      .toString()
      .padStart(2, "0")}`;
  }

  return (
    <div>
      <h1>Some Global Time Zones:</h1>
      <button className = "button" onClick={fetchTimeZones}>Load Time Zones</button>
      <div>
        {timeZones.map((tz) => (
          <TimeZoneDisplay key={tz.id} city={tz.city} time={tz.time} />
        ))}

        <textarea
          value={newCity}
          onChange={(e) => setNewCity(e.target.value)}
          placeholder="Enter city name"
        />
        <textarea
          value={newOffset}
          onChange={(e) => setNewOffset(e.target.value)}
          placeholder="Enter UTC offset"
        />
        <button className = "button" onClick = {addTimeZone}>Add A Time Zone</button>
      </div>
    </div>
  );
}

export default App;
