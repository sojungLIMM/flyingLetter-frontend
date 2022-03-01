import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { Icon } from "@iconify/react";

import Modal from "../components/common/Modal";
import Header from "../components/common/Header";
import { login } from "../features/userSlice";
import earthImage from "../assets/The.gif";

function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [modalMessage, setModalMessage] = useState(false);

  function handleChangeEmail(value) {
    setEmail(value);
  }

  function handleChangePassword(value) {
    setPassword(value);
  }

  function handleClickLoginButton(e) {
    e.preventDefault();
    dispatch(login({ navigate, setModalMessage, email, password }));
  }

  function handleClickSignupButton() {
    navigate("/signup");
  }

  return (
    <>
      {modalMessage && (
        <Modal onClick={setModalMessage} width="50rem" height="20rem">
          <p>{modalMessage}</p>
        </Modal>
      )}
      <EarthContainer>
        <div className="planet planet-earth">
          <Header />
          <div className="container">
            <div className="loader">
              <span>
                <Icon icon="majesticons:airplane-flight-2-line" height="60" />
              </span>
            </div>
            <div className="earth">
              <LoginMain>
                <form onSubmit={handleClickLoginButton}>
                  <div className="input-box">
                    <input
                      type="text"
                      placeholder="아이디"
                      value={email}
                      onChange={(e) => handleChangeEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="input-box">
                    <input
                      type="password"
                      placeholder="비밀번호"
                      value={password}
                      onChange={(e) => handleChangePassword(e.target.value)}
                      autoComplete="off"
                      required
                    />
                  </div>
                  <div className="button-box">
                    <button type="submit">로그인</button>
                    <button type="button" onClick={handleClickSignupButton}>
                      회원가입
                    </button>
                  </div>
                </form>
              </LoginMain>
            </div>
          </div>
        </div>
      </EarthContainer>
    </>
  );
}

const EarthContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  overflow: hidden;

  .planet {
    display: flex;
    flex-direction: column;
  }

  .planet .container {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    margin: 80px 0;
  }

  .planet-earth {
    position: relative;
    width: 100%;
    min-width: 400px;
    height: 100vh;
    justify-content: center;
    align-items: center;
    background: rgba(245, 244, 239, 0.7);
  }

  .planet-earth .loader {
    position: relative;
    width: 400px;
    height: 400px;
    border-radius: 50%;
    animation: animate 4s linear infinite;
  }

  @keyframes animate {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }

  .planet-earth .loader:before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 50%;
    height: 100%;
    background: linear-gradient(to top, transparent, rgba(0, 255, 249, 0.4));
    background-size: 200px 360px;
    background-repeat: no-repeat;
    border-top-left-radius: 200px;
    border-bottom-left-radius: 200px;
  }

  .planet-earth .loader:after {
    content: "";
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 10px;
    height: 10px;
    background: #00fff9;
    border-radius: 50%;
    z-index: 10;
    box-shadow: 0 0 10px #00fff9, 0 0 20px #00fff9, 0 0 30px #00fff9,
      0 0 40px #00fff9, 0 0 50px #00fff9, 0 0 60px #00fff9, 0 0 70px #00fff9,
      0 0 80px #00fff9, 0 0 90px #00fff9, 0 0 100px #00fff9;
  }

  .planet-earth .loader span {
    position: absolute;
    top: 10px;
    left: 10px;
    right: 10px;
    bottom: 10px;
    background: rgba(245, 244, 239, 0.7);
    border-radius: 50%;
  }

  .earth {
    position: absolute;
    width: 340px;
    height: 340px;
    background-image: url(${earthImage});
    border-radius: 50%;
    background-size: cover;
  }
`;

const LoginMain = styled.main`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 340px;
  height: 340px;
  border-radius: 50%;

  .input-box input {
    width: 100%;
    border: none;
    outline: none;
    margin: 10px 0;
    padding: 10px 20px;
    border-radius: 35px;
    border: 2px solid rgba(255, 255, 255, 0.5);
    border-right: 2px solid rgba(255, 255, 255, 0.2);
    border-bottom: 2px solid rgba(255, 255, 255, 0.2);
    font-size: 15px;
    font-weight: 200px;
  }

  .button-box {
    display: flex;
    justify-content: space-evenly;
  }

  .button-box button {
    width: 100px;
    background: rgb(240, 228, 198);
    border: none;
    outline: none;
    margin: 10px 0;
    padding: 8px 20px;
    border-radius: 35px;
    border: 2px solid rgba(255, 255, 255, 0.5);
    border-right: 2px solid rgba(255, 255, 255, 0.2);
    border-bottom: 2px solid rgba(255, 255, 255, 0.2);
    font-size: 15px;
    font-weight: bold;
    cursor: pointer;
  }
`;

export default Login;
