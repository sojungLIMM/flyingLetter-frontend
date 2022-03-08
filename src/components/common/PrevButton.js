import React from "react";
import { useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";
import styled from "styled-components";
import PropTypes from "prop-types";

function PrevButton({ path = -1 }) {
  const navigate = useNavigate();

  return (
    <ButtonWrappaer>
      <button onClick={() => navigate(path)}>
        <Icon icon="ci:circle-left" height="4rem" />
      </button>
    </ButtonWrappaer>
  );
}

const ButtonWrappaer = styled.div`
  width: 600px;

  button {
    background-color: transparent;
    border: none;
    cursor: pointer;
  }
`;

PrevButton.propTypes = {
  path: PropTypes.string,
};

export default PrevButton;
