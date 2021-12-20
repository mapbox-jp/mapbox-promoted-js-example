import React, { useEffect, useState, useRef } from 'react';
import MapboxGL from 'mapbox-gl';
import { Promoted as MapboxPromoted } from 'mapbox-promoted-js';
import { MapTypeController, renderMapSwicher } from 'app/MapSwicher';
import { MapExtensionsController, renderMapExtensions } from 'app/MapExtensions';
import { INITIAL_MAP_STATE, STYLES } from 'utils/params';
import { Container } from './styles';

MapboxGL.accessToken = process.env.MAPBOX_ACCESS_TOKEN;
(MapboxGL as unknown as { workerClass: string }).workerClass = require('worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker').default;

const App: React.FC = () => {
  const mapRef = useRef(null);
  const [_promoted, setPromoted] = useState<MapboxPromoted>();
  const [_map, setMap] = useState<mapboxgl.Map>();

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

    promoted.on('load', (type: any, event: any) => console.log(type, event));
    promoted.on('move', (type: any, event: any) => console.log(type, event));
    promoted.on('click_pin', (type: any, event: any) => console.log(type, event));
    
    promoted.on('click_side_card', (type: any, event: any) => console.log(type, event));
    promoted.on('show_side_card', (type: any, event: any) => console.log(type, event));
    promoted.on('close_side_card', (type: any, event: any) => console.log(type, event));
    promoted.on('update_side_card', (type: any, event: any) => console.log(type, event));
    promoted.on('hide_side_card', (type: any, event: any) => console.log(type, event));

    promoted.on('click_card', (type: any, event: any) => console.log(type, event));
    promoted.on('show_card', (type: any, event: any) => console.log(type, event));
    promoted.on('update_card', (type: any, event: any) => console.log(type, event));
    promoted.on('close_card', (type: any, event: any) => console.log(type, event));

    promoted.on('click_popup', (type: any, event: any) => console.log(type, event));
    promoted.on('show_popup', (type: any, event: any) => console.log(type, event));
    promoted.on('close_popup', (type: any, event: any) => console.log(type, event));

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
      renderMapExtensions(map, promoted);
    });
    setMap(map);
    setPromoted(promoted);
    return () => map.remove();
  }, []);

  return (
    <Container ref={mapRef} />
  );
};

export default App;
