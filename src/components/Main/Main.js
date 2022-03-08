import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

import Header from "../common/Header";
import Modal from "../common/Modal";
import wirttingImage from "../../assets/typing.png";
import { logout } from "../../features/userSlice";
import { getDeliveredLetters } from "../../api/axios";

function Main() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { _id, email, country, language, nickname, profileImage } = useSelector(
    ({ user }) => user.data
  );

  const [errorMessage, setErrorMessage] = useState("");
  const [deliveredLetterCount, setDeliveredLetterCount] = useState(0);
  const [inTransitLetterCount, setIntransitLetterCount] = useState(0);

  useEffect(() => {
    if (!_id) return;

    const today = new Date();

    (async () => {
      try {
        const { data } = await getDeliveredLetters(_id, { today, count: true });

        setDeliveredLetterCount(data.data.counts.deliveredLetterCount);
        setIntransitLetterCount(data.data.counts.inTransitLetterCount);
      } catch (error) {
        setErrorMessage(error.response.data.message);
      }
    })();
  }, [_id]);

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

  return (
    <>
      {errorMessage && (
        <Modal onClick={setErrorMessage} width="50rem" height="20rem">
          <p>{errorMessage}</p>
        </Modal>
      )}
      <MainWrapper>
        <ButtonContainer>
          <button>About</button>
          <button onClick={handleLogoutButtonClick}>logout</button>
        </ButtonContainer>
        <Header />
        <LetterInfoContainer>
          <div className="text">도착한 편지</div>
          <div className="count" onClick={handleDeliveredCountClick}>
            {deliveredLetterCount}개
          </div>
          <div className="text">배송 중 편지</div>
          <div className="count" onClick={handleIntransitCountClick}>
            {inTransitLetterCount}개
          </div>
        </LetterInfoContainer>
        <ProfileContainer>
          <h3>-- My Profile --</h3>
          <div className="info-container">
            <img src={profileImage} alt="profile image" />
            <div className="info">
              <div>
                이메일: <span>{email}</span>
              </div>
              <div>
                닉네임: <span>{nickname}</span>
              </div>
              <div>
                거주 국가: <span>{country}</span>
              </div>
              <div>
                사용 언어: <span>{language}</span>
              </div>
            </div>
          </div>
        </ProfileContainer>
        <FriendListEntryContainer>
          <h3>-- friends --</h3>
          <div className="content">
            <p>세계 곳곳의 새로운 펜팔 친구에게</p>
            <p>편지를 보내보세요</p>
            <img src={wirttingImage} alt="typewriter image" />
            <button onClick={handleFriendSelectButtonClick}>선택하기</button>
          </div>
        </FriendListEntryContainer>
      </MainWrapper>
    </>
  );
}

const MainWrapper = styled.div`
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  overflow: scroll;
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
    border-radius: 20px;
    border: 3px solid #fff;
    padding: 7px 20px;
    background: rgba(238, 238, 238, 1);
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
    height: 320px;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 30px;
    background: rgba(240, 228, 198, 1);
    font-size: 1.4rem;
  }

  button {
    margin: 3vh 0;
    padding: 8px 18px;
    background: #66b28a;
    border: none;
    border-radius: 4px;
    color: #fff;
    font-weight: bold;
    cursor: pointer;
  }
`;

export default Main;
