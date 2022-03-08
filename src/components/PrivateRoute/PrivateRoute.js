import React from "react";
import { Outlet, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import styled from "styled-components";

import Modal from "../common/Modal";
function PrivateRoute() {
  const isLoggedIn = useSelector(({ user }) => user.isLoggedIn);

  return (
    <>
      {isLoggedIn ? (
        <Outlet />
      ) : (
        <Modal width="50rem" height="20rem">
          <MessageWrapper>
            <div>로그인이 필요합니다.</div>
            <Link to="/">
              <button>로그인 페이지로</button>
            </Link>
          </MessageWrapper>
        </Modal>
      )}
    </>
  );
}

const MessageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  button {
    width: 100px;
    background: rgb(240, 228, 198);
    border: none;
    outline: none;
    margin: 40px 0;
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

export default PrivateRoute;
