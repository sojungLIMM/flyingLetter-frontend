import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { throttle } from "lodash";

import Modal from "../components/common/Modal";
import FriendListEntry from "../components/FriendListEntry";
import PrevButton from "../components/common/PrevButton";
import { getFriendList } from "../api/axios";

function FriendList() {
  const [modalMessage, setModalMessage] = useState("");
  const [page, setPage] = useState(1);
  const [friendList, setFriendList] = useState([]);

  useEffect(() => {
    const handleScrollThrottle = throttle(() => {
      const scrollHeight = document.documentElement.scrollHeight;
      const scrollTop = document.documentElement.scrollTop;
      const clientHeight = document.documentElement.clientHeight;

      if (clientHeight + scrollTop === scrollHeight) {
        (async () => {
          try {
            const { data } = await getFriendList({ page });

            setFriendList((prevList) => [...prevList, ...data.data.users]);

            if (!data.data.isNext) return;

            setPage((prevPage) => prevPage + 1);
          } catch (err) {
            setModalMessage(err.response.data.message);
          }
        })();
      }
    }, 500);

    window.addEventListener("scroll", handleScrollThrottle);

    return () => {
      window.removeEventListener("scroll", handleScrollThrottle);
    };
  });

  return (
    <FriendListWrapper>
      {modalMessage && (
        <Modal onClick={setModalMessage} width="50rem" height="20rem">
          <p>{modalMessage}</p>
        </Modal>
      )}
      <div className="container">
        <div>
          <PrevButton />
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
      </div>
    </FriendListWrapper>
  );
}

const FriendListWrapper = styled.div`
  min-height: 100vh;
  min-width: 100vw;
  display: flex;
  justify-content: center;
  align-items: center;

  .container {
    width: 100%;
    min-height: 100vh;
    overflow: scroll;
    position: relative;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    flex-direction: column;
    background: rgba(245, 244, 239, 0.7);
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
