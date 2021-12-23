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
  const renderAnalitics = () => {
    const analitics = properties['analitics'];
    if (!analitics) { return null; }
    const keys = Object.keys(analitics);
    return keys.map(key => (
      <Item isAnalitics>
        <ItemLabel>{key}:</ItemLabel>
        <ItemValue>{analitics[key]}</ItemValue>
      </Item>
    ));
  };
  const renderItems = () => {
    const keys = Object.keys(properties);
    return keys.filter(key => key !== 'analitics').map(key => (
      <Item>
        <ItemLabel>{key}:</ItemLabel>
        <ItemValue>{properties[key]}</ItemValue>
      </Item>
    ));
  };
  return (
    <Properties>
      {renderAnalitics()}
      {renderItems()}
    </Properties>
  );
};

export default FeatureProperties;
