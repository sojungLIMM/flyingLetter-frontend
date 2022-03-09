import React, { useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { addSeconds } from "date-fns";
import styled from "styled-components";

import PrevButton from "../common/PrevButton";
import Modal from "../common/Modal";
import LetterWrapper from "../common/LetterWrapper";
import LetterContentContainer from "../common/LetterContentContainer";
import StyledButton from "../common/StyledButton";
import paper from "../../assets/leaf.jpg";
import getDistance from "../../utils/getDistance";
import { sendLetter } from "../../api/axios";
import { KM_PER_SECOND, MAX_FILE_SIZE } from "../../constants";

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

  function handleLetterPaperChange(e) {
    if (e.target.files[0].size > 1 * 1024 * 1024) {
      setModalMessage(MAX_FILE_SIZE);
      return;
    }

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

  async function handleLetterSubmit(e) {
    e.preventDefault();
    const [lat2, lng2] = friendData.coor;

    const distance = getDistance([lat, lng], [lat2, lng2]);
    const totalSeconds = distance / KM_PER_SECOND;
    const arrivedAt = addSeconds(new Date(), totalSeconds);

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

  function handleContentChange(content) {
    setContent(content);
  }

  function handleOkButtonClick() {
    navigate(friendData.path);
    setModalMessage(false);
  }

  function handleHomeButtonClick() {
    navigate("/");
    setErrorMessage(false);
  }

  return (
    <>
      {modalMessage && (
        <Modal width="50rem" height="20rem">
          <p>{modalMessage}</p>
          <button onClick={handleOkButtonClick}>확인</button>
        </Modal>
      )}
      {errorMessage && (
        <Modal width="50rem" height="20rem">
          <p>{errorMessage}</p>
          <button onClick={handleHomeButtonClick}>홈으로</button>
        </Modal>
      )}
      <LetterWrapper>
        <ButtonContainer>
          <PrevButton path={friendData.path} />
          <LetterForm
            encType="multipart/form-data"
            onSubmit={handleLetterSubmit}
          >
            <StyledButton
              type="button"
              onClick={(e) => {
                e.preventDefault();
                imageFile.current.click();
              }}
            >
              편지지 선택
            </StyledButton>
            <StyledButton type="submit">편지 보내기</StyledButton>
            <input
              type="file"
              ref={imageFile}
              accept="image/jpg, image/png, image/jpeg"
              name="letterWallPaper"
              onChange={handleLetterPaperChange}
              style={{ display: "none" }}
            />
          </LetterForm>
        </ButtonContainer>
        <LetterContentContainer>
          <img src={letterPaper} alt="wallpaper" />
          <textarea
            value={content}
            onChange={(e) => handleContentChange(e.target.value)}
            required
          />
        </LetterContentContainer>
      </LetterWrapper>
    </>
  );
}

const LetterForm = styled.form`
  display: flex;
`;

const ButtonContainer = styled.div`
  width: 600px;
  display: flex;
`;

export default NewLetter;
