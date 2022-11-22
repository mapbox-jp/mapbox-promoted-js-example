import React, { useEffect, useState, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import { Promoted } from 'mapbox-promoted-js';
import { Plugin } from 'promoted-mapbox-plugin-js';
import { MapTypeController, renderMapSwicher } from 'app/MapSwicher';
import { MapExtensionsController, renderMapExtensions } from 'app/MapExtensions';
import DebugPanel from 'app/DebugPanel';
import SideMenu from 'app/SideMenu';
import { INITIAL_MAP_STATE, STYLES } from 'utils/params';
import { Container } from './styles';

mapboxgl.accessToken = process.env.MAPBOX_ACCESS_TOKEN;
// (mapboxgl as unknown as { workerClass: string }).workerClass = require('worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker').default;

const App: React.FC = () => {
  const ref = useRef(null);
  const mapRef = useRef<mapboxgl.Map>();
  const promotedRef = useRef<any>();
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
    const promotedMapbox = new Plugin(map);
    const promoted = new Promoted({
      map: promotedMapbox,
      // map,
      accessToken: process.env.ACCESS_TOKEN,
      container: ref.current as any,
      baseColor: '#026400',
      baseUrl: process.env.BASE_URL,
      logUrl: process.env.LOG_URL,
      scaleIcon: 2,
      sideCard: true,
      mediaModal: true,
    });
    promoted.on('click_pin', (t, e) => {
      const feature = e.data.features[0];
      console.log(feature);
      window.feature = feature;
      // promoted.renderPromotionSideCardInnerElement('#sidemenu', feature)
      // console.log(t, e.data.feature);
    });
    // promoted.on('show_side_card', (t, e) => {
    //   console.log(t, e);
    //   window.feature = e.data.feature;
    //   // insertNavitimeActions();
    // });
    // promoted.on('open_side_card', (t, e) => {
    //   console.log(t, e);
    //   window.feature = e.data.feature;
    //   // insertNavitimeActions();
    // });
    // promoted.on('close_side_card', (t, e) => {
    //   console.log(t, e);
    //   window.feature = e.data.feature;
    //   // insertNavitimeActions();
    // });
    promoted.on('click_side_card', (type, event) => {
      console.log(type, event);
    });
    // promoted.on('start_session', (t, e) => console.log('start_session', e));
    // promoted.on('update_session', (t, e) => console.log('update_session', e));
    // promoted.on('end_session', (t, e) => console.log('end_session', e));
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
    window.map = map;
    window.promoted = promoted;
    return () => map.remove();
  }, []);

  return (
    <>
      <Container ref={ref} />
      {isDebugging && mapRef.current && promotedRef.current && (
        <DebugPanel map={mapRef.current} promoted={promotedRef.current} reload={date} />
      )}
      {/* <SideMenu /> */}
    </>
  );
};

export default App;
