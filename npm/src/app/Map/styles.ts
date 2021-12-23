import styled from 'styled-components';

export const Container = styled.div`
  width: 100%;
  height: 100%;
`;
export const Debug = styled.div`
  position: absolute;
  padding: 3px;
  width: 200px;
  top: 10px;
  left: 10px;
  color: #ffffff;
  font-size: 11px;
  background-color: #00000070;
`;
export const Item = styled.div`
  display: flex;
  align-items: center;
  padding: 0 5px;
  width: 100%;
  height: 20px;
`;
export const ItemLabel = styled.div`
  width: 20%;
  font-size: 10px;
`;
export const ItemValue = styled.div`
  width: 80%;
  font-size: 10px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

