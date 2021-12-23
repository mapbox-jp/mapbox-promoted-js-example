import styled from 'styled-components';

type Item = {
  isAnalitics?: boolean;
};

export const Properties = styled.div`
  width: 100%;
`;
export const Item = styled.div`
  display: flex;
  align-items: center;
  padding: 0 5px;
  width: 100%;
  height: 20px;
  background-color: ${({ isAnalitics }: Item) => isAnalitics ? '#c9c9c9' : '#e7e7e7' };
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
