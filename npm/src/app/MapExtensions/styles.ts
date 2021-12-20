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
  transition: top 0.2s, transform 0.2s;
`;
export const MenuWrapper = styled.div`
  padding: ${({ isOpening }: Menu) => isOpening ? '10px 10px 28px 10px ' : '0'};
  width: ${({ isOpening }: Menu) => isOpening ? '350px' : '0'};
  height: ${({ isOpening, height }: Menu) => isOpening ? height : '0'};
  transition: padding 0.2s, width 0.2s, height 0.2s;
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
  min-height: 30px;
`;
export const ItemLabel = styled.div`
  margin-right: 10px;
  width: calc(50% - 10px);
  font-size: 11px;
`;
export const ItemValue = styled.div`
  width: 50%;
`;
export const Select = styled.select`
  position: relative;
  display: block;
  width: 100%;
  padding: 6px 3px;
  font-size: 11px;
  line-height: 1.5715;
  color: #333333;
  background-color: #ffffff;
  border: 1px solid #dddddd;
  white-space: nowrap;
  user-select: none;
  transition: border-color .15s ease-in-out,box-shadow .15s ease-in-out;
  border-radius: 5px;
  cursor: pointer;
  outline: 0;
`;
export const Option = styled.option``;
