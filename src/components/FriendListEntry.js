import React from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import styled from "styled-components";
import { Icon } from "@iconify/react";

function FriendListEntry({ id, profileImage, nickname, country, language }) {
  const navigate = useNavigate();

  function handleClickWriteButton() {
    navigate(`/sendLetter/${id}`);
  }

  return (
    <FriendContainer>
      <img src={profileImage} />
      <div className="nickname">{nickname}</div>
      <div>{country}</div>
      <div>{language}</div>
      <button onClick={handleClickWriteButton}>
        편지쓰기
        <Icon icon="ic:round-airplane-ticket" color="#545454" height="15" />
      </button>
    </FriendContainer>
  );
}

const FriendContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: rgba(239, 183, 185, 0.85);
  border-radius: 30px;

  img {
    object-fit: cover;
    width: 16rem;
    height: 16rem;
    margin-bottom: 8px;
    border-radius: 50%;
    border: 4px solid #fff;
  }

  div {
    margin: 5px;
    font-size: 1.4rem;
  }

  .nickname {
    font-size: 1.7rem;
    font-weight: bold;
  }

  button {
    border-radius: 20px;
    border: 3px solid #fff;
    padding: 3px 20px;
    background: rgba(238, 238, 238, 0.79);
  }
`;

FriendListEntry.propTypes = {
  id: PropTypes.string.isRequired,
  profileImage: PropTypes.string.isRequired,
  nickname: PropTypes.string.isRequired,
  country: PropTypes.string.isRequired,
  language: PropTypes.string.isRequired,
};

export default FriendListEntry;
