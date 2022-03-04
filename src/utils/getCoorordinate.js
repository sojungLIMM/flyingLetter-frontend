function getCoorordinate(origin, destination, totalNumber, elapsedNumber) {
  const lat1 = origin[0];
  const lng1 = origin[1];
  const lat2 = destination[0];
  const lng2 = destination[1];

  const totalLat = Math.abs(lat1 - lat2);
  const totalLng = Math.abs(lng1 - lng2);

  const singleLatMove = totalLat / totalNumber;
  const singleLngMove = totalLng / totalNumber;

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

export default getCoorordinate;
