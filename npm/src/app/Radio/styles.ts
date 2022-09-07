import styled from 'styled-components';

type Container = {
  value?: boolean;
};

export const Container = styled.div`
  position: relative;
  width: 31px;
  height: 18px;
  background-color: ${({ value }: Container) => value ? '#2196f3' : '#999999'};
  border-radius: 9px;
  transition: background-color 0.1s;
  &:after {
    content: '';
    position: absolute;
    display: block;
    width: 14px;
    height: 14px;
    top: 2px;
    left: ${({ value }: Container) => value ? '15px' : '2px'};
    background-color: #ffffff;
    border-radius: 50%;
    box-shadow: 0 1px 1px rgb(0 0 0 / 25%);
    transition: left 0.1s;
  }
`;
