import React, { useEffect, useState } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import Modal from "./components/common/Modal";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Main from "./pages/Main";
import DeliveredLetters from "./pages/DeliveredLetters";
import InTransitLetters from "./pages/InTransitLetters";
import FriendList from "./pages/FriendList";
import Letter from "./pages/Letter";
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
    <div>
      {modalMessage && (
        <Modal width="50rem" height="20rem">
          <div>{modalMessage}</div>
          <button onClick={handleClickBackButton}>Back</button>
        </Modal>
      )}
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/main" element={<Main />} />
        <Route path="/letters/delivered" element={<DeliveredLetters />} />
        <Route path="/letters/delivered/:letterId" />
        <Route path="/letters/inTransit" element={<InTransitLetters />} />
        <Route path="/letters/inTransit/:letterId" />
        <Route path="/friendList" element={<FriendList />} />
        <Route path="/sendLetter/:userId" element={<Letter />} />
      </Routes>
    </div>
  );
}

export default App;
