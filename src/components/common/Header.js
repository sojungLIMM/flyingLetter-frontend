import { Icon } from "@iconify/react";
import styled from "styled-components";

function Header() {
  return (
    <HeaderContainer>
      Flying Letter
      <Icon icon="openmoji:small-airplane" height="90" />
    </HeaderContainer>
  );
}

const HeaderContainer = styled.p`
  width: 55rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 6rem;
  margin-bottom: 60px;
  border-bottom: 5px solid #66b28a;
  font-weight: bolder;
`;

export default Header;
