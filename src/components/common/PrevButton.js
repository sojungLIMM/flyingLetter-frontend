import React from "react";
import { useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";
import styled from "styled-components";
import PropTypes from "prop-types";

function PrevButton({ path = -1 }) {
  const navigate = useNavigate();

  return (
    <>
      <Button onClick={() => navigate(path)}>
        <Icon icon="ci:circle-left" height="4rem" />
      </Button>
    </>
  );
}

const Button = styled.button`
  background-color: transparent;
  border: none;
  cursor: pointer;
`;

PrevButton.propTypes = {
  path: PropTypes.string,
};

export default PrevButton;
