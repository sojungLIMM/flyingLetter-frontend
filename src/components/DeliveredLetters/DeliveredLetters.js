import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";

import Modal from "../common/Modal";
import LoadingSpinner from "../common/LoadingSpinner";
import DeliveredLetterEntry from "../DeliveredLetters/DeliveredLetterEntry";
import ListWrapper from "../common/ListWrapper";
import PrevButton from "../common/PrevButton";
import { getLetters } from "../../api/axios";
import { NO_DELIVERED_LETTER } from "../../constants";
import useIntersection from "../../hooks/useIntersection";

function DeliveredLetters() {
  const userId = useSelector(({ user }) => user.data._id);

  const [errorMessage, setErrorMessage] = useState("");
  const [page, setPage] = useState(1);
  const [isNext, setIsNext] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [letters, setLetters] = useState([]);

  const targetObserver = useIntersection(setPage, isNext);

  useEffect(() => {
    fetchLettersData(page);
  }, [page]);

  async function fetchLettersData(page) {
    try {
      setIsLoading(true);

      const today = new Date();
      const { data } = await getLetters(userId, {
        page,
        today,
        isDelivered: true,
      });

      setLetters((prev) => [...prev, ...data.data.letters]);
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
        <PrevButton path="/main" />
        {!isLoading && !letters.length && <p>{NO_DELIVERED_LETTER}</p>}
        {!!letters.length && (
          <LettersContainer>
            {letters.map((letter, index) => {
              const { _id, content, letterWallPaper, arrivedAt, from } = letter;
              const lastElement = index === letters.length - 1;

              return (
                <DeliveredLetterEntry
                  key={_id}
                  letterId={_id}
                  content={content}
                  letterWallPaper={letterWallPaper}
                  arrivedAt={arrivedAt}
                  nickname={from.nickname}
                  country={from.country}
                  userId={from._id}
                  lat={from.lat}
                  lng={from.lng}
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

export default DeliveredLetters;
