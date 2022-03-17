function getCoordinate(origin, destination, totalNumber, elapsedNumber) {
  const lat1 = origin[0];
  const lng1 = origin[1];
  const lat2 = destination[0];
  const lng2 = destination[1];

  const totalLat = Math.abs(lat1 - lat2);
  const totalLng = Math.abs(lng1 - lng2);

  const singleLatMove = totalLat / totalNumber;
  const singleLngMove = totalLng / totalNumber;

  if (totalLat === 0) {
    let currentLng;

    if (lng1 > lng2) {
      currentLng = lng1 - singleLngMove * elapsedNumber;
    }

    if (lng1 < lng2) {
      currentLng = lng1 + singleLngMove * elapsedNumber;
    }

    return [lat1, parseFloat(currentLng)];
  }

  if (totalLng === 0) {
    let currentLat;

    if (lat1 > lat2) {
      currentLat = lat1 - singleLatMove * elapsedNumber;
    }

    if (lat1 < lat2) {
      currentLat = lat1 + singleLatMove * elapsedNumber;
    }

    return [parseFloat(currentLat), lng1];
  }

  if (lat1 > lat2 && lng1 < lng2) {
    const currentLat = lat1 - singleLatMove * elapsedNumber;
    const currentLng = lng1 + singleLngMove * elapsedNumber;

    return [parseFloat(currentLat), parseFloat(currentLng)];
  }

  if (lat1 < lat2 && lng1 > lng2) {
    const currentLat = lat1 + singleLatMove * elapsedNumber;
    const currentLng = lng1 - singleLngMove * elapsedNumber;

    return [parseFloat(currentLat), parseFloat(currentLng)];
  }

  if (lat1 > lat2 && lng1 > lng2) {
    const currentLat = lat1 - singleLatMove * elapsedNumber;
    const currentLng = lng1 - singleLngMove * elapsedNumber;

    return [parseFloat(currentLat), parseFloat(currentLng)];
  }

  if (lat1 < lat2 && lng1 < lng2) {
    const currentLat = lat1 + singleLatMove * elapsedNumber;
    const currentLng = lng1 + singleLngMove * elapsedNumber;

    return [parseFloat(currentLat), parseFloat(currentLng)];
  }
}

export default getCoordinate;
