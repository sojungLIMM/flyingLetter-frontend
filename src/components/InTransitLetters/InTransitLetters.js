import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import { throttle } from "lodash";

import Modal from "../common/Modal";
import InTransitLetterEntry from "../InTransitLetters/InTransitLetterEntry";
import ListWrapper from "../common/ListWrapper";
import PrevButton from "../common/PrevButton";
import { getDeliveredLetters } from "../../api/axios";
import { NO_FLYING_LETTER } from "../../constants";

function InTransitLetters() {
  const userId = useSelector(({ user }) => user.data._id);
  const loading = useSelector(({ user }) => user.status);

  const [errorMessage, setErrorMessage] = useState("");
  const [isNext, setIsNext] = useState(true);
  const [page, setPage] = useState(1);
  const [letters, setLetters] = useState([]);

  useEffect(() => {
    if (page === 1) {
      fetchLettersData();
      return;
    }

    const handleScrollThrottle = throttle(() => {
      const scrollHeight = document.documentElement.scrollHeight;
      const scrollTop = document.documentElement.scrollTop;
      const clientHeight = document.documentElement.clientHeight;

      if (clientHeight + scrollTop === scrollHeight) {
        fetchLettersData();
      }
    }, 500);

    window.addEventListener("scroll", handleScrollThrottle);

    return () => {
      window.removeEventListener("scroll", handleScrollThrottle);
    };
  }, [page, userId]);

  async function fetchLettersData() {
    try {
      const today = new Date();
      const { data } = await getDeliveredLetters(userId, {
        page,
        today,
        isDelivered: false,
      });

      setIsNext(data.data.isNext);

      if (!isNext) return;

      setLetters((prevLetters) => [...prevLetters, ...data.data.letters]);
      setPage((prevPage) => prevPage + 1);
    } catch (error) {
      setErrorMessage(error.response.data.message);
    }
  }

  return (
    <>
      {errorMessage && (
        <Modal onClick={setErrorMessage} width="50rem" height="20rem">
          <p>{errorMessage}</p>
        </Modal>
      )}
      <LettersWrapper>
        <PrevButton />
        {!letters.length && <p>{NO_FLYING_LETTER}</p>}
        {loading === "success" && (
          <LettersContainer>
            {letters.map((letter) => {
              const { _id, arrivedAt, from } = letter;

              return (
                <InTransitLetterEntry
                  key={_id}
                  id={_id}
                  arrivedAt={arrivedAt}
                  nickname={from.nickname}
                  country={from.country}
                  lat={from.lat}
                  lng={from.lng}
                />
              );
            })}
          </LettersContainer>
        )}
      </LettersWrapper>
    </>
  );
}

const LettersWrapper = styled(ListWrapper)`
  p {
    line-height: 50vh;
    text-align: center;
    font-size: 1.8rem;
    font-weight: bold;
  }
`;

const LettersContainer = styled.div`
  padding: 2em 0 0;
  width: 100%;
  display: grid;
  justify-content: center;
  grid-template-columns: 550px;
  grid-auto-rows: 130px;
  column-gap: 3vw;
  row-gap: 3vh;
`;

export default InTransitLetters;
