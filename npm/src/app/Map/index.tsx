import React, { useEffect, useRef } from 'react';
import MapboxGL from 'mapbox-gl';
import { Promoted } from 'mapbox-promoted-js';
import { Plugin } from 'promoted-mapbox-plugin-js';
import { INITIAL_MAP_STATE, STYLES } from 'utils/params';
import { Container } from './styles';

MapboxGL.accessToken = process.env.MAPBOX_ACCESS_TOKEN;
// (MapboxGL as unknown as { workerClass: string }).workerClass = require('worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker').default;

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
    const promotedMapbox = new Plugin(map);
    const promoted = new Promoted({
      map: promotedMapbox,
      accessToken: process.env.ACCESS_TOKEN,
      container: ref.current as any,
      baseUrl: process.env.BASE_URL,
      logUrl: process.env.LOG_URL,
      scaleIcon: 2,
      sideCard: true,
      mediaModal: true,
    });
    promoted.on('click_pin', (t, e) => console.log('click_pin', e));
    promoted.on('start_session', (t, e) => console.log('start_session', e));
    promoted.on('update_session', (t, e) => console.log('update_session', e));
    promoted.on('end_session', (t, e) => console.log('end_session', e));
    window.map = map;
    window.promoted = promoted;
    return () => map.remove();
  }, []);

  return <Container ref={ref} />;
};

export default App;
