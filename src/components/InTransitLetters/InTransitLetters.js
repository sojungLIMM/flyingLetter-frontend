import React, { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";

import Modal from "../common/Modal";
import LoadingSpinner from "../common/LoadingSpinner";
import InTransitLetterEntry from "../InTransitLetters/InTransitLetterEntry";
import ListWrapper from "../common/ListWrapper";
import PrevButton from "../common/PrevButton";
import { getLetters } from "../../api/axios";
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
  const [isNext, setIsNext] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [letters, setLetters] = useState([]);

  const targetObserver = useRef();

  useEffect(() => {
    fetchLettersData(page);
  }, [page]);

  useEffect(() => {
    let observer;

    if (targetObserver.current) {
      observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && isNext) {
          setPage((prevPage) => prevPage + 1);
        }
      }, options);

      observer.observe(targetObserver.current);
    }

    return () => {
      observer?.disconnect(targetObserver.current);
    };
  }, [targetObserver.current, isNext]);

  async function fetchLettersData(page) {
    try {
      setIsLoading(true);

      const today = new Date();
      const { data } = await getLetters(userId, {
        page,
        today,
        isDelivered: false,
      });

      setLetters((prevLetters) => [...prevLetters, ...data.data.letters]);
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
      <LettersWrapper>
        <PrevButton />
        {!isLoading && !letters.length && <p>{NO_FLYING_LETTER}</p>}
        {!!letters.length && (
          <LettersContainer>
            {letters.map((letter, index) => {
              const { _id, arrivedAt, newFromLat, newFromLng, from } = letter;
              const lastElement = index === letters.length - 1;

              return (
                <InTransitLetterEntry
                  key={_id}
                  id={_id}
                  arrivedAt={arrivedAt}
                  nickname={from.nickname}
                  country={from.country}
                  lat={!newFromLat ? from.lat : newFromLat}
                  lng={!newFromLng ? from.lng : newFromLng}
                  targetRef={lastElement ? targetObserver : null}
                />
              );
            })}
          </LettersContainer>
        )}
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
