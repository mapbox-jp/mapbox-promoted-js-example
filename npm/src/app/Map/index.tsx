import React, { useEffect, useRef } from 'react';
import MapboxGL from 'mapbox-gl';
import { Feature, Promoted } from 'mapbox-promoted-js';
import { INITIAL_MAP_STATE, STYLES } from 'utils/params';
import SideMenu from 'app/SideMenu';
import { Container } from './styles';

MapboxGL.accessToken = process.env.MAPBOX_ACCESS_TOKEN;
(MapboxGL as unknown as { workerClass: string }).workerClass = require('worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker').default;

const App: React.FC = () => {
  const ref = useRef(null);
  const featureRef = useRef<Feature>();
  // const [feature, setFeature] = useState<Feature>();
  
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
      // console.log('click_pin', e.data.features[0]);
      featureRef.current = e.data.features[0];
      renderPromotionSideCardInnerElement(
        document.querySelector('#sidemenu'),
        e.data.features[0],
        (t, f, p) => {
          console.log('onclcik', t, f, p);
        },
        (f) => console.log('onupdate', f),
        (f) => console.log('onclose', f),
      );
      window.insertCustomElem(featureRef.current);
      // setFeature(e.data.features[0]);
      // console.log(JSON.stringify(e.data.features[0]));
    });
    // promoted.on('click_side_card', (t, e) => {
    //   console.log('click_side_card', t, e);
    //   window.renderCustomSummary(featureRef.current);
    // });
    // promoted.on('open_side_card', (t, e) => {
    //   console.log('open_side_card');
    //   // console.log(JSON.stringify(e.data.features[0]));
    //   window.renderCustomSummary(featureRef.current);
    // });
    // promoted.on('update_side_card', (t, e) => {
    //   console.log('open_side_card');
    //   // console.log(JSON.stringify(e.data.features[0]));
    //   window.renderCustomSummary(featureRef.current);
    // });
    // promoted.on('show_side_card', (t, e) => {
    //   console.log('show_side_card');
    //   // console.log(JSON.stringify(e.data.features[0]));
    //   window.renderCustomSummary(featureRef.current);
    // });
    // promoted.on('start_session', (t, e) => console.log('start_session', e));
    // promoted.on('update_session', (t, e) => console.log('update_session', e));
    // promoted.on('end_session', (t, e) => console.log('end_session', e));
    return () => map.remove();
  }, []);

  return (
    <>
      <Container ref={ref} />
      <SideMenu />
    </>
  );
};

export default App;
