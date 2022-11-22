import React, { useRef, useEffect, useState } from 'react';
// Components
import {
  Container,
  IFrame,
  Wrapper,
  ContentWrapper,
  Toggle,
  ToggleButton,
  ToggleButtonIcon,
} from './styles';

const PromotionSideCard: React.FC= () => {
  const ref = useRef<HTMLDivElement>(null);
  const isUpdated = useRef<boolean>(false);
  const [isShowing, setIsShowing] = useState(false);
  const [isFadeout, setIsFadeout] = useState(false);
  const [isRendered, setIsRendered] = useState(false);

  const close = () => {
    if (!isUpdated.current) {
      setIsShowing(false);
      setIsFadeout(true);
      setTimeout(() => {
        removeEventListeners();
      }, 200);
    }
    isUpdated.current = false;
  };
  const removeEventListeners = () => {
    document.removeEventListener('click', handleClickOutside);
  };

  const handleToggle = () => {
    setIsShowing(!isShowing);
  };
  const handleClickOutside = (event: MouseEvent) => {
    if (ref.current && !ref.current.contains(event.target as Node)) {
      close();
    }
  };

  useEffect(() => {
    document.addEventListener('click', handleClickOutside);
    setIsShowing(true);
    return () => removeEventListeners();
  }, []);
  useEffect(() => {
    if (ref.current) {
      setIsRendered(true);
      // window.renderContent();
    }
  }, [ref]);

  return (
    <Container
      id='sidemenu' 
      // isShowing={isShowing}
      ref={ref}
    >
      {/* <IFrame src='about:self' /> */}
      <IFrame src='./iframe.html' />
    </Container>
  );
};

export default PromotionSideCard;