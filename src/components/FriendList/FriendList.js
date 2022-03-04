import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { throttle } from "lodash";

import Modal from "../common/Modal";
import FriendListEntry from "../FriendList/FriendListEntry";
import PrevButton from "../common/PrevButton";
import ListWrapper from "../common/ListWrapper";
import { getFriendList } from "../../api/axios";

function FriendList() {
  const [errorMessage, setErrorMessage] = useState("");
  const [page, setPage] = useState(1);
  const [isNext, setIsNext] = useState(true);
  const [friendList, setFriendList] = useState([]);

  useEffect(() => {
    if (page === 1) {
      fetchFriendsData();
      return;
    }

    const handleScrollThrottle = throttle(() => {
      const scrollHeight = document.documentElement.scrollHeight;
      const scrollTop = document.documentElement.scrollTop;
      const clientHeight = document.documentElement.clientHeight;

      if (clientHeight + scrollTop === scrollHeight) {
        fetchFriendsData();
      }
    }, 500);

    window.addEventListener("scroll", handleScrollThrottle);

    return () => {
      window.removeEventListener("scroll", handleScrollThrottle);
    };
  }, [page]);

  async function fetchFriendsData() {
    try {
      const { data } = await getFriendList({ page });

      setIsNext(data.data.isNext);

      if (!isNext) return;

      setFriendList((prevList) => [...prevList, ...data.data.users]);
      setPage((prevPage) => prevPage + 1);
    } catch (error) {
      setErrorMessage(error.response.data.message);
    }
  }

  return (
    <ListWrapper>
      {errorMessage && (
        <Modal onClick={setErrorMessage} width="50rem" height="20rem">
          <p>{errorMessage}</p>
        </Modal>
      )}
      <FriendListWrapper className="container">
        <div className="button">
          <PrevButton path="/main" />
        </div>
        <FriendListContainer>
          {friendList.map((user) => {
            const { _id, country, nickname, language, lat, lng, profileImage } =
              user;

            return (
              <FriendListEntry
                key={_id}
                id={_id}
                coor={`${lat}_${lng}`}
                profileImage={profileImage}
                nickname={nickname}
                country={country}
                language={language}
              />
            );
          })}
        </FriendListContainer>
      </FriendListWrapper>
    </ListWrapper>
  );
}

const FriendListWrapper = styled.div`
  .button {
    width: 600px;
  }
`;

const FriendListContainer = styled.div`
  padding: 2em 0 0;
  width: 100%;
  display: grid;
  justify-content: center;
  grid-template-columns: repeat(2, 250px);
  grid-auto-rows: 300px;
  column-gap: 3vw;
  row-gap: 3vh;
`;

export default FriendList;
