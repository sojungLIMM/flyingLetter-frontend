import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import {
  MapContainer,
  TileLayer,
  CircleMarker,
  Marker,
  Popup,
} from "react-leaflet";
import { Icon } from "leaflet";

import Header from "../common/Header";
import Modal from "../common/Modal";
import StyledGreenButton from "../common/StyledGreenButton";
import writingImage from "../../assets/typing.png";
import pinkLetter from "../../assets/pinkLetter.png";
import { logout } from "../../features/userSlice";
import { getLetters } from "../../api/axios";
import useGeoLocation from "../../hooks/useGeoLocation";
import getDistance from "../../utils/getDistance";
import { LOADING_GET_LOCATION } from "../../constants";

const letterMarker = new Icon({
  iconUrl: pinkLetter,
  iconSize: [35, 35],
});

function Main() {
  const location = useGeoLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    _id: userId,
    email,
    country,
    language,
    nickname,
    profileImage,
  } = useSelector(({ user }) => user.data);

  const [errorMessage, setErrorMessage] = useState("");
  const [deliveredLetterCount, setDeliveredLetterCount] = useState(0);
  const [inTransitLetterCount, setIntransitLetterCount] = useState(0);
  const [leavedLetters, setLeavedLetters] = useState([]);

  useEffect(() => {
    if (!userId) return;

    if (location.loaded && location.error) {
      setErrorMessage(location.error.message);
    }

    const today = new Date();

    (async () => {
      try {
        const { data } = await getLetters(userId, {
          today,
          count: true,
        });

        setDeliveredLetterCount(data.data.counts.deliveredLetterCount);
        setIntransitLetterCount(data.data.counts.inTransitLetterCount);
        setLeavedLetters(data.data.leavedLetters);
      } catch (error) {
        setErrorMessage(error.response.data.message);
      }
    })();
  }, [userId, location.loaded]);

  function handleLogoutButtonClick() {
    dispatch(logout());
    navigate("/");
  }

  function handleFriendSelectButtonClick() {
    navigate("/friendList");
  }

  function handleDeliveredCountClick() {
    navigate("/letters/delivered");
  }

  function handleIntransitCountClick() {
    navigate("/letters/inTransit");
  }

  function handleLeaveLetterButtonClick() {
    navigate(`/sendLetter/${userId}`, {
      state: {
        leaveLetter: true,
        lat: location.lat,
        lng: location.lng,
      },
    });
  }

  function handleReadButtonClick(
    letterId,
    fromUserId,
    content,
    letterWallPaper,
    userLat,
    userLng,
    letterLat,
    letterLng
  ) {
    const distance = getDistance(
      [location.lat, location.lng],
      [letterLat, letterLng]
    );

    if (userId === fromUserId) {
      setErrorMessage("????????? ???????????? ????????? ??? ????????????.");
      return;
    }

    if (distance > 1) {
      setErrorMessage("?????? ???????????? 1km ????????? ???????????? ????????? ??? ????????????.");
      return;
    }

    navigate(`/letters/delivered/${letterId}`, {
      state: {
        userId: fromUserId,
        letterId,
        content,
        letterWallPaper,
        fromLat: location.lat,
        fromLng: location.lng,
        toLat: userLat,
        toLng: userLng,
      },
    });
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
      <MainWrapper>
        <ButtonContainer>
          <button>About</button>
          <button onClick={handleLogoutButtonClick}>logout</button>
        </ButtonContainer>
        <Header />
        <LetterInfoContainer>
          <div className="text">????????? ??????</div>
          <div className="count" onClick={handleDeliveredCountClick}>
            {deliveredLetterCount}???
          </div>
          <div className="text">?????? ??? ??????</div>
          <div className="count" onClick={handleIntransitCountClick}>
            {inTransitLetterCount}???
          </div>
        </LetterInfoContainer>
        <ProfileContainer>
          <h3>??? My Profile ???</h3>
          <div className="info-container">
            <img src={profileImage} alt="profile image" />
            <div className="info">
              <div>
                ?????????: <span>{email}</span>
              </div>
              <div>
                ?????????: <span>{nickname}</span>
              </div>
              <div>
                ?????? ??????: <span>{country}</span>
              </div>
              <div>
                ?????? ??????: <span>{language}</span>
              </div>
            </div>
          </div>
        </ProfileContainer>
        <FriendListEntryContainer>
          <h3>??? friends ???</h3>
          <div className="content">
            <p>?????? ????????? ????????? ?????? ????????????</p>
            <p>????????? ???????????????</p>
            <StyledGreenButton onClick={handleFriendSelectButtonClick}>
              ????????????
            </StyledGreenButton>
            <img src={writingImage} alt="typewriter image" />
          </div>
        </FriendListEntryContainer>
        <MapWrapper>
          <h3>??? find letter ???</h3>
          {!location.loaded && <p>{LOADING_GET_LOCATION}</p>}
          {location.loaded && !location.error && (
            <>
              <StyledGreenButton onClick={handleLeaveLetterButtonClick}>
                ?????? ????????? ?????? ?????????
              </StyledGreenButton>
              <MapContainer
                center={[location.lat, location.lng]}
                zoom={15}
                minZoom={2}
              >
                <TileLayer
                  className="container"
                  attribution={
                    process.env.REACT_APP_OPEN_STREET_MAP_ATTRIBUTION
                  }
                  url={process.env.REACT_APP_OPEN_STREET_MAP_URL}
                />
                {leavedLetters?.map((letter) => {
                  const { _id, lat, lng, content, letterWallPaper, from } =
                    letter;

                  return (
                    <Marker
                      key={letter._id}
                      position={[letter.lat, letter.lng]}
                      icon={letterMarker}
                      alt="pink letter"
                    >
                      <Popup>
                        <img className="from-img" src={from.profileImage} />
                        <p className="from-nickname">from.{from.nickname}</p>
                        <p className="from-country">{from.country}</p>
                        <button
                          onClick={() =>
                            handleReadButtonClick(
                              _id,
                              from._id,
                              content,
                              letterWallPaper,
                              from.lat,
                              from.lng,
                              lat,
                              lng
                            )
                          }
                          className="read-button"
                        >
                          ?????? ??????
                        </button>
                      </Popup>
                    </Marker>
                  );
                })}
                <CircleMarker
                  className="user-position"
                  center={[location.lat, location.lng]}
                  radius={16.5}
                />
              </MapContainer>
            </>
          )}
        </MapWrapper>
      </MainWrapper>
    </>
  );
}

const rainbow = keyframes`
  0% {
    stroke: red;
  }
  17% {
    stroke: orange;
  }
  34% {
    stroke: yellow;
  }
  51% {
    stroke: green;
  }
  68% {
    stroke: blue;
  }
  80% {
    stroke: purple;
  }
`;

const MainWrapper = styled.div`
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  overflow: scroll;
`;

const MapWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 4vh 0;

  .user-position {
    fill: none;
    stroke: red;
    stroke-width: 5px;
    animation: ${rainbow} 3s infinite;
  }

  .leaflet-container {
    width: 400px;
    height: 400px;
    z-index: 1;
  }

  .leaflet-popup-content {
    width: 100px;
    height: 160px;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .from-img {
    width: 80px;
    height: 80px;
    margin-bottom: 5px;
    object-fit: cover;
    border-radius: 50%;
    border: 4px solid #fff;
  }

  .from-nickname,
  .from-country {
    margin: 0;
    padding-bottom: 5px;
    font-size: 1.3rem;
    font-weight: bold;
  }

  .read-button {
    margin-top: 5px;
    padding: 5px 10px;
    background: rgb(240, 228, 198);
    border: none;
    outline: none;
    border-radius: 35px;
    cursor: pointer;
  }
`;

const ButtonContainer = styled.div`
  display: flex;

  button {
    width: 10rem;
    height: 4rem;
    margin: 3vh 3vw 4vh;
    background: transparent;
    border: none;
    font-size: 1.7rem;
    cursor: pointer;
  }
`;

const LetterInfoContainer = styled.div`
  width: 400px;
  height: 200px;
  margin: 3vh 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #fff;
  box-shadow: 2px 6px 41px rgba(0, 0, 0, 0.15);
  border-radius: 11px;

  .count {
    width: 30%;
    text-align: center;
    line-height: 40px;
    font-size: 1.7rem;
    cursor: pointer;
  }

  .text {
    margin-top: 10px;
    font-size: 1.5rem;
    font-weight: bold;
    color: rgba(117, 117, 117, 1);
  }
`;

const ProfileContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 4vh 0;
  width: 40rem;

  img {
    object-fit: cover;
    width: 16rem;
    height: 16rem;
    margin-bottom: 20px;
    border-radius: 50%;
    border: 4px solid #fff;
  }

  .info-container {
    display: flex;
    justify-content: space-evenly;
    width: 100%;
    margin-top: 30px;
    font-size: 1.4rem;
  }

  .info {
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    font-size: 1.5rem;
    font-weight: bold;
  }

  .info div {
    width: 280px;
    border-radius: 20px;
    border: 3px solid #fff;
    padding: 7px 20px;
    background: rgba(238, 238, 238, 1);
    line-height: 20px;
  }

  .info span {
    font-weight: normal;
    margin: 0 10px;
  }
`;

const FriendListEntryContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 4vh 0;

  .content {
    width: 280px;
    height: 400px;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 30px;
    padding: 20px;
    background: rgba(240, 228, 198, 1);
    border-radius: 11px;
    font-size: 1.4rem;
  }
`;

export default Main;
