import React, { useRef, useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import MapboxGL from 'mapbox-gl';
import { Feature, Promoted as MapboxPromoted } from 'mapbox-promoted-js';
import Icon, { ICON_TYPE } from 'app/Icon';
import Radio from 'app/Radio';
import FeatureProperties from 'app/FeatureProperties';
import FeatureExtentions from 'app/FeatureExtentions';
import { Container, SwitchIcon, MenuWrapper, Menu, MenuItem, ItemLabel, ItemValue, Textarea, Select, Option } from './styles';

const IMPRESSION_NO = 5;
const CLICK_NO = 6;

const LAYER_STYLE = `{
  "icon-image": ["get", "icon"],
  "icon-size": [
    "interpolate",
    ["exponential", 1.5],
    ["zoom"],
    10, 0.5,
    16, 1.0
  ],
  "icon-anchor": "bottom",
  "text-field": ["get", "name_ja"],
  "text-anchor": "top",
  "text-offset": [0, 0.5],
  "text-size": [
    "interpolate",
    ["exponential", 1.5],
    ["zoom"],
    10, 9,
    16, 12
  ]
}`;
const LAYER_PAINT_STYLE = `{
  "text-color": "#6e523c",
  "text-halo-color": "#f1f1f1",
  "text-halo-width": 1.0,
  "icon-halo-color": "#6e523c",
  "icon-halo-width": 1.5,
  "text-translate": [
    "interpolate",
    ["exponential", 1.5],
    ["zoom"],
    10, ["literal", [0.0, 12.0]],
    16, ["literal", [0.0, 24.0]]
  ],
  "text-translate-anchor": "viewport",
  "text-opacity": [
    "step",
    ["zoom"],
    0,
    14,
    1
  ]
}`;

const PROMOTION_TYPES = {
  DEFAULT: 'default',
  POPUP: 'popup',
  CARD: 'card',
  SIDE_CARD: 'sidecard',
} as const;
export declare type PromotionTypes = typeof PROMOTION_TYPES[keyof typeof PROMOTION_TYPES];

export class MapExtensionsController implements MapboxGL.IControl {
  private _map?: MapboxGL.Map;
  private _container?: HTMLDivElement;

  onAdd(map: MapboxGL.Map) {
    this._map = map;
    this._container = document.createElement('div');
    this._container.id = 'map-extensions';
    this._container.className = 'mapboxgl-ctrl mapboxgl-ctrl-group';
    return this._container;
  }
  onRemove() {

  }
}

type Props = {
  map: MapboxGL.Map;
  promoted: MapboxPromoted;
  onDebug: (value: boolean) => void;
};

const MapExtensions: React.FC<Props> = props => {
  const { map, promoted, onDebug} = props;

  const ref = useRef<HTMLDivElement>(null);
  const analitics = useRef<any>({});

  const [isOpening, setIsOpening] = useState(false);
  const [isShowingLayerStyleTextarea, setIsShowingLayerStyleTextarea] = useState(false);
  const [isShowingLayerPaintStyleTextarea, setIsShowingLayerPaintStyleTextarea] = useState(false);
  const [isShowingFeatureProperties, setIsShowingFeatureProperties] = useState(false);
  const [clickedFeature, setClickedFeature] = useState<Feature>();
  const [menuHeight, setMenuHeight] = useState<Number>();

  const handleToggle = () => {
    setIsOpening(!isOpening);
  };
  const handleToggleModifyLayerStyles = (value: boolean) => {
    setIsShowingLayerStyleTextarea(value);
  };
  const handleToggleModifyLayerPaintStyles = (value: boolean) => {
    setIsShowingLayerPaintStyleTextarea(value);
  };
  const handleChangeLayerStyle = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    try {
      const styles = JSON.parse(event.target.value);
      for (const key of Object.keys(styles)) {
        const value = styles[key];
        map.setLayoutProperty(promoted.layerId, key, value);
      }
    } catch (error) {
      console.error(error);
    }
  };
  const handleChangeLayerPaintStyle = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    try {
      const styles = JSON.parse(event.target.value);
      for (const key of Object.keys(styles)) {
        const value = styles[key];
        map.setPaintProperty(promoted.layerId, key, value);
      }
    } catch (error) {
      console.error(error);
    }
  };
  const handleToggleShowingFeatureProperties = (value: boolean) => {
    setIsShowingFeatureProperties(value);
  };
  const handleToggleDebugging = (value: boolean) => {
    onDebug(value);
  };
  // const handleSelectPromotionType = (event: React.ChangeEvent<HTMLSelectElement>) => {
  //   if (!promoted) { return; }
  //   const value = event.target.value;
  //   if (value === PROMOTION_TYPES.DEFAULT) {
  //     promoted.enablePromotionPopup = false;
  //     promoted.enablePromotionCard = false;
  //     promoted.enablePromotionSideCard = false;
  //   } else if (value === PROMOTION_TYPES.POPUP) {
  //     promoted.enablePromotionPopup = true;
  //   } else if (value === PROMOTION_TYPES.CARD) {
  //     promoted.enablePromotionCard = true;
  //   } else if (value === PROMOTION_TYPES.SIDE_CARD) {
  //     promoted.enablePromotionSideCard = true;
  //   }
  // };
  const handleLoadAnalitics = (value: any) => {
    analitics.current = value;
  };

  useEffect(() => {
    promoted.on('click_pin', (_type: any, event: any) => {
      const feature = event.feature;
      const adid = feature.properties.adid;
      const row = analitics.current[adid];
      if (row) {
        const impression = row[IMPRESSION_NO];
        const click = row[CLICK_NO];
        feature.properties['analitics'] = {
          impression,
          click,
        };
      }
      setClickedFeature(event.feature);
    });
  }, []);
  useEffect(() => {
    if (ref.current) {
      setMenuHeight(ref.current.clientHeight + 38);
    }
  });

  return (
    <Container id='map-extensions-container'>
      <SwitchIcon isOpening={isOpening} onClick={handleToggle}>
        <Icon type={ICON_TYPE.EXTERNAL_LINK_SQUARE_ALT} width='13px' height='13px' />
      </SwitchIcon>
      <MenuWrapper isOpening={isOpening} height={`${menuHeight}px`}>
        <Menu ref={ref} id='menu'>
          <MenuItem>
            <ItemLabel>Display Debug Params:</ItemLabel>
            <ItemValue>
              <Radio onChange={handleToggleDebugging} />
            </ItemValue>
          </MenuItem>          
          {/* <MenuItem>
            <ItemLabel>Promotion Style:</ItemLabel>
            <ItemValue>
              <Select onChange={handleSelectPromotionType}>
                <Option value='default'>Default</Option>
                <Option value='popup'>Popup</Option>
                <Option value='sidecard'>SideCard</Option>
                <Option value='card'>Card</Option>
              </Select>
            </ItemValue>
          </MenuItem> */}
          <MenuItem>
            <ItemLabel>Modify Layer Style:</ItemLabel>
            <ItemValue>
              <Radio onChange={handleToggleModifyLayerStyles} />
            </ItemValue>
          </MenuItem>
          {isShowingLayerStyleTextarea && (
            <MenuItem>
              <ItemValue>
                <Textarea rows={10} onChange={handleChangeLayerStyle}>
                  {LAYER_STYLE}
                </Textarea>
              </ItemValue>
            </MenuItem>  
          )}
          <MenuItem>
            <ItemLabel>Modify Layer Paint Style:</ItemLabel>
            <ItemValue>
              <Radio onChange={handleToggleModifyLayerPaintStyles} />
            </ItemValue>
          </MenuItem>
          {isShowingLayerPaintStyleTextarea && (
            <MenuItem>
              <ItemValue>
                <Textarea rows={10} onChange={handleChangeLayerPaintStyle}>
                  {LAYER_PAINT_STYLE}
                </Textarea>
              </ItemValue>
            </MenuItem>  
          )}
          <MenuItem>
            <ItemLabel>Display Properties:</ItemLabel>
            <ItemValue>
              <Radio onChange={handleToggleShowingFeatureProperties} />
            </ItemValue>
          </MenuItem>
          {isShowingFeatureProperties && (
            <MenuItem>
              <ItemLabel>Feature Property Extensions:</ItemLabel>
              <ItemValue>
                <FeatureExtentions onLoad={handleLoadAnalitics} />
              </ItemValue>
            </MenuItem>
          )}          
          {isShowingFeatureProperties && (
            <MenuItem>
              <ItemLabel>Feature Properties:</ItemLabel>
            </MenuItem>
          )}
          {isShowingFeatureProperties && clickedFeature && (
            <MenuItem>
              <FeatureProperties feature={clickedFeature} />
            </MenuItem>
          )}
        </Menu>
      </MenuWrapper>
    </Container>
  );
};

export const renderMapExtensions = (map: MapboxGL.Map, promoted: MapboxPromoted, onDebug: (value: boolean) => void) => {
  ReactDOM.render(
    <MapExtensions map={map} promoted={promoted} onDebug={onDebug} />,
    document.getElementById('map-extensions')
  );
};
