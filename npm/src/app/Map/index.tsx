import React, { useEffect, useRef } from 'react';
import MapboxGL from 'mapbox-gl';
import Promoted, { Feature } from 'mapbox-promoted-js';
import { INITIAL_MAP_STATE, STYLES } from 'utils/params';
import { Container, SideMenu } from './styles';

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
    const promoted = new Promoted({
      map,
      accessToken: process.env.ACCESS_TOKEN,
      container: ref.current as any,
      baseColor: '#026400',
      baseUrl: process.env.BASE_URL,
      logUrl: process.env.LOG_URL,
      scaleIcon: 2,
      sideCard: true,
      mediaModal: true,
    });
    promoted.on('click_pin', (_type: any, event: any) => {
      const feature = (event.data as any).features[0] as Feature;
      const targetElement = document.querySelector('#sidemenu');
      if (!targetElement) { return; }
      promoted.render(
        targetElement as HTMLElement,
        feature,
        (type: string, feature: Feature, profileItems?: Feature.ProfileItems) => {
          console.log('onclcik', type, feature, profileItems);
        },
      );
    });
    promoted.on('start_session', (t, e) => console.log('start_session', e));
    promoted.on('update_session', (t, e) => console.log('update_session', e));
    promoted.on('end_session', (t, e) => console.log('end_session', e));
    return () => map.remove();
  }, []);

  return (
    <>
      <Container ref={ref} />
      <SideMenu id='sidemenu' />
    </>
  );
};

export default App;
