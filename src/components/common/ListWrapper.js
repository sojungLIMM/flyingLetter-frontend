import styled from "styled-components";

const ListWrapper = styled.div`
  min-height: 100vh;
  min-width: 100vw;
  display: flex;
  justify-content: center;
  align-items: center;

  .container {
    position: relative;
    width: 100%;
    min-height: 100vh;
    overflow: scroll;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    flex-direction: column;
    background: rgba(245, 244, 239, 0.7);
  }
`;

export default ListWrapper;
