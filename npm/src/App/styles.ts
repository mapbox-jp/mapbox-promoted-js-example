import styled from 'styled-components';

export const Container = styled.div`
  width: 100%;
  height: 100%;
`;
export const PromotionPanel = styled.div`
  position: absolute;
  padding: 10px;
  bottom: 30px;
  left: 10px;
  min-width: 120px;
  min-height: 55px;
  background-color: #fff;
  background-clip: border-box;
  border: 1px solid rgba(0, 0, 0, 0.125);
  border-radius 5px;
  box-shadow: 0 0 0 1.5px rgb(0 0 0 / 10%);
`;
export const Select = styled.select`
  position: relative;
  display: block;
  width: 100%;
  padding: 7px 0;
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
export const DebugPanel = styled.div`
  position: absolute;
  padding: 10px;
  bottom: 30px;
  right: 10px;
  min-width: 200px;
  min-height: 55px;
  background-color: #fff;
  background-clip: border-box;
  border: 1px solid rgba(0, 0, 0, 0.125);
  border-radius 5px;
  box-shadow: 0 0 0 1.5px rgb(0 0 0 / 10%);
`;
export const Button = styled.button`
  padding: 3px 5px;
  min-width: 40px;
  min-height: 30px;
  color: #333333;
  font-size: 14px;
  font-weight: 500;
  line-height: 14px;
  border: 1px solid transparent;
  border-color: #ffffff;
  background-color: #ffffff;
  border-radius: 5px;
  box-shadow: none;
  transition: all 0.1s;
  &:hover {
    background-color: #ececec;
    border-color: #ececec;
  }
  & + & {
    margin-left: 10px;
  }
`;
