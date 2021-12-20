import React from 'react';
import { Feature } from 'mapbox-promoted-js';
import {
  Properties,
  Item,
  ItemLabel,
  ItemValue,
} from './styles';

type Props = {
  feature: Feature;
};

const FeatureProperties: React.FC<Props> = props => {
  const { properties } = props.feature;
  const keys = Object.keys(properties);
  return (
    <Properties>
      {keys.map(key => (
        <Item>
          <ItemLabel>{key}:</ItemLabel>
          <ItemValue>{properties[key]}</ItemValue>
        </Item>
      ))}
    </Properties>
  );
};

export default FeatureProperties;
