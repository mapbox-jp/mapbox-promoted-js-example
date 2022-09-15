import styled from 'styled-components';

type Container = {
  width?: string;
  height?: string;
};

export const Container = styled.div`
  width: ${({ width }: Container) => width || 'auto'};
  height: ${({ height }: Container) => height || 'auto'};
`;
