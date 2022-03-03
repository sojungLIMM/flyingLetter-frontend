import React, { useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { addHours } from "date-fns";
import styled from "styled-components";

import PrevButton from "../common/PrevButton";
import Modal from "../common/Modal";
import { LetterWrapper } from "../common/LetterWrapper";
import { LetterContentContainer } from "../common/LetterContentContainer";
import paper from "../../assets/leaf.jpg";
import { getDistance } from "../../utils/getDistance";
import { sendLetter } from "../../api/axios";

function NewLetter() {
  const { _id, lat, lng } = useSelector(({ user }) => user.data);
  const friendData = useLocation().state;
  const friendId = useParams().userId;
  const navigate = useNavigate();
  const imageFile = useRef();

  const [letterPaper, setLetterPaper] = useState(paper);
  const [newLetterPaper, setNewLetterPaper] = useState("");
  const [content, setContent] = useState("");
  const [modalMessage, setModalMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  function handleChangeLetterPaper(e) {
    if (e.target.files[0]) {
      setLetterPaper(e.target.files[0]);
      setNewLetterPaper(e.target.files[0]);
    } else {
      setLetterPaper(paper);
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      if (reader.readyState === 2) {
        setLetterPaper(reader.result);
      }
    };

    reader.readAsDataURL(e.target.files[0]);
  }

  async function handleSubmitLetter(e) {
    e.preventDefault();
    const [lat2, lng2] = friendData.coor;

    const distance = getDistance([lat, lng], [lat2, lng2]);
    const totalHours = Math.floor(distance / 800);
    const arrivedAt = addHours(new Date(), totalHours);

    const formData = new FormData();

    formData.append("from", _id);
    formData.append("to", friendId);
    formData.append("content", content);
    formData.append("arrivedAt", arrivedAt);
    formData.append("letterWallPaper", newLetterPaper);

    try {
      await sendLetter(formData, _id);
      setModalMessage("편지 배송을 시작합니다.");
    } catch (error) {
      setErrorMessage(error.response.data.message);
    }
  }

  function handleChangeContent(content) {
    setContent(content);
  }

  function handleClickOkButton() {
    navigate(friendData.path);
    setModalMessage(false);
  }

  function handleClickHomeButton() {
    navigate("/");
    setErrorMessage(false);
  }

  return (
    <LetterWrapper>
      {modalMessage && (
        <Modal width="50rem" height="20rem">
          <p>{modalMessage}</p>
          <button onClick={handleClickOkButton}>확인</button>
        </Modal>
      )}
      {errorMessage && (
        <Modal width="50rem" height="20rem">
          <p>{errorMessage}</p>
          <button onClick={handleClickHomeButton}>홈으로</button>
        </Modal>
      )}
      <div className="container">
        <PrevButton path={friendData.path} />
        <LetterForm encType="multipart/form-data" onSubmit={handleSubmitLetter}>
          <div className="button">
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                imageFile.current.click();
              }}
            >
              편지지 선택하기
            </button>
            <button type="submit">편지 보내기</button>
          </div>
          <input
            type="file"
            ref={imageFile}
            accept="image/jpg, image/png, image/jpeg"
            name="letterWallPaper"
            onChange={handleChangeLetterPaper}
            style={{ display: "none" }}
          />
        </LetterForm>
        <LetterContentContainer>
          <img src={letterPaper} />
          <textarea
            value={content}
            onChange={(e) => handleChangeContent(e.target.value)}
            required
          />
        </LetterContentContainer>
      </div>
    </LetterWrapper>
  );
}

const LetterForm = styled.form`
  .button {
    width: 600px;
  }
`;

export default NewLetter;
