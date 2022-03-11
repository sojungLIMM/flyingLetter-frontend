import React from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import styled from "styled-components";
import { Icon } from "@iconify/react";
import { parseISO, format } from "date-fns";

function DeliveredLetterEntry({
  letterId,
  content,
  letterWallPaper,
  arrivedAt,
  nickname,
  country,
  userId,
  lat,
  lng,
  targetRef,
}) {
  const navigate = useNavigate();

  function handleLetterClick() {
    navigate(`/letters/delivered/${letterId}`, {
      state: { userId, content, letterWallPaper, toLat: lat, toLng: lng },
    });
  }

  return (
    <LetterContainer onClick={handleLetterClick} ref={targetRef}>
      <Icon icon="fluent:mail-template-24-regular" color="#444" height="100" />
      <div className="info">
        <div>친구: {nickname}</div>
        <div>국가: {country}</div>
        <div>
          도착 날짜: {format(parseISO(arrivedAt), "yyyy.MM.dd aa HH:mm")}
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

DeliveredLetterEntry.propTypes = {
  letterId: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired,
  letterWallPaper: PropTypes.string,
  arrivedAt: PropTypes.string.isRequired,
  nickname: PropTypes.string.isRequired,
  country: PropTypes.string.isRequired,
  userId: PropTypes.string.isRequired,
  lat: PropTypes.number.isRequired,
  lng: PropTypes.number.isRequired,
  targetRef: PropTypes.func,
};

export default DeliveredLetterEntry;
