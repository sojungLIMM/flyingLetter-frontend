import { useState, useEffect } from "react";

function useGeoLocation() {
  const [location, setLocation] = useState({
    loaded: false,
    coordinates: { lat: "", lng: "" },
  });

  useEffect(() => {
    if (!("geolocation" in navigator)) {
      error({
        code: 0,
        message: "Geolocation is not supported by your browser",
      });
    }

    navigator.geolocation.getCurrentPosition(success, error);
  }, []);

  function success(location) {
    setLocation({
      loaded: true,
      coordinates: {
        lat: location.coords.latitude,
        lng: location.coords.longitude,
      },
    });
  }

  function error(error) {
    setLocation({
      loaded: true,
      error: {
        code: error.code,
        message: error.message,
      },
    });
  }

  return location;
}

export default useGeoLocation;
