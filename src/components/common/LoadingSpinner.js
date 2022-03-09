import styled, { keyframes } from "styled-components";

const spin = keyframes`
   0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
`;

const LoadingSpinner = styled.div`
  width: ${(props) => props.width || "120px"};
  height: ${(props) => props.height || "120px"};
  margin: 30px;
  border: 15px solid #f3f3f3;
  border-top: 16px solid #0e0f0f21;
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
`;

export default LoadingSpinner;
