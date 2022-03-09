import React, { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";

import Modal from "../common/Modal";
import LoadingSpinner from "../common/LoadingSpinner";
import InTransitLetterEntry from "../InTransitLetters/InTransitLetterEntry";
import ListWrapper from "../common/ListWrapper";
import PrevButton from "../common/PrevButton";
import { getDeliveredLetters } from "../../api/axios";
import { NO_FLYING_LETTER } from "../../constants";

const options = {
  root: null,
  rootMargin: "1px",
  threshold: "1",
};

function InTransitLetters() {
  const userId = useSelector(({ user }) => user.data._id);

  const [errorMessage, setErrorMessage] = useState("");
  const [page, setPage] = useState(1);
  const [isNext, setIsNext] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [letters, setLetters] = useState([]);

  const targetObserver = useRef();

  useEffect(() => {
    fetchLettersData(page);
  }, [page]);

  useEffect(() => {
    if (isLoading) {
      const observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          loadMore();
        }
      }, options);
      observer.observe(targetObserver.current);
    }
  }, [isLoading]);

  async function fetchLettersData(page) {
    try {
      const today = new Date();
      const { data } = await getDeliveredLetters(userId, {
        page,
        today,
        isDelivered: false,
      });

      setLetters((prevLetters) => [...prevLetters, ...data.data.letters]);
      setIsLoading(true);
      setIsNext(data.data.isNext);
    } catch (error) {
      setErrorMessage(error.response.data.message);
      setIsLoading(false);
    }
  }

  function loadMore() {
    setPage((prevPage) => prevPage + 1);
  }

  return (
    <>
      {!isLoading && errorMessage && (
        <Modal onClick={setErrorMessage} width="50rem" height="20rem">
          <p>{errorMessage}</p>
        </Modal>
      )}
      <LettersWrapper>
        <PrevButton />
        {!isLoading && !letters.length && <p>{NO_FLYING_LETTER}</p>}
        <LettersContainer>
          {letters.map((letter, index) => {
            const { _id, arrivedAt, from } = letter;
            const lastElement = index === letters.length - 1;

            return (
              <InTransitLetterEntry
                key={_id}
                id={_id}
                arrivedAt={arrivedAt}
                nickname={from.nickname}
                country={from.country}
                lat={from.lat}
                lng={from.lng}
                targetRef={lastElement ? targetObserver : null}
              />
            );
          })}
        </LettersContainer>
        {isLoading && isNext && <LoadingSpinner />}
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
