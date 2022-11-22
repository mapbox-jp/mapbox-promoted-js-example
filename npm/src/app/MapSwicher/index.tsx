import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import MapboxGL from 'mapbox-gl';
import { Promoted as MapboxPromoted } from 'mapbox-promoted-js';
import Icon, { ICON_TYPE } from 'app/Icon';
import {
  INITIAL_MAP_STATE,
  STYLES,
  BUILDINGS_LAYER_STYLE,
  TERRAIN_SOURCE_STYLE,
} from 'utils/params';
import { Container, SwitchIcon, Menu, Button } from './styles';

export class MapTypeController implements MapboxGL.IControl {
  private _map?: MapboxGL.Map;
  private _container?: HTMLDivElement;

  onAdd(map: MapboxGL.Map) {
    this._map = map;
    this._container = document.createElement('div');
    this._container.id = 'map-type-switcher';
    this._container.className = 'mapboxgl-ctrl mapboxgl-ctrl-group';
    return this._container;
  }
  onRemove() {

  }
}

type Props = {
  map: MapboxGL.Map;
  promoted: MapboxPromoted;
  onChange: () => void;
};

const MapSwicher: React.FC<Props> = props => {
  const { map, promoted, onChange } = props;

  const [isOpening, setIsOpening] = useState(false);
  const [isPitched, setIsPitched] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [isBuildings, setIsBuildings] = useState(false);
  const [isSatellite, setIsSatellite] = useState(false);
  const [isTerrain, setIsTerrain] = useState(false);

  const handleToggle = () => {
    setIsOpening(!isOpening);
  };
  const handleToggle3D = () => {
    if (isPitched) {
      map.easeTo({ pitch: 0, bearing: 0 });
      setIsPitched(false);
    } else {
      const { pitch, bearing } = INITIAL_MAP_STATE;
      map.easeTo({ pitch, bearing });
      setIsPitched(true);
    }
  };
  const handleToggleDark = () => {
    if (isDark) {
      promoted.reload();
      onChange();
      map.setStyle(STYLES.STREET);
      setIsDark(false);
      setIsSatellite(false);
    } else {
      promoted.reload();
      onChange();
      map.setStyle(STYLES.DARK);
      setIsDark(true);
      setIsSatellite(false);
    }
  };
  const handleToggleSatellite = () => {
    if (!map) { return; }
    if (isSatellite) {
      promoted.reload();
      onChange();
      map.setStyle(STYLES.STREET);
      setIsTerrain(false);
      setIsSatellite(false);
    } else {
      promoted.reload();
      onChange();
      map.setStyle(STYLES.SATELLITE);
      setIsBuildings(false);
      setIsSatellite(true);
    }
  };
  const handleToggleBuildings = () => {
    if (!map || isSatellite) { return; }
    if (isBuildings) {
      map.removeLayer('buildings');
      setIsBuildings(false);
    } else {
      const layers = map.getStyle().layers;
      if (!layers || !layers.length) { return; }
      const textLayer = layers.find(layer => layer.type === 'symbol' && layer.layout && layer.layout['text-field']);
      map.addLayer(BUILDINGS_LAYER_STYLE, textLayer && textLayer.id);
      setIsBuildings(true);
    }
  };
  const handleToggleTerrain = () => {
    if (!map) { return; }
    if (isTerrain) {
      map.setTerrain();
      map.removeSource('mapbox-dem');
      setIsTerrain(false);
    } else {
      map.addSource('mapbox-dem', TERRAIN_SOURCE_STYLE);
      map.setTerrain({
        'source': 'mapbox-dem',
        'exaggeration': 1.5
      });
      setIsTerrain(true);
    }
  };

  return (
    <Container>
      <SwitchIcon isOpening={isOpening} onClick={handleToggle}>
        <Icon type={ICON_TYPE.LEFT_ARROW} width='13px' height='13px' />
      </SwitchIcon>
      <Menu isOpening={isOpening}>
        <Button onClick={handleToggle3D}>
          {isPitched ? '2D' : '3D'}
        </Button>
        <Button onClick={handleToggleDark}>
          {isDark ? 'Light' : 'Dark'}
        </Button>
        <Button onClick={handleToggleBuildings} disable={isSatellite}>
          {isBuildings ? 'Non Buildings' : 'Buildings'}
        </Button>
        <Button onClick={handleToggleSatellite}>
          {isSatellite ? 'Non Satellite' : 'Satellite'}
        </Button>
        <Button onClick={handleToggleTerrain}>
          {isTerrain ? 'Non Terrain' : 'Terrain'}
        </Button>
      </Menu>
    </Container>
  );
};

export const renderMapSwicher = (map: MapboxGL.Map, promoted: MapboxPromoted, onChange: () => void) => {
  ReactDOM.render(
    <MapSwicher map={map} promoted={promoted} onChange={onChange} />,
    document.getElementById('map-type-switcher')
  );
};
