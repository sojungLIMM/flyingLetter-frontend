import React from "react";
import PropTypes from "prop-types";
import styled, { keyframes } from "styled-components";

function WeatherBackground({ type, children }) {
  const imagePath = {
    Snow: require("../../assets/snow.jpg"),
    Fog: require("../../assets/fog.jpg"),
    Clear: require("../../assets/clear.jpg"),
    Clouds: require("../../assets/cloud.jpg"),
    ThunderStorm: require("../../assets/thunder.jpg"),
    Rain: require("../../assets/rain3.jpg"),
    Tornado: require("../../assets/tornado.jpg"),
    Sand: require("../../assets/sand.jpeg"),
  };

  return (
    <BackgroundWrapper style={{ backgroundImage: `url("${imagePath[type]}")` }}>
      {children}
    </BackgroundWrapper>
  );
}

const background = keyframes`
  0% {
    background-position: 0 center;
  }
  100% {
    background-position: -100vw center;
  }
`;

const BackgroundWrapper = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-repeat: repeat-x;
  background-size: cover;
  animation: ${background} 20s linear infinite;
`;

WeatherBackground.propTypes = {
  type: PropTypes.string,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
};

export default WeatherBackground;
