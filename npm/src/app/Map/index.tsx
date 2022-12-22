import React, { useEffect, useRef } from 'react';
import MapboxGL from 'mapbox-gl';
import { Feature, Promoted } from 'mapbox-promoted-js';
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
      baseColor: '#1a75ff',
      baseUrl: process.env.BASE_URL,
      logUrl: process.env.LOG_URL,
      scaleIcon: 2,
      sideCard: false,
      mediaModal: false,
    });
    promoted.on('click_pin', (t, e) => {
      const feature = e.data.features[0];
      console.log(feature);
      console.log(renderPromotionSideCardInnerElement);
      window.renderPromotionSideCardInnerElement(
        document.querySelector('#sidemenu'),
        feature,
        (t, f, p) => {
          console.log('onclcik', t, f, p);
        }
      );
      window.insertCustomElement(feature);
    });
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
