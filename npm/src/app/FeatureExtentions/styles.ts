import styled from 'styled-components';

export const Container = styled.div`
  position: relative;
`;
export const Input = styled.input`
  position: absolute;
  width: 100%;
  height: 100%;
  opacity: 0;
  z-index: 2;
`;
export const File = styled.label`
  position: relative;
  display: block;
  padding-left: 47px;
  width: 100%;
  height: 28px;
  line-height: 26px;
  font-size: 11px;
  border: 1px solid #dddddd;
  border-radius: 5px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  &:after {
    content: 'File';
    position: absolute;
    display: block;
    padding: 0 10px;
    top: 0px;
    left: 0px;
    height: 26px;
    line-height: 26px;
    font-size: 11px;
    color: #333333;
    background-color: #f0f2f5;
    border-right: 1px solid #dddddd;
    border-radius: 5px 0px 0px 5px;
    z-index: 1;
  }
`;
