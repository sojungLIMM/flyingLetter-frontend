import React, { useRef, useEffect, useState } from "react";
import styled from "styled-components";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { Marker, MapContainer, TileLayer, Polyline } from "react-leaflet";
import { Icon } from "leaflet";
import { differenceInSeconds } from "date-fns";

import PrevButton from "../common/PrevButton";
import Modal from "../common/Modal";
import pinkLetter from "../../assets/pinkLetter.png";
import mailBox from "../../assets/mailbox.png";
import countryNames from "../../assets/countryCode.json";
import getDistance from "../../utils/getDistance";
import getCoorordinate from "../../utils/getCoorordinate";
import { formatTotalTime, formatLeftTime } from "../../utils/formatTime";
import { getCurrentLocationData } from "../../api/openWeather";
import {
  OPEN_STREET_MAP,
  OPEN_STREET_MAP_URL,
  KM_PER_SECOND,
} from "../../constants";

const letter = new Icon({
  iconUrl: pinkLetter,
  iconSize: [35, 35],
});

const postBox = new Icon({
  iconUrl: mailBox,
  iconSize: [35, 35],
});

function InTransitLetterDetail() {
  const polyRef = useRef();
  const user = useSelector(({ user }) => user.data);
  const loading = useSelector(({ user }) => user.status);
  const friend = useLocation().state;

  const [newCoor, setNewcoor] = useState([]);
  const [flyingMailInfo, setFlyingMailInfo] = useState({});
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let timerId = setTimeout(function getcurrentlocationInfo() {
      const today = new Date();
      const totalDistance = getDistance(
        [user.lat, user.lng],
        [friend.lat, friend.lng]
      );
      const totalMinutes = totalDistance / KM_PER_SECOND;
      const remainingMinutes = differenceInSeconds(
        new Date(friend.arrivedAt),
        today
      );
      const elapsedMinutes = totalMinutes - remainingMinutes;
      const currentCoordinate = getCoorordinate(
        [friend.lat, friend.lng],
        [user.lat, user.lng],
        totalMinutes,
        elapsedMinutes
      );

      setFlyingMailInfo((prev) => ({
        ...prev,
        totalDistance: Math.floor(totalDistance),
        remainingDistance: remainingMinutes * KM_PER_SECOND,
        totalMinutes: Math.floor(totalMinutes),
        remainingMinutes,
      }));
      setNewcoor(currentCoordinate);

      timerId = setTimeout(getcurrentlocationInfo, 1000);
    }, 0);

    return () => {
      clearTimeout(timerId);
    };
  }, []);

  useEffect(() => {
    let timerId;

    async function tick() {
      try {
        const today = new Date();
        const totalDistance = getDistance(
          [user.lat, user.lng],
          [friend.lat, friend.lng]
        );
        const totalMinutes = totalDistance / KM_PER_SECOND;
        const remainingMinutes = differenceInSeconds(
          new Date(friend.arrivedAt),
          today
        );
        const elapsedMinutes = totalMinutes - remainingMinutes;
        const currentCoordinate = getCoorordinate(
          [friend.lat, friend.lng],
          [user.lat, user.lng],
          totalMinutes,
          elapsedMinutes
        );

        const res = await getCurrentLocationData(...currentCoordinate);

        setFlyingMailInfo((prev) => ({
          ...prev,
          currentLocation: `${countryNames[res.sys.country]} ${res.name}`,
          weather: res.weather[0].main,
        }));
        setNewcoor(currentCoordinate);
      } catch (error) {
        setErrorMessage(error.response.data.message);
      } finally {
        timerId = setTimeout(tick, 1000 * 60 * 60);
      }
    }
    setTimeout(tick, 0);

    return () => clearTimeout(timerId);
  }, []);

  return (
    <MapWrapper>
      {errorMessage && (
        <Modal onClick={setErrorMessage} width="50rem" height="20rem">
          <p>{errorMessage}</p>
        </Modal>
      )}
      <div className="container">
        <div className="button">
          <PrevButton />
        </div>
        {loading === "success" && newCoor.length && (
          <MapContainer center={newCoor} zoom={10} minZoom={2}>
            <TileLayer
              className="container"
              attribution={OPEN_STREET_MAP}
              url={OPEN_STREET_MAP_URL}
            />
            <Marker position={[user.lat, user.lng]} icon={postBox} />
            <Marker position={[friend.lat, friend.lng]} icon={letter} />
            <Marker position={newCoor} icon={letter} />
            <Polyline
              ref={polyRef}
              pathOptions={{ color: "red" }}
              positions={[[user.lat, user.lng], newCoor]}
            />
            <Polyline
              ref={polyRef}
              pathOptions={{ color: "green" }}
              positions={[newCoor, [friend.lat, friend.lng]]}
            />
          </MapContainer>
        )}
        <div className="information">
          <div className="time">
            <div>총 시간: {formatTotalTime(flyingMailInfo.totalMinutes)}</div>
            <div>
              남은 시간: {formatLeftTime(flyingMailInfo.remainingMinutes)}
            </div>
          </div>
          <div className="distance">
            <div>총 거리: {flyingMailInfo.totalDistance}km</div>
            <div>남은 거리: {flyingMailInfo.remainingDistance}km</div>
          </div>
          <div className="location">
            <div>현재 위치: {flyingMailInfo.currentLocation}</div>
            <div>날씨: {flyingMailInfo.weather}</div>
          </div>
        </div>
      </div>
    </MapWrapper>
  );
}

const MapWrapper = styled.div`
  min-height: 100vh;
  min-width: 100vw;
  display: flex;
  justify-content: center;
  align-items: center;

  .container {
    position: relative;
    width: 100%;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    background: rgba(245, 244, 239, 0.7);
  }

  .button {
    width: 600px;
  }

  .leaflet-container {
    width: 600px;
    height: 600px;
  }

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

export default InTransitLetterDetail;
