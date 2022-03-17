import React, { useRef, useEffect, useState } from "react";
import styled, { keyframes, css } from "styled-components";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { Marker, MapContainer, TileLayer, Polyline } from "react-leaflet";
import { Icon } from "leaflet";
import { differenceInSeconds } from "date-fns";

import WeatherBackground from "../WeatherBackground/WeatherBackground";
import FlyingMarker from "../FlyingMarker/FlyingMarker";
import PrevButton from "../common/PrevButton";
import Modal from "../common/Modal";
import raindropsImg from "../../assets/raindrops.png";
import mailBoxImg from "../../assets/mailbox.png";
import lightningImg from "../../assets/lightining.png";
import countryNames from "../../assets/countryCode.json";
import getDistance from "../../utils/getDistance";
import getCoordinate from "../../utils/getCoordinate";
import getWeatherType from "../../utils/getWeatherType";
import { formatTotalTime, formatLeftTime } from "../../utils/formatTime";
import { getCurrentLocationData } from "../../api/openWeather";
import { KM_PER_SECOND } from "../../constants";

const postBox = new Icon({
  iconUrl: mailBoxImg,
  iconSize: [35, 35],
});

function InTransitLetterDetail() {
  const navigate = useNavigate();
  const polyRef = useRef();
  const user = useSelector(({ user }) => user.data);
  const loading = useSelector(({ user }) => user.status);
  const friend = useLocation().state;

  const [newCoor, setNewcoor] = useState([]);
  const [flyingMailInfo, setFlyingMailInfo] = useState({});
  const [errorMessage, setErrorMessage] = useState("");
  const [modalMessage, setModalMessage] = useState("");
  const [map, setMap] = useState(null);
  const [isZoomed, setIsZoomed] = useState(false);

  useEffect(() => {
    if (!map) return;

    map.flyTo(newCoor, 13, {
      duration: 3,
    });

    const timerId = setTimeout(() => {
      setIsZoomed(true);
    }, 3000);

    return () => clearTimeout(timerId);
  }, [map]);

  useEffect(() => {
    getCurrentWeatherInfo();

    let timerId = setTimeout(function getcurrentlocationInfo() {
      const totalDistance = getDistance(
        [user.lat, user.lng],
        [friend.lat, friend.lng]
      );
      const totalSeconds = totalDistance / KM_PER_SECOND;
      const remainingSeconds = differenceInSeconds(
        new Date(friend.arrivedAt),
        new Date()
      );
      const elapsedSeconds = totalSeconds - remainingSeconds;

      if (remainingSeconds < 0) {
        clearTimeout(timerId);
        setModalMessage("편지가 도착했습니다.");
        return;
      }

      const currentCoordinate = getCoordinate(
        [friend.lat, friend.lng],
        [user.lat, user.lng],
        totalSeconds,
        elapsedSeconds
      );

      setFlyingMailInfo((prev) => ({
        ...prev,
        totalDistance: Math.floor(totalDistance),
        remainingDistance: remainingSeconds * KM_PER_SECOND,
        totalSeconds: Math.floor(totalSeconds),
        remainingSeconds,
      }));
      setNewcoor(currentCoordinate);

      timerId = setTimeout(getcurrentlocationInfo, 1000);
    }, 0);

    return () => clearTimeout(timerId);
  }, []);

  async function getCurrentWeatherInfo() {
    try {
      const totalDistance = getDistance(
        [user.lat, user.lng],
        [friend.lat, friend.lng]
      );
      const totalSeconds = totalDistance / KM_PER_SECOND;
      const remainingSeconds = differenceInSeconds(
        new Date(friend.arrivedAt),
        new Date()
      );
      const elapsedSeconds = totalSeconds - remainingSeconds;
      const currentCoordinate = getCoordinate(
        [friend.lat, friend.lng],
        [user.lat, user.lng],
        totalSeconds,
        elapsedSeconds
      );

      const res = await getCurrentLocationData(...currentCoordinate);
      const weatherType = getWeatherType(res.weather[0].id);

      setFlyingMailInfo((prev) => ({
        ...prev,
        currentLocation: `${countryNames[res.sys.country]} ${res.name}`,
        weather: res.weather[0].description,
        weatherType,
      }));
      setNewcoor(currentCoordinate);
    } catch (error) {
      setErrorMessage(error.response.data.message);
    }
  }

  function handleOkButtonClick() {
    navigate("/main");
  }

  return (
    <>
      {errorMessage && (
        <Modal onClick={setErrorMessage} width="50rem" height="20rem">
          <div className="content">
            <p>{errorMessage}</p>
          </div>
        </Modal>
      )}
      {modalMessage && (
        <Modal onClick={setModalMessage} width="50rem" height="20rem">
          <div className="content">
            <p>{modalMessage}</p>
            <button onClick={handleOkButtonClick}>확인</button>
          </div>
        </Modal>
      )}
      {loading === "success" && newCoor.length && flyingMailInfo.weatherType && (
        <WeatherBackground type={flyingMailInfo.weatherType}>
          <MapWrapper type={flyingMailInfo.weatherType}>
            <div
              className={
                flyingMailInfo.weatherType === "ThunderStorm"
                  ? "thunderStorm"
                  : ""
              }
            ></div>
            <PrevButton />
            <MapContainer
              center={newCoor}
              zoom={0}
              minZoom={2}
              whenCreated={setMap}
            >
              <TileLayer
                className="container"
                attribution={process.env.REACT_APP_OPEN_STREET_MAP_ATTRIBUTION}
                url={process.env.REACT_APP_OPEN_STREET_MAP_URL}
              />
              <Marker position={[user.lat, user.lng]} icon={postBox} />
              <FlyingMarker
                type={flyingMailInfo.weatherType}
                position={newCoor}
              />
              {isZoomed && (
                <Polyline
                  className={
                    flyingMailInfo.weatherType === "ThunderStorm"
                      ? "lightning-polyline"
                      : ""
                  }
                  ref={polyRef}
                  pathOptions={{ color: "#fe4c40" }}
                  positions={[[user.lat, user.lng], newCoor]}
                />
              )}
              {isZoomed && (
                <Polyline
                  className={
                    flyingMailInfo.weatherType === "ThunderStorm"
                      ? "lightning-polyline"
                      : ""
                  }
                  ref={polyRef}
                  pathOptions={{ color: "#fdd7e4" }}
                  positions={[newCoor, [friend.lat, friend.lng]]}
                />
              )}
            </MapContainer>
            <InformationWrapper>
              <div className="time">
                <div>
                  총 시간: {formatTotalTime(flyingMailInfo.totalSeconds)}
                </div>
                <div>
                  남은 시간: {formatLeftTime(flyingMailInfo.remainingSeconds)}
                </div>
              </div>
              <div className="distance">
                <div>총 거리: {flyingMailInfo.totalDistance}km</div>
                <div>남은 거리: {flyingMailInfo.remainingDistance}km</div>
              </div>
              <div className="location">
                <div>현재 위치: {flyingMailInfo.currentLocation}</div>
                <div>날씨: {flyingMailInfo.weather}</div>
                <WeatherUpdateWrppaer>
                  <button type="button" onClick={getCurrentWeatherInfo}>
                    위치, 날씨 업데이트
                  </button>
                </WeatherUpdateWrppaer>
              </div>
            </InformationWrapper>
          </MapWrapper>
        </WeatherBackground>
      )}
    </>
  );
}

const rainDrops = keyframes`
  0% {
    background-position: 0px 0px;
  }
  100% {
    background-position: 150px 400px;
  }
`;

const swing = keyframes`
  15% {
    transform: translateX(5px) rotate(10deg);
  }
  30% {
    transform: translateX(-5px) rotate(20deg);
  }
  50% {
    transform: translateX(3px);
  }
  65% {
    transform: translateX(-3px) rotate(20deg);
  }
  80% {
    transform: translateX(2px) rotate(10deg);
  }
  100% {
    transform: translateX(0);
  }
`;

const jump = keyframes`
  10% {
    transform: scale(1.15, 0.85) translateY(+12%);
  }
  25% {
    transform: scale(0.85, 1.15) translateY(-60%);
  }
  30% {
    transform: scale(1, 1) translateY(-80%) rotate(-90deg);
  }
  40% {
    transform: scale(1, 1) translateY(-80%) rotate(-270deg);
  }
  45% {
    transform: scale(1, 1) translateY(-60%) rotate(-360deg);
  }
  53% {
    transform: translateY(0) rotate(-360deg);
  }
  60% {
    transform: scale(1.05, 0.95) translateY(-5%) rotate(-360deg);
  }
  68% {
    transform: scale(1, 1) translateY(0) rotate(-360deg);
  }
  100% {
    transform: rotate(-360deg);
  }
  `;

const floats = keyframes`
  from {
    left: 0%;
    transform: translateX(-40%);
  }
  to {
    left: 50%;
    transform: translateX(0%);
  }
`;

const thunder = keyframes`
  0% {
    stroke: black;
  }
  15% {
    stroke: white;
    filter: drop-shadow(0rem 0rem 0.8rem black);
  }
  16% {
    stroke: black;
  }
  40% {
    stroke: white;
    filter: drop-shadow(0rem 0rem 0.8rem black);
  }
  100% {
    stroke: black;
  }
`;

const lightning = keyframes`
  0% {
    opacity: 0;
  }
  21% {
    opacity: 1;
  }
  25% {
    opacity: 0;
  }
  31% {
    opacity: 1;
  }
  35% {
    opacity: 0;
  }
  100% {
    opacity: 0;
  }
`;

const blurry = keyframes`
  0% {
    filter: blur(0px);
  }
  50% {
     filter: blur(10px);
   }
  100% {
    filter: blur(0px);
  }
`;

const roll = keyframes`
  0% {
    transform: rotate(0);
  }
  20% {
    transform: translateY(-20%) rotate(-70deg)
  }
  40% {
    transform: translateY(+14%) rotate(-140deg)
  }
  60% {
    transform: translateY(-50%) rotate(-210deg)
  }
  80% {
    transform: translateY(+14%) rotate(-280deg)
  }
  100% {
    transform: rotate(-360deg);
  }
`;

const MapWrapper = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  animation: ${(props) =>
    props.type === "Rain" &&
    css`
      ${rainDrops} 1s linear infinite
    `};
  background-image: ${(props) =>
    props.type === "Rain" && `url(${raindropsImg})`};

  .leaflet-container {
    width: 600px;
    height: 600px;
    z-index: 1;
  }

  .thunderStorm {
    width: 100%;
    height: 100%;
    position: absolute;
    animation: ${lightning} 4s linear infinite;
    background-image: url(${lightningImg});
  }

  .clear img {
    animation: ${jump} 1s ease-out infinite;
    width: 35px;
    height: 35px;
  }

  .snow img {
    animation: ${swing} 1s ease-out infinite;
    width: 35px;
    height: 35px;
  }

  .fog img {
    animation: ${blurry} 1s ease-out infinite;
    width: 35px;
    height: 35px;
  }

  .sand img {
    animation: ${roll} 1s linear infinite;
    width: 35px;
    height: 35px;
  }

  .clouds {
    height: 70px;
    width: 70px;
  }

  .cloud {
    width: 40px;
    height: 10px;
    position: absolute;
    background: white;
    border: 1px solid black;
    border-radius: 1000px;
    animation: ${floats} 3s infinite linear;
  }

  .cloud.one {
    top: 0;
    width: 30px;
    height: 10px;
    right: 0;
    animation-duration: 2s;
  }

  .cloud::before {
    content: "";
    position: absolute;
    top: -80%;
    left: 10%;
    width: 50%;
    height: 150%;
    background: white;
    border-radius: 50%;
    border-top: 1px solid black;
  }

  .cloud::after {
    content: "";
    position: absolute;
    top: -40%;
    right: 20%;
    width: 30%;
    height: 100%;
    background: white;
    border-radius: 50%;
    border-top: 1px solid black;
  }

  .clouds img {
    width: 35px;
    height: 35px;
  }

  .lightning-polyline {
    animation: ${thunder} 1s linear infinite;
  }
`;

const InformationWrapper = styled.div`
  .time div,
  .distance div,
  .location div {
    width: 300px;
    margin: 10px;
    background: rgba(240, 228, 198, 1);
    border-radius: 6px;
    line-height: 40px;
    text-align: center;
    font-size: 1.6rem;
    font-weight: bold;
  }

  .time,
  .distance,
  .location {
    margin: 20px;
  }
`;

const WeatherUpdateWrppaer = styled.p`
  display: flex;
  justify-content: center;

  button {
    padding: 8px 18px;
    background-color: rgba(98, 136, 131, 1);
    border: none;
    border-radius: 50px;
    color: #fff;
    font-weight: bold;
    cursor: pointer;
  }
`;

export default InTransitLetterDetail;
