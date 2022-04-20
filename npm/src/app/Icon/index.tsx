import React from 'react';
import { ReactComponent as LeftArrow } from './left_arrow.svg';
import { ReactComponent as ExternalLinkSquareAlt } from './external_link_square_alt.svg';
import { Container } from './styles';

export const ICON_TYPE = {
  LEFT_ARROW: 'left-arrow',
  EXTERNAL_LINK_SQUARE_ALT: 'external-link-square-alt',
};

type props = {
  type: any;
  width?: string;
  height?: string;
};

export const Icon: React.FC<props> = props => {
  const { type, width, height } = props;
  const renderIcon = () => {
    switch (type) {
      case ICON_TYPE.LEFT_ARROW:
        return <LeftArrow />;
      case ICON_TYPE.EXTERNAL_LINK_SQUARE_ALT:
        return <ExternalLinkSquareAlt />;        
      default:
        return null;
    }
  };
  return (
    <Container width={width} height={height}>
      {renderIcon()}
    </Container>
  );
};

export default Icon;
