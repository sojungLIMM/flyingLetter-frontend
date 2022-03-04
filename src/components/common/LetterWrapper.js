import styled from "styled-components";

export const LetterWrapper = styled.div`
  min-height: 100vh;
  min-width: 100vw;
  display: flex;
  justify-content: center;
  align-items: center;

  .container {
    position: relative;
    width: 100%;
    min-width: 400px;
    height: 100vh;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    flex-direction: column;
    background: rgba(245, 244, 239, 0.7);
  }
`;
