import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { LetterWrapper } from "../common/LetterWrapper";
import { LetterContentContainer } from "../common/LetterContentContainer";
import paper from "../../assets/leaf.jpg";

function DeliveredLetterDetail() {
  const navigate = useNavigate();
  const { id, content, letterWallPaper, lat, lng } = useLocation().state;

  function handleClickReplayButton() {
    navigate(`/sendLetter/${id}`, {
      state: { coor: [lat, lng], path: "/letters/delivered" },
    });
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
