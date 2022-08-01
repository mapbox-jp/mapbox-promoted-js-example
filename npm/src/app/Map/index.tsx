import React, { useEffect, useRef } from 'react';
import MapboxGL from 'mapbox-gl';
import { Promoted as MapboxPromoted } from 'mapbox-promoted-js';
import { INITIAL_MAP_STATE, STYLES } from 'utils/params';
import { Container } from './styles';

MapboxGL.accessToken = process.env.MAPBOX_ACCESS_TOKEN;
(MapboxGL as unknown as { workerClass: string }).workerClass = require('worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker').default;

const App: React.FC = () => {
  const ref = useRef(null);
  
  useEffect(() => {
    const { lng, lat, zoom } = INITIAL_MAP_STATE;
    const map = new MapboxGL.Map({
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
  return () => map.remove();
  }, []);

  return (
    <Container ref={ref} />
  );
};

export default App;
