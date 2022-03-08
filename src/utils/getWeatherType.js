function getWeatherType(typeId) {
  let currentWeather = typeId?.toString();

  switch (currentWeather) {
    case "800":
      currentWeather = "Clear";
      break;
    case "751":
    case "761":
      currentWeather = "Sand";
      break;
    case "762":
    case "771":
    case "781":
      currentWeather = "Tornado";
      break;
    default:
      if (currentWeather.startsWith("8")) {
        currentWeather = "Clouds";
        break;
      }

      if (currentWeather.startsWith("7")) {
        currentWeather = "Tornado";
        break;
      }

      if (currentWeather.startsWith("6")) {
        currentWeather = "Snow";
        break;
      }

      if (currentWeather.startsWith("2")) {
        currentWeather = "ThunderStorm";
        break;
      }

      if (currentWeather.startsWith("2") || currentWeather.startsWith("5")) {
        currentWeather = "Rain";
      }
  }

  return currentWeather;
}

export default getWeatherType;
