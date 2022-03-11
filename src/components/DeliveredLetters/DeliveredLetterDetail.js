import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";

import LetterWrapper from "../common/LetterWrapper";
import LetterContentContainer from "../common/LetterContentContainer";
import StyledButton from "../common/StyledButton";
import paper from "../../assets/leaf.jpg";

function DeliveredLetterDetail() {
  const navigate = useNavigate();
  const {
    userId,
    letterId,
    content,
    letterWallPaper,
    fromLat,
    fromLng,
    toLat,
    toLng,
  } = useLocation().state;

  function handleReplayButtonClick() {
    navigate(`/sendLetter/${userId}`, {
      state: {
        toLat,
        toLng,
        path: "/letters/delivered",
        letterId,
        fromLat,
        fromLng,
      },
    });
  }

  return (
    <LetterWrapper>
      <ButtonWrapper>
        <StyledButton onClick={handleReplayButtonClick}>답장하기</StyledButton>
      </ButtonWrapper>
      <LetterContentContainer>
        <img src={!letterWallPaper ? paper : letterWallPaper} alt="wallpaper" />
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
