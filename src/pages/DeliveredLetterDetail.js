import React from "react";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import { LetterWrapper } from "../components/common/LetterWrapper";
import { LetterContentContainer } from "../components/common/LetterContentContainer";
import paper from "../assets/leaf.jpg";

function DeliveredLetterDetail() {
  const navigate = useNavigate();
  const { id, content, letterWallPaper } = useLocation().state;

  function handleClickReplayButton() {
    navigate(`/sendLetter/${id}`, { state: { path: "/letters/delivered" } });
  }

  return (
    <LetterWrapper>
      <div className="container">
        <button onClick={handleClickReplayButton}>답장하기</button>
        <LetterContentContainer>
          <img src={letterWallPaper ? letterWallPaper : paper} />
          <textarea value={content} readOnly />
        </LetterContentContainer>
      </div>
    </LetterWrapper>
  );
}

export default DeliveredLetterDetail;
