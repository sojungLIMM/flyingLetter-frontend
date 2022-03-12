import { useState, useEffect } from "react";

function useGeoLocation() {
  const [location, setLocation] = useState({
    loaded: false,
    lat: "",
    lng: "",
  });

  useEffect(() => {
    if (!navigator.geolocation) {
      error({
        code: 0,
        message: "Geolocation is not supported by your browser",
      });

      return;
    }

    const watchId = navigator.geolocation.watchPosition(success, error);

    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  function success(location) {
    setLocation({
      loaded: true,
      lat: location.coords.latitude,
      lng: location.coords.longitude,
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
