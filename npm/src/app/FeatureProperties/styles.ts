import styled from 'styled-components';

export const Properties = styled.div`
  width: 100%;
`;
export const Item = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  height: 20px;
`;
export const ItemLabel = styled.div`
  width: 50%;
  font-size: 11px;
`;
export const ItemValue = styled.div`
  width: 50%;
  font-size: 11px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;