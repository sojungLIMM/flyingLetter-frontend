import axios from "axios";

import { OPEN_WEATHER_API } from "../constants";

export async function getCurrentLocationData(lat, lon) {
  const res = await axios.get(
    `${OPEN_WEATHER_API}lat=${lat}&lon=${lon}&appid=${process.env.REACT_APP_OPEN_WEATHER_API_KEY}`
  );

  return res.data;
}
