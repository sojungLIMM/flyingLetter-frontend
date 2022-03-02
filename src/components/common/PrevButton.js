import { Icon } from "@iconify/react";
import styled from "styled-components";

function PrevButton() {
  return (
    <>
      <Button>
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
