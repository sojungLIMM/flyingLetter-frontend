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
import StyledButton from "../common/StyledButton";
import { postSignup, checkSignupInfo } from "../../api/axios";
import { getCurrentLocationData } from "../../api/openWeather";
import useGeoLocation from "../../hooks/useGeoLocation";
import countryNames from "../../assets/countryCode.json";
import {
  MAX_FILE_SIZE,
  NEED_EMAIL,
  NEED_NICKNAME,
  NEED_UNIQUE_CHECK,
  LOADING_GET_LOCATION,
  INVALID_EMAIL,
} from "../../constants";

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

  async function handleEmailCheckButtonClick(e) {
    e.preventDefault();

    if (!userInfo.email) {
      setModalMessage(NEED_EMAIL);
      return;
    }

    if (!userInfo.email.includes("@")) {
      setModalMessage(INVALID_EMAIL);
      return;
    }

    try {
      await checkSignupInfo({ email: userInfo.email });

      seIsUniqueEmail(true);
      setModalMessage(VALID_EMAIL);
    } catch (error) {
      console.log(error);
      setModalMessage(error.response.data.message);
    }
  }

  async function handleClickNicknameCheckButton(e) {
    e.preventDefault();

    if (!userInfo.nickname) {
      setModalMessage(NEED_NICKNAME);
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
      setModalMessage(NEED_UNIQUE_CHECK);
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

  function handleEmailChange(email) {
    if (isUniqueNickname) {
      seIsUniqueEmail(false);
    }

    setUserInfo((info) => ({
      ...info,
      email,
    }));
  }

  function handlePasswordChange(password) {
    setUserInfo((info) => ({
      ...info,
      password,
    }));
  }

  function handlePasswordCheck(password) {
    setUserInfo((info) => ({
      ...info,
      confirmedPassword: password,
    }));
  }

  function handleNicknameChange(nickname) {
    if (isUniqueEmail) {
      setIsUniqueNickname(false);
    }

    setUserInfo((info) => ({
      ...info,
      nickname,
    }));
  }

  function handleLangaugeChange(language) {
    setUserInfo((info) => ({
      ...info,
      language,
    }));
  }

  function handleProfileImageChange(e) {
    if (e.target.files[0].size > 1 * 1024 * 1024) {
      setModalMessage(MAX_FILE_SIZE);
      return;
    }

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

  async function handleCountrySelectionClick() {
    if (location.loaded && location.error) {
      setModalMessage(location.error.message);
      return;
    }

    if (!location.loaded) {
      setModalMessage(LOADING_GET_LOCATION);
      return;
    }

    try {
      const res = await getCurrentLocationData(location.lat, location.lng);

      setUserInfo((info) => ({
        ...info,
        lat: location.lat,
        lng: location.lng,
        country: countryNames[res.sys.country],
      }));
    } catch (error) {
      setModalMessage(error.response.data.message);
    }
  }

  return (
    <>
      {modalMessage && (
        <Modal onClick={setModalMessage} width="50rem" height="20rem">
          <p>{modalMessage}</p>
        </Modal>
      )}
      <SignupWrapper>
        <img
          src={previewImage}
          alt="profile image"
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
              onChange={handleProfileImageChange}
              ref={imageFile}
            />
          </div>
          <div className="input-box">
            <input
              type="email"
              value={userInfo.email}
              placeholder="이메일"
              required
              onChange={(e) => handleEmailChange(e.target.value)}
            />
            <StyledButton type="button" onClick={handleEmailCheckButtonClick}>
              중복 확인
            </StyledButton>
          </div>
          <div className="input-box">
            <input
              type="password"
              value={userInfo.password}
              placeholder="비밀번호"
              required
              autoComplete="off"
              onChange={(e) => handlePasswordChange(e.target.value)}
            />
          </div>
          <div className="input-box">
            <input
              type="password"
              value={userInfo.confirmedPassword}
              placeholder="비밀번호 확인"
              required
              autoComplete="off"
              onChange={(e) => handlePasswordCheck(e.target.value)}
            />
          </div>
          <div className="input-box">
            <input
              type="text"
              value={userInfo.nickname}
              placeholder="닉네임"
              required
              onChange={(e) => handleNicknameChange(e.target.value)}
            />
            <StyledButton
              type="button"
              onClick={handleClickNicknameCheckButton}
            >
              중복 확인
            </StyledButton>
          </div>
          <div className="input-box">
            <input
              type="text"
              value={userInfo.language}
              placeholder="사용 언어"
              required
              onChange={(e) => handleLangaugeChange(e.target.value)}
            />
          </div>
          <div className="input-box">
            <input
              type="text"
              value={userInfo.country}
              placeholder="국가 선택"
              onClick={handleCountrySelectionClick}
              required
              readOnly
            />
          </div>
          <div className="input-box">
            <StyledButton type="submit">회원가입</StyledButton>
          </div>
        </form>
      </SignupWrapper>
    </>
  );
}

const SignupWrapper = styled.div`
  width: 100%;
  min-width: 400px;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  align-items: center;

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
`;

export default Signup;
