import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import styled, { keyframes } from "styled-components";
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
          <div className="content">
            <p>{modalMessage}</p>
          </div>
        </Modal>
      )}
      <LoginWrapper>
        <Header />
        <LoginContainer>
          <SpinningPlane>
            <Icon icon="majesticons:airplane-flight-2-line" height="60" />
          </SpinningPlane>
          <EarthContainer>
            <LoginForm onSubmit={handleLoginButtonClick}>
              <LoginInputContainer className="input-box">
                <input
                  type="email"
                  placeholder="이메일"
                  value={email}
                  onChange={(e) => handleEmailChange(e.target.value)}
                  required
                />
              </LoginInputContainer>
              <LoginInputContainer className="input-box">
                <input
                  type="password"
                  placeholder="비밀번호"
                  value={password}
                  onChange={(e) => handlePasswordChange(e.target.value)}
                  autoComplete="off"
                  minLength="8"
                  maxLength="12"
                  required
                />
              </LoginInputContainer>
              <LoginButtonContainer className="button-box">
                <button type="button" onClick={handleSignupButtonClick}>
                  회원가입
                </button>
                <button type="submit">로그인</button>
              </LoginButtonContainer>
            </LoginForm>
          </EarthContainer>
        </LoginContainer>
        <SourceContainer>
          <p>created by YuKai Du</p>
          <p>title: The Environmental Cost of a day on Earth</p>
        </SourceContainer>
      </LoginWrapper>
    </>
  );
}

const rotate = keyframes`
  0% {
     transform: rotate(0deg);
   }
   100% {
     transform: rotate(360deg);
   }
`;

const LoginWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: 80px 0;
`;

const LoginContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  margin: 40px 0;
`;

const EarthContainer = styled.div`
  position: absolute;
  width: 350px;
  height: 350px;
  background-image: url(${earthImage});
  border-radius: 50%;
  background-size: cover;
`;

const SpinningPlane = styled.div`
  width: 350px;
  height: 350px;
  border-radius: 50%;
  animation: ${rotate} 4s linear infinite;
`;

const LoginForm = styled.form`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 340px;
  height: 340px;
  border-radius: 50%;
`;

const LoginInputContainer = styled.div`
  input {
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
`;

const LoginButtonContainer = styled.div`
  display: flex;
  justify-content: space-evenly;

  button {
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

const SourceContainer = styled.div`
  margin: 5rem 0;
  color: #bbb;
`;

export default Login;
