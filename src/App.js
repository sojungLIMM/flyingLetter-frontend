import React, { useEffect, useState } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import styled from "styled-components";

import Modal from "./components/common/Modal";
import Login from "./components/Login/Login";
import Signup from "./components/Signup/Signup";
import Main from "./components/Main/Main";
import DeliveredLetters from "./components/DeliveredLetters/DeliveredLetters";
import DeliveredLetterDetail from "./components/DeliveredLetters/DeliveredLetterDetail";
import InTransitLetters from "./components/InTransitLetters/InTransitLetters";
import InTransitLetterDetail from "./components/InTransitLetters/InTransitLetterDetail";
import FriendList from "./components/FriendList/FriendList";
import NewLetter from "./components/NewLetter/NewLetter";
import PrivateRoute from "./components/PrivateRoute/PrivateRoute";
import { ACCESS_TOKEN } from "./constants";
import { getLoginUserByToken } from "./features/userSlice";

function App() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isLoggedIn = useSelector(({ user }) => user.isLoggedIn);

  const [modalMessage, setModalMessage] = useState("");

  useEffect(() => {
    if (!isLoggedIn && localStorage.getItem(ACCESS_TOKEN)) {
      dispatch(getLoginUserByToken(setModalMessage));
    }
  }, []);

  function handleClickBackButton() {
    navigate("/");
    setModalMessage(false);
  }

  return (
    <Wrapper>
      {modalMessage && (
        <Modal width="50rem" height="20rem">
          <div className="content">
            <div>{modalMessage}</div>
            <button onClick={handleClickBackButton}>Back</button>
          </div>
        </Modal>
      )}
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route element={<PrivateRoute />}>
          <Route path="/main" element={<Main />} />
          <Route path="/letters/delivered" element={<DeliveredLetters />} />
          <Route
            path="/letters/delivered/:letterId"
            element={<DeliveredLetterDetail />}
          />
          <Route path="/letters/inTransit" element={<InTransitLetters />} />
          <Route
            path="/letters/inTransit/:letterId"
            element={<InTransitLetterDetail />}
          />
          <Route path="/friendList" element={<FriendList />} />
          <Route path="/sendLetter/:userId" element={<NewLetter />} />
        </Route>
      </Routes>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  min-height: 100vh;
  min-width: 100vw;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(245, 244, 239, 0.7);
`;

export default App;
