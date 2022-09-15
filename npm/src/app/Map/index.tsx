import React, { useEffect, useState, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import { Promoted as MapboxPromoted } from 'mapbox-promoted-js';
import { MapTypeController, renderMapSwicher } from 'app/MapSwicher';
import { MapExtensionsController, renderMapExtensions } from 'app/MapExtensions';
import DebugPanel from 'app/DebugPanel';
import { INITIAL_MAP_STATE, STYLES } from 'utils/params';
import { Container } from './styles';

mapboxgl.accessToken = process.env.MAPBOX_ACCESS_TOKEN;
// (mapboxgl as unknown as { workerClass: string }).workerClass = require('worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker').default;

const App: React.FC = () => {
  const ref = useRef(null);
  const mapRef = useRef<mapboxgl.Map>();
  const promotedRef = useRef<MapboxPromoted>();
  const [isDebugging, setIsDebugging] = useState(false);
  const [date, setDate] = useState<Date>();

  const handleToggleDebugging = (value: boolean) => {
    setIsDebugging(value);
  };
  const handleChangeMapStyle = () => {
    setDate(new Date());
  };
  
  useEffect(() => {
    const { lng, lat, zoom } = INITIAL_MAP_STATE;
    const map = new mapboxgl.Map({
      container: ref.current as any,
      style: STYLES.STREET,
      center: [lng, lat],
      zoom,
    });
    const promoted = new MapboxPromoted(
      map,
      process.env.ACCESS_TOKEN,
      {
        baseUrl: process.env.BASE_URL,
        logUrl: process.env.LOG_URL,
      }
    );
    promoted.on('start_session', (t, e) => console.log('start_session', e));
    promoted.on('update_session', (t, e) => console.log('update_session', e));
    promoted.on('end_session', (t, e) => console.log('end_session', e));
    map.on('load', () => {
      map.addControl(new mapboxgl.NavigationControl({
        visualizePitch: true,
      }));
      map.addControl(new mapboxgl.GeolocateControl({
        positionOptions: {
          enableHighAccuracy: true
        },
        trackUserLocation: true,
      }));
      map.addControl(new MapTypeController());    
      map.addControl(new MapExtensionsController());    
      renderMapSwicher(map, promoted, handleChangeMapStyle);
      renderMapExtensions(map, promoted, handleToggleDebugging);
    });
    mapRef.current = map;
    promotedRef.current = promoted;
  return () => map.remove();
  }, []);

  return (
    <>
      <Container ref={ref} />
      {isDebugging && mapRef.current && promotedRef.current && (
        <DebugPanel map={mapRef.current} promoted={promotedRef.current} reload={date} />
      )}
    </>
  );
};

export default App;
