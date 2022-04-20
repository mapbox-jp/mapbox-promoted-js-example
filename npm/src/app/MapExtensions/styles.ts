import styled from 'styled-components';

type SwitchIcon = {
  isOpening?: boolean;
};
type Menu = {
  isOpening?: boolean;
  height?: string;
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
  position: absolute;
  padding: 8px;
  left: 0;
  bottom: 0;
  cursor: pointer;
  transform: ${({ isOpening }: SwitchIcon) => isOpening ? 'rotate(0deg)' : 'rotate(180deg)'};
  transition: top 0.1s, transform 0.1s;
`;
export const MenuWrapper = styled.div`
  padding: ${({ isOpening }: Menu) => isOpening ? '10px 10px 28px 10px ' : '0'};
  width: ${({ isOpening }: Menu) => isOpening ? '350px' : '0'};
  height: ${({ isOpening, height }: Menu) => isOpening ? height : '0'};
  transition: padding 0.1s, width 0.1s, height 0.1s;
  overflow: hidden;
  white-space: nowrap;
`;
export const Menu = styled.div`
  overflow: hidden;
  white-space: nowrap;
`;
export const MenuItem = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  min-height: 28px;
`;
export const ItemLabel = styled.div`
  margin-right: 10px;
  width: calc(50% - 10px);
  font-size: 11px;
`;
export const ItemValue = styled.div`
  width: 50%;
`;
