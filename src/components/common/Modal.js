import PropTypes from "prop-types";
import styled from "styled-components";

export default function Modal({ onClick, width, height, children }) {
  return (
    <>
      <OverlayWrapper onClick={() => onClick((prev) => !prev)} />
      <ModalWrapper width={width} height={height}>
        {children}
      </ModalWrapper>
    </>
  );
}

const ModalWrapper = styled.div`
  position: fixed;
  overflow: hidden;
  z-index: 100;
  top: 50%;
  left: 50%;
  padding: 30px;
  width: ${(props) => props.width || "auto"};
  height: ${(props) => props.height || "auto"};
  background-color: #fff;
  border-radius: 10px;
  box-shadow: rgba(0, 0, 0, 0.5);
  transform: translate(-50%, -50%);
  font-size: 1.7rem;
  font-weight: bold;

  .content {
    display: flex;
    align-items: center;
    flex-direction: column;
  }

  .content button {
    margin: 30px 0;
    padding: 8px 18px;
    background: #66b28a;
    border: none;
    border-radius: 4px;
    color: #fff;
    font-weight: bold;
    cursor: pointer;
  }
`;

const OverlayWrapper = styled.div`
  position: fixed;
  z-index: 10;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.75);
`;

Modal.propTypes = {
  onClick: PropTypes.func,
  width: PropTypes.string.isRequired,
  height: PropTypes.string.isRequired,
  children: PropTypes.node,
};
