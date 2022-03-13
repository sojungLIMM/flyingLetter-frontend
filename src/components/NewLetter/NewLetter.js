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
import getDistance from "../../utils/getDistance";
import { sendLetter } from "../../api/axios";
import { KM_PER_SECOND, MAX_FILE_SIZE } from "../../constants";
import paper from "../../assets/leaf.jpg";

function NewLetter() {
  const { _id, lat, lng } = useSelector(({ user }) => user.data);
  const { state } = useLocation();
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
      setErrorMessage(MAX_FILE_SIZE);
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

    try {
      const formData = new FormData();

      if (state.leaveLetter) {
        formData.append("lat", state.lat);
        formData.append("lng", state.lng);
        formData.append("from", _id);
        formData.append("content", content);
        formData.append("letterWallPaper", newLetterPaper);

        await sendLetter(formData, _id);
        setModalMessage("편지를 현재 위치에 ..");

        return;
      }

      if (state.letterId) {
        const distance = getDistance(
          [state.fromLat, state.fromLng],
          [state.toLat, state.toLng]
        );
        const totalSeconds = distance / KM_PER_SECOND;
        const arrivedAt = addSeconds(new Date(), totalSeconds);

        formData.append("to", friendId);
        formData.append("arrivedAt", arrivedAt);
        formData.append("from", _id);
        formData.append("content", content);
        formData.append("letterWallPaper", newLetterPaper);
        formData.append("letterId", state.letterId);
        formData.append("newFromLat", state.fromLat);
        formData.append("newFromLng", state.fromLng);

        await sendLetter(formData, _id);
        setModalMessage("편지 배송을 시작합니다.");

        return;
      }

      const distance = getDistance([lat, lng], [state.toLat, state.toLng]);
      const totalSeconds = distance / KM_PER_SECOND;
      const arrivedAt = addSeconds(new Date(), totalSeconds);

      formData.append("to", friendId);
      formData.append("arrivedAt", arrivedAt);
      formData.append("from", _id);
      formData.append("content", content);
      formData.append("letterWallPaper", newLetterPaper);

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
    if (state.leaveLetter) {
      navigate("/main");
      setModalMessage(false);
      return;
    }

    navigate(state.path);
    setModalMessage(false);
  }

  return (
    <>
      {modalMessage && (
        <Modal width="50rem" height="20rem">
          <div className="content">
            <p>{modalMessage}</p>
            <button onClick={handleOkButtonClick}>확인</button>
          </div>
        </Modal>
      )}
      {errorMessage && (
        <Modal onClick={setErrorMessage} width="50rem" height="20rem">
          <div className="content">
            <p>{errorMessage}</p>
            <button onClick={handleOkButtonClick}>확인</button>
          </div>
        </Modal>
      )}
      <LetterWrapper>
        <ButtonContainer>
          <PrevButton path={state.leaveLetter ? "/main" : state.path} />
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
