import React from "react";
import { useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";
import styled from "styled-components";

function PrevButton() {
  const navigate = useNavigate();
  return (
    <>
      <Button onClick={() => navigate(-1)}>
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

export default PrevButton;
