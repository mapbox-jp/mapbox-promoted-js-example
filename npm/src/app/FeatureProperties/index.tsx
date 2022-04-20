import React, { useEffect, useState } from 'react';
import { Feature } from 'mapbox-promoted-js';
import * as AdserverAPIs from 'apis/adserver';
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
  const [cpsContents, setCpsContents] = useState<any>({});
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
  const renderCPSContents = () => {
    const keys = Object.keys(cpsContents);
    return keys.map(key => (
      <Item>
        <ItemLabel>{key}:</ItemLabel>
        <ItemValue>{cpsContents[key]}</ItemValue>
      </Item>
    ));
  };
  const fetchConvertedCPS = async () => {
    const convetredCPS = await AdserverAPIs.fetchConvertedCPS(properties.cps);
    setCpsContents(convetredCPS as any);
  };
  useEffect(() => {
    fetchConvertedCPS();
  }, [properties]);
  return (
    <Properties>
      {renderAnalitics()}
      {renderItems()}
      {renderCPSContents()}
    </Properties>
  );
};

export default FeatureProperties;
