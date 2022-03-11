import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";

import Modal from "../common/Modal";
import LoadingSpinner from "../common/LoadingSpinner";
import FriendListEntry from "../FriendList/FriendListEntry";
import PrevButton from "../common/PrevButton";
import ListWrapper from "../common/ListWrapper";
import { getFriendList } from "../../api/axios";

const options = {
  root: null,
  rootMargin: "1px",
  threshold: "1",
};

function FriendList() {
  const [errorMessage, setErrorMessage] = useState("");
  const [page, setPage] = useState(1);
  const [isNext, setIsNext] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [friendList, setFriendList] = useState([]);
  const [lastElement, setLastElement] = useState(null);

  const targetObserver = useRef(
    new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setPage((prevPage) => prevPage + 1);
      }
    }, options)
  );

  useEffect(() => {
    if (isNext) {
      fetchFriendsData(page);
    }
  }, [page, isNext]);

  useEffect(() => {
    const currentElement = lastElement;
    const currentObserver = targetObserver.current;

    if (currentElement) {
      currentObserver.observe(currentElement);
    }

    return () => {
      if (currentElement) {
        currentObserver.unobserve(currentElement);
      }
    };
  }, [lastElement]);

  async function fetchFriendsData(page) {
    try {
      setIsLoading(true);

      const { data } = await getFriendList({ page });

      setFriendList((prev) => [...new Set([...prev, ...data.data.users])]);
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
          <p>{errorMessage}</p>
        </Modal>
      )}
      <FriendListWrapper>
        <PrevButton path="/main" />
        {!isLoading && !friendList.length && <p>등록된 친구가 없습니다.</p>}
        {!!friendList.length && !isLoading && (
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
                  coor={`${lat}_${lng}`}
                  profileImage={profileImage}
                  nickname={nickname}
                  country={country}
                  language={language}
                  targetRef={lastIndex ? setLastElement : null}
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
