import styled from 'styled-components';

type SwitchIcon = {
  isOpening?: boolean;
};
type Menu = {
  isOpening?: boolean;
};
type Button = {
  disable?: boolean;
};

export const Container = styled.div`
  display: flex;
  align-items: center;
  min-width: 26px;
  min-height: 26px;
  background-clip: border-box;
  border-radius 5px;
`;
export const SwitchIcon = styled.div`
  padding: 8px;
  cursor: pointer;
  transform: ${({ isOpening }: SwitchIcon) => isOpening ? 'rotate(180deg)' : 'rotate(0deg)'};
  transition: transform 0.1s;
`;
export const Menu = styled.div`
  display: flex;
  justify-content: center;
  padding: ${({ isOpening }: Menu) => isOpening ? '0 10px 0 0;' : '0'};
  width: ${({ isOpening }: Menu) => isOpening ? '270px' : '0'};
  transition: padding 0.1s, width 0.1s;
  overflow: hidden;
  white-space: nowrap;
`;
export const Button = styled.span`
  padding: 0 5px;
  color: #333333;
  font-size: 11px;
  color: rgba(51, 51, 51, 0.4);
  border: 1px solid transparent;
  border-color: transparent;
  background-color: transparent;
  transition: all 0.1s;
  cursor: pointer;
  &:hover {
    color: ${({ disable }: Button) => disable ? 'rgba(51, 51, 51, 0.4)' : '#000000'};
  }
  & + & {
    margin-left: 5px;
  }
`;
