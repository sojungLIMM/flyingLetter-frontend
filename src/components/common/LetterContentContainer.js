import styled from "styled-components";

const LetterContentContainer = styled.div`
  position: relative;

  img,
  textarea {
    width: 600px;
    height: 100vh;
  }

  textarea {
    padding: 50px;
    position: absolute;
    top: 0;
    left: 0;
    background: rgba(255, 255, 255, 0.5);
    object-fit: cover;
    border: none;
    font-size: 1.5rem;
  }
`;

export default LetterContentContainer;
