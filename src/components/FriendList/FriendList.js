import React, { useState, useEffect } from "react";
import styled from "styled-components";

import Modal from "../common/Modal";
import LoadingSpinner from "../common/LoadingSpinner";
import FriendListEntry from "../FriendList/FriendListEntry";
import PrevButton from "../common/PrevButton";
import ListWrapper from "../common/ListWrapper";
import { getFriendList } from "../../api/axios";
import useIntersection from "../../hooks/useIntersection";

function FriendList() {
  const [errorMessage, setErrorMessage] = useState("");
  const [page, setPage] = useState(1);
  const [isNext, setIsNext] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [friendList, setFriendList] = useState([]);

  const targetObserver = useIntersection(setPage, isNext);

  useEffect(() => {
    fetchFriendsData(page);
  }, [page]);

  async function fetchFriendsData(page) {
    try {
      setIsLoading(true);

      const { data } = await getFriendList({ page });

      setFriendList((prevList) => [...prevList, ...data.data.users]);
      setIsLoading(false);
      setIsNext(data.data.isNext);
    } catch (error) {
      setErrorMessage(error.response.data.message);
      setIsLoading(false);
    }
  }

  return (
    <>
      {!isLoading && errorMessage && (
        <Modal onClick={setErrorMessage} width="50rem" height="20rem">
          <div className="content">
            <p>{errorMessage}</p>
          </div>
        </Modal>
      )}
      <FriendListWrapper>
        <PrevButton path="/main" />
        {!isLoading && !friendList.length && <p>등록된 친구가 없습니다.</p>}
        {!!friendList.length && (
          <FriendListContainer>
            {friendList.map((user, index) => {
              const lastIndex = index === friendList.length - 1;
              const {
                _id,
                country,
                nickname,
                language,
                lat,
                lng,
                profileImage,
              } = user;

              return (
                <FriendListEntry
                  key={_id}
                  id={_id}
                  toLat={lat}
                  toLng={lng}
                  profileImage={profileImage}
                  nickname={nickname}
                  country={country}
                  language={language}
                  targetRef={lastIndex ? targetObserver : null}
                />
              );
            })}
          </FriendListContainer>
        )}
        {isLoading && isNext && <LoadingSpinner />}
      </FriendListWrapper>
    </>
  );
}

const FriendListWrapper = styled(ListWrapper)`
  .button {
    width: 600px;
  }

  p {
    line-height: 50vh;
    text-align: center;
    font-size: 1.8rem;
    font-weight: bold;
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
