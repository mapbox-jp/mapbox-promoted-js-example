import React, { useState } from 'react';
import { Container } from './styles';

type Props = {
  onChange?: (value: boolean) => void;
};

const Radio: React.FC<Props> = props => {
  const { onChange } = props;
  const [value, setValue] = useState(false);
  const handleToggle = () => {
    onChange && onChange(!value);
    setValue(!value);
  };
  return (
    <Container value={value} onClick={handleToggle} />
  );
};

export default Radio;
