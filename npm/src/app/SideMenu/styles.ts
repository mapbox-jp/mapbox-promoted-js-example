import styled from 'styled-components';

type Container = {
  isShowing?: boolean;
};
type Wrapper = {
  isShowing?: boolean;
};
type ToggleButton = {
  isFadeout?: boolean;
  isRendered?: boolean;
};
type ToggleButtonIcon = {
  isShowing?: boolean;
};

export const Container = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 375px;
  height: 100%;
  box-shadow: ${({ isShowing }: Container) => isShowing ? '0 0 8px rgba(0, 0, 0, 0.3)' : '0 0 8px rgba(0, 0, 0, 0)'};
  // transform: ${({ isShowing }: Container) => isShowing ? 'translate3d(0, 0, 0)' : 'translate3d(-360px, 0, 0)'};
  // transition: opacity 0.2s, transform 0.2s;
  // transition-timing-function: cubic-bezier(0.0, 0.0, 0.2, 1);
  // -ms-transform: ${({ isShowing }: Container) => isShowing ? 'translate3d(0, 0, 0)' : 'translate3d(-360px, 0, 0)'};
  // -webkit-transform: ${({ isShowing }: Container) => isShowing ? 'translate3d(0, 0, 0)' : 'translate3d(-360px, 0, 0)'};
  // -webkit-transition: opacity 0.2s, transform 0.2s, -webkit-transform 0.2s;
  // will-change: opacity, transform, -webkit-transform;
`;
export const IFrame = styled.iframe``;
export const ContentWrapper = styled.div`
  position: relative;
  width: 360px;
  max-width: 100%;
  height: 100%;
  background-color: rgb(255, 255, 255);
  z-index: 1;
`;
export const Wrapper = styled.div`
  position: relative;
  height: 100%;
`;
export const Toggle = styled.div`
  position: absolute;
  top: 31px;
  left: calc(100% - 1px);
  z-index: 0;
`;
export const ToggleButton = styled.button`
  padding: 0 7px 0 6px;
  width: 25px;
  height: 48px;
  cursor: pointer;
  color: #929292;
  border: none;
  border-left: 1px solid #d4d4d4;
  box-shadow: 2px 2px 3px rgba(0, 0, 0, 0.3);
  border-radius: 0px 5px 5px 0px;
  background-color: #ffffff;
  opacity: ${({ isFadeout, isRendered }: ToggleButton) => isFadeout || !isRendered ? '0.0' : '1.0'};
  transition: opacity 0.25s;
`;
export const ToggleButtonIcon = styled.span`
  display: block;
  transform: rotate(${({ isShowing }: Container) => isShowing ? '0deg' : '180deg'});
  transition-property: opacity, transform, -webkit-transform;
  transition-duration: 0.2s;
  transition-timing-function: cubic-bezier(0.0, 0.0, 0.2, 1);
`;
