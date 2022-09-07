import styled from 'styled-components';

export const Container = styled.div`
  position: absolute;
  padding: 3px 6px;
  top: 10px;
  left: 10px;
  color: #ffffff;
  font-size: 11px;
  background-color: #00000070;
`;
export const Item = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  height: 20px;
`;
export const ItemLabel = styled.div`
  width: 50px;
  font-size: 10px;
`;
export const ItemValue = styled.div`
  font-size: 10px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;
