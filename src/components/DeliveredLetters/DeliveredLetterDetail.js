import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";

import LetterWrapper from "../common/LetterWrapper";
import LetterContentContainer from "../common/LetterContentContainer";
import StyledButton from "../common/StyledButton";
import paper from "../../assets/leaf.jpg";

function DeliveredLetterDetail() {
  const navigate = useNavigate();
  const { userId, letterId, content, letterWallPaper, userLat, userLng } =
    useLocation().state;

  function handleReplayButtonClick() {
    navigate(`/sendLetter/${userId}`, {
      state: { coor: [userLat, userLng], path: "/letters/delivered", letterId },
    });
  }

  return (
    <LetterWrapper>
      <ButtonWrapper>
        <StyledButton onClick={handleReplayButtonClick}>답장하기</StyledButton>
      </ButtonWrapper>
      <LetterContentContainer>
        <img src={letterWallPaper ? letterWallPaper : paper} alt="wallpaper" />
        <textarea value={content} readOnly />
      </LetterContentContainer>
    </LetterWrapper>
  );
}

const ButtonWrapper = styled.div`
  width: 600px;
  display: flex;
  justify-content: flex-end;
`;

export default DeliveredLetterDetail;
