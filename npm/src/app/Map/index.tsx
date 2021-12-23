import React, { useEffect, useState, useRef } from 'react';
import MapboxGL from 'mapbox-gl';
import { Promoted as MapboxPromoted } from 'mapbox-promoted-js';
import { MapTypeController, renderMapSwicher } from 'app/MapSwicher';
import { MapExtensionsController, renderMapExtensions } from 'app/MapExtensions';
import { INITIAL_MAP_STATE, STYLES } from 'utils/params';
import { Container, Debug, Item, ItemLabel, ItemValue } from './styles';

MapboxGL.accessToken = process.env.MAPBOX_ACCESS_TOKEN;
(MapboxGL as unknown as { workerClass: string }).workerClass = require('worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker').default;

type DebugParams = {
  coordinates: {
    lat: number;
    lng: number;
  };
  zoom: number;
  points: {
    x: number;
    y: number;
  };
};

let debugParams: DebugParams = {
  coordinates: {
    lat: 0,
    lng: 0,
  },
  zoom: 0,
  points: {
    x: 0,
    y: 0,
  },
};

const App: React.FC = () => {
  const mapRef = useRef(null);
  const [_promoted, setPromoted] = useState<MapboxPromoted>();
  const [_map, setMap] = useState<mapboxgl.Map>();
  const [isDebugging, setIsDebugging] = useState(false);
  const [_date, setDate] = useState(new Date());

  const handleToggleDebugging = (value: boolean) => {
    setIsDebugging(value);
  };

  useEffect(() => {
    const { lng, lat, zoom } = INITIAL_MAP_STATE;
    const map = new MapboxGL.Map({
      container: mapRef.current as any,
      style: STYLES.STREET,
      center: [lng, lat],
      zoom,
    });
    const promoted = new MapboxPromoted(
      map,
      process.env.ACCESS_TOKEN,
      {
        baseUrl: process.env.BASE_URL,
        sourceUrl: process.env.SOURCE_URL,
        telemetryUrl: process.env.TELEMETRY_URL,
        layerSourceId: process.env.LAYER_SOURCE_ID,
        debug: true,
      }
    );

    map.on('mousemove', (event: any) => {
      debugParams = {
        coordinates: event.lngLat,
        zoom: map.getZoom(),
        points: event.point,
      };
      setDate(new Date());
    });
    map.on('move', (_event: any) => {
      debugParams = {
        ...debugParams,
        zoom: map.getZoom(),
      };
      setDate(new Date());
    });
    map.on('load', () => {
      map.addControl(new MapboxGL.NavigationControl({
        visualizePitch: true,
      }));
      map.addControl(new MapboxGL.GeolocateControl({
        positionOptions: {
          enableHighAccuracy: true
        },
        trackUserLocation: true,
      }));
      map.addControl(new MapTypeController());    
      map.addControl(new MapExtensionsController());    
      renderMapSwicher(map);
      renderMapExtensions(map, promoted, handleToggleDebugging);
    });
    setMap(map);
    setPromoted(promoted);
    return () => map.remove();
  }, []);

  return (
    <>
      <Container ref={mapRef} />
      {isDebugging && debugParams && (
        <Debug>
          <Item>
            <ItemLabel>Lng:</ItemLabel>
            <ItemValue>{debugParams.coordinates.lng}</ItemValue>
          </Item>
          <Item>
            <ItemLabel>Lat:</ItemLabel>
            <ItemValue>{debugParams.coordinates.lat}</ItemValue>
          </Item>
          <Item>
            <ItemLabel>Zoom:</ItemLabel>
            <ItemValue>{debugParams.zoom}</ItemValue>
          </Item>
          <Item>
            <ItemLabel>X:</ItemLabel>
            <ItemValue>{debugParams.points.x}</ItemValue>
          </Item>
          <Item>
            <ItemLabel>Y:</ItemLabel>
            <ItemValue>{debugParams.points.y}</ItemValue>
          </Item>
        </Debug>
      )}
    </>
  );
};

export default App;
