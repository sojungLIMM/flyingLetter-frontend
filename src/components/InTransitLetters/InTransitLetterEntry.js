import React from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import styled from "styled-components";
import { formatDistanceToNow } from "date-fns";

import plane from "../../assets/Group.png";

function InTransitLetterEntry({ id, arrivedAt, nickname, country, lat, lng }) {
  const navigate = useNavigate();

  function handleClickLetter() {
    navigate(`/letters/inTransit/${id}`, { state: { arrivedAt, lat, lng } });
  }

  return (
    <LetterContainer onClick={handleClickLetter}>
      <img src={plane} />
      <div className="info">
        <div>친구: {nickname}</div>
        <div>국가: {country}</div>
        <div>
          남은 시간:{" "}
          {formatDistanceToNow(new Date(arrivedAt), { includeSeconds: true })}
        </div>
      </div>
    </LetterContainer>
  );
}

const LetterContainer = styled.div`
  display: flex;
  align-items: center;
  padding: 40px;
  background: rgba(240, 228, 198, 1);
  border-radius: 15px;

  .info {
    height: 70%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    margin-left: 40px;
    line-height: 25px;
    font-size: 1.3rem;
  }
`;

InTransitLetterEntry.propTypes = {
  id: PropTypes.string.isRequired,
  lat: PropTypes.number.isRequired,
  lng: PropTypes.number.isRequired,
  arrivedAt: PropTypes.string.isRequired,
  nickname: PropTypes.string.isRequired,
  country: PropTypes.string.isRequired,
};

export default InTransitLetterEntry;
