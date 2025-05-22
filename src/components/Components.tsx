import styled from "@emotion/styled";

export const Row = styled.div`
  display: flex;
  justify-content: space-between;
  position: relative;
`;

export const DeleteButton = styled.button`
  width: 1em;
  height: 1em;
  line-height: 1;
  color: #fff;
  font-size: 20px;
  padding: 4px;
  border: solid 1px #c00;
  box-sizing: content-box;
  border-radius: 12px;
  cursor: pointer;
  background: #c00;
  position: absolute;
  bottom: 0;
  right: calc(-1em - 8px - 12px);
`;
