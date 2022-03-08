import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { Icon } from "@iconify/react";

import Modal from "../common/Modal";
import Header from "../common/Header";
import { login } from "../../features/userSlice";
import earthImage from "../../assets/The.gif";

function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [modalMessage, setModalMessage] = useState(false);

  function handleEmailChange(value) {
    setEmail(value);
  }

  function handlePasswordChange(value) {
    setPassword(value);
  }

  function handleLoginButtonClick(e) {
    e.preventDefault();
    dispatch(login({ navigate, setModalMessage, email, password }));
  }

  function handleSignupButtonClick() {
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
                <form onSubmit={handleLoginButtonClick}>
                  <div className="input-box">
                    <input
                      type="text"
                      placeholder="아이디"
                      value={email}
                      onChange={(e) => handleEmailChange(e.target.value)}
                      required
                    />
                  </div>
                  <div className="input-box">
                    <input
                      type="password"
                      placeholder="비밀번호"
                      value={password}
                      onChange={(e) => handlePasswordChange(e.target.value)}
                      autoComplete="off"
                      required
                    />
                  </div>
                  <div className="button-box">
                    <button type="button" onClick={handleSignupButtonClick}>
                      회원가입
                    </button>
                    <button type="submit">로그인</button>
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
    width: 350px;
    height: 350px;
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

  .earth {
    position: absolute;
    width: 350px;
    height: 350px;
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
