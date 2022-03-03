import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

import {
  DEFAULT_IMAGE,
  VALID_EMAIL,
  VALID_NICKNAME,
  INVALID_PASSWORD,
} from "../../constants";
import Modal from "../common/Modal";
import { postSignup, checkSignupInfo } from "../../api/axios";
import { getCurrentLocationData } from "../../api/openWeather";
import useGeoLocation from "../../hooks/useGeoLocation";
import countryNames from "../../assets/countryCode.json";

function Signup() {
  const imageFile = useRef();
  const location = useGeoLocation();
  const navigate = useNavigate();

  const [modalMessage, setModalMessage] = useState(false);
  const [profileImage, setProfileImage] = useState("");
  const [previewImage, setPreviewImage] = useState(DEFAULT_IMAGE);
  const [isUniqueEmail, seIsUniqueEmail] = useState(false);
  const [isUniqueNickname, setIsUniqueNickname] = useState(false);
  const [userInfo, setUserInfo] = useState({
    email: "",
    password: "",
    confirmedPassword: "",
    nickname: "",
    language: "",
    lat: "",
    lng: "",
    country: "",
  });

  async function handleClickEmailCheckButton(e) {
    e.preventDefault();

    if (!userInfo.email) {
      setModalMessage("아이디를 입력하세요.");
      return;
    }

    try {
      await checkSignupInfo({ email: userInfo.email });

      seIsUniqueEmail(true);
      setModalMessage(VALID_EMAIL);
    } catch (error) {
      setModalMessage(error.response.data.message);
    }
  }

  async function handleClickNicknameCheckButton(e) {
    e.preventDefault();

    if (!userInfo.nickname) {
      setModalMessage("닉네임을 입력하세요.");
      return;
    }

    try {
      await checkSignupInfo({ nickname: userInfo.nickname });

      setIsUniqueNickname(true);
      setModalMessage(VALID_NICKNAME);
    } catch (error) {
      setModalMessage(error.response.data.message);
    }
  }

  async function handleSubmitSignup(e) {
    e.preventDefault();

    if (userInfo.password !== userInfo.confirmedPassword) {
      setModalMessage(INVALID_PASSWORD);
      return;
    }

    if (!isUniqueEmail || !isUniqueNickname) {
      setModalMessage("중복 체크를 해주세요.");
      return;
    }

    const formData = new FormData();

    formData.append("email", userInfo.email);
    formData.append("password", userInfo.password);
    formData.append("nickname", userInfo.nickname);
    formData.append("language", userInfo.language);
    formData.append("lat", userInfo.lat);
    formData.append("lng", userInfo.lng);
    formData.append("country", userInfo.country);
    formData.append("profileImage", profileImage);

    try {
      await postSignup(formData);
      navigate("/");
    } catch (error) {
      setModalMessage(error.response.data.message);
    }
  }

  function handleChangeEmail(email) {
    if (isUniqueNickname) {
      seIsUniqueEmail(false);
    }

    setUserInfo((info) => ({
      ...info,
      email,
    }));
  }

  function handleChangePassword(password) {
    setUserInfo((info) => ({
      ...info,
      password,
    }));
  }

  function handleCheckPassword(password) {
    setUserInfo((info) => ({
      ...info,
      confirmedPassword: password,
    }));
  }

  function handleChangeNickname(nickname) {
    if (isUniqueEmail) {
      setIsUniqueNickname(false);
    }

    setUserInfo((info) => ({
      ...info,
      nickname,
    }));
  }

  function handleChangeLangauge(language) {
    setUserInfo((info) => ({
      ...info,
      language,
    }));
  }

  function handleChangeProfileImage(e) {
    if (e.target.files[0]) {
      setPreviewImage(e.target.files[0]);
      setProfileImage(e.target.files[0]);
    } else {
      setPreviewImage(DEFAULT_IMAGE);
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      if (reader.readyState === 2) {
        setPreviewImage(reader.result);
      }
    };

    reader.readAsDataURL(e.target.files[0]);
  }

  async function handleClickCountrySelection() {
    if (location.loaded && location.error) {
      setModalMessage(location.error.message);
      return;
    }

    if (!location.loaded) {
      setModalMessage("위치 가져오는 중 입니다. 잠시만 기다려 주세요.");
      return;
    }

    try {
      const res = await getCurrentLocationData(
        location.coordinates.lat,
        location.coordinates.lng
      );

      setUserInfo((info) => ({
        ...info,
        lat: location.coordinates.lat,
        lng: location.coordinates.lng,
        country: countryNames[res.sys.country],
      }));
    } catch (error) {
      setModalMessage(error.response.data.message);
    }
  }

  return (
    <SignupWrapper>
      {modalMessage && (
        <Modal onClick={setModalMessage} width="50rem" height="20rem">
          <p>{modalMessage}</p>
        </Modal>
      )}
      <div className="container">
        <img
          src={previewImage}
          className="preview-image"
          onClick={() => {
            imageFile.current.click();
          }}
        />
        <form encType="multipart/form-data" onSubmit={handleSubmitSignup}>
          <div className="input-box">
            <input
              className="profile-image"
              type="file"
              accept="image/jpg, image/png, image/jpeg"
              name="profileImage"
              onChange={handleChangeProfileImage}
              ref={imageFile}
            />
          </div>
          <div className="input-box">
            <input
              type="text"
              value={userInfo.email}
              placeholder="이메일"
              required
              onChange={(e) => handleChangeEmail(e.target.value)}
            />
            <button type="button" onClick={handleClickEmailCheckButton}>
              중복 확인
            </button>
          </div>
          <div className="input-box">
            <input
              type="password"
              value={userInfo.password}
              placeholder="비밀번호"
              required
              autoComplete="off"
              onChange={(e) => handleChangePassword(e.target.value)}
            />
          </div>
          <div className="input-box">
            <input
              type="password"
              value={userInfo.confirmedPassword}
              placeholder="비밀번호 확인"
              required
              autoComplete="off"
              onChange={(e) => handleCheckPassword(e.target.value)}
            />
          </div>
          <div className="input-box">
            <input
              type="text"
              value={userInfo.nickname}
              placeholder="닉네임"
              required
              onChange={(e) => handleChangeNickname(e.target.value)}
            />
            <button type="button" onClick={handleClickNicknameCheckButton}>
              중복 확인
            </button>
          </div>
          <div className="input-box">
            <input
              type="text"
              value={userInfo.language}
              placeholder="사용 언어"
              required
              onChange={(e) => handleChangeLangauge(e.target.value)}
            />
          </div>
          <div className="input-box">
            <input
              type="text"
              value={userInfo.country}
              placeholder="국가 선택"
              onClick={handleClickCountrySelection}
              required
              readOnly
            />
          </div>
          <div className="input-box">
            <button type="submit">회원가입</button>
          </div>
        </form>
      </div>
    </SignupWrapper>
  );
}

const SignupWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  overflow: hidden;

  .container {
    position: relative;
    width: 100%;
    min-width: 400px;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    align-items: center;
    background: rgba(245, 244, 239, 0.7);
  }

  .preview-image {
    object-fit: cover;
    width: 200px;
    height: 200px;
    margin-bottom: 20px;
    border-radius: 50%;
    border: 4px solid #fff;
  }

  .profile-image {
    display: none;
  }

  .input-box input {
    width: 100%;
    border: none;
    outline: none;
    margin: 10px 0;
    padding: 13px 20px;
    border-radius: 35px;
    border: 2px solid rgba(255, 255, 255, 0.5);
    border-right: 2px solid rgba(255, 255, 255, 0.2);
    border-bottom: 2px solid rgba(255, 255, 255, 0.2);
    font-size: 15px;
    font-weight: 200px;
  }

  .input-box button {
    width: 90px;
    background: rgb(240, 228, 198);
    border: none;
    outline: none;
    margin: 10px 0;
    padding: 8px 20px;
    border-radius: 35px;
    border: 2px solid rgba(255, 255, 255, 0.5);
    border-right: 2px solid rgba(255, 255, 255, 0.2);
    border-bottom: 2px solid rgba(255, 255, 255, 0.2);
    font-size: 12px;
    cursor: pointer;
  }
`;

export default Signup;
