import React from "react";
import { Marker } from "react-leaflet";
import { divIcon, Icon } from "leaflet";
import PropTypes from "prop-types";

import pinkLetter from "../../assets/pinkLetter.png";
import snowboarder from "../../assets/snowboarder.png";
import umbrella from "../../assets/umbrella.png";
import mask from "../../assets/mask.png";

const letterMarker = new Icon({
  iconUrl: pinkLetter,
  iconSize: [35, 35],
});

const fogMarker = new divIcon({
  className: "icon-css",
  html: `<div class="fog"><img src=${pinkLetter} /></div>`,
  iconSize: [35, 35],
});

const sandMarker = new divIcon({
  className: "icon-css",
  html: `<div class="sand"><img src=${mask} /></div>`,
  iconSize: [35, 35],
});

const clearMarker = new divIcon({
  className: "icon-css",
  html: `<div class="clear"><img src=${pinkLetter} /></div>`,
  iconSize: [35, 35],
});

const snowBoarderMarker = new divIcon({
  className: "icon-css",
  html: `<div class="snow"><img src=${snowboarder} /></div>`,
  iconSize: [45, 45],
});

const cloudsMarker = new divIcon({
  className: "icon-css",
  html: `<div class="clouds"><div class="cloud one"></div><img src=${pinkLetter} /><div class="cloud"></div></div>`,
  iconSize: [60, 60],
});

const rainMarker = new divIcon({
  className: "icon-css",
  html: `<div class="rain"><img src=${umbrella} /></div>`,
  iconSize: [35, 35],
});

function FlyingMarker({ type, position }) {
  let icon = type;

  switch (icon) {
    case "Clear":
      icon = clearMarker;
      break;
    case "Clouds":
      icon = cloudsMarker;
      break;
    case "Snow":
      icon = snowBoarderMarker;
      break;
    case "Rain":
      icon = rainMarker;
      break;
    case "Fog":
      icon = fogMarker;
      break;
    case "Sand":
      icon = sandMarker;
      break;
    default:
      icon = letterMarker;
  }

  return <Marker icon={icon} position={position} />;
}

FlyingMarker.propTypes = {
  type: PropTypes.string.isRequired,
  position: PropTypes.array.isRequired,
};

export default FlyingMarker;
