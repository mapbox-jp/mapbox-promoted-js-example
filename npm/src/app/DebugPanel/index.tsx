import React, { useEffect, useState } from 'react';
import MapboxGL from 'mapbox-gl';
import { lngToTile, latToTile, tileToQuadkey, getTileCornerCoordinates, tileToCoordinate } from 'utils/geometry';
import { initialDebugParams, createTiles, addLayers, removeLayers, updateTileBoundaries } from './helpers';
import { Container, Item, ItemLabel, ItemValue } from './styles';
import { Promoted } from 'mapbox-promoted-js';

MapboxGL.accessToken = process.env.MAPBOX_ACCESS_TOKEN;
(MapboxGL as unknown as { workerClass: string }).workerClass = require('worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker').default;

type Props = {
  map: MapboxGL.Map;
  promoted: Promoted;
  reload?: Date;
};

let debugParams = initialDebugParams;

const DebugPanel: React.FC<Props> = props => {
  const { map, promoted, reload } = props;
  const { coordinate, tile, tiles, zoom, points } = debugParams;

  const [_date, setDate] = useState(new Date());
  const mousemove = (event: any) => {
    const lng = event.lngLat.lng;
    const lat = event.lngLat.lat;
    const zoom = Math.floor(map.getZoom());
    const x = lngToTile(lng, zoom);
    const y = latToTile(lat, zoom);
    const tile = {
      x,
      y,
      quadkey: tileToQuadkey(x, y, zoom),
    };
    debugParams = {
      ...debugParams,
      coordinate: event.lngLat,
      tile,
      zoom,
      points: event.point,
    };
    setDate(new Date());
  };
  const zoomend = (_event: any) => {
    const tiles = createTiles(map, promoted.tiles);
    updateTileBoundaries(map, tiles);
    debugParams = {
      ...debugParams,
      tiles
    };
    setDate(new Date());
  };
  const moveend = (_type: string, _data: any) => {
    const { lng, lat } = debugParams.coordinate;
    const zoom = Math.floor(map.getZoom());
    const x = lngToTile(lng, zoom);
    const y = latToTile(lat, zoom);
    const tile = {
      x,
      y,
      quadkey: tileToQuadkey(x, y, zoom),
    };
    debugParams = {
      ...debugParams,
      tile,
      zoom,
    };
    setDate(new Date());
  };
  const sourcedataend = (_type: string)=> {
    const tiles = createTiles(map, promoted.tiles);
    updateTileBoundaries(map, tiles);
    debugParams = {
      ...debugParams,
      tiles
    };
    setDate(new Date());
  };
  const removeCallbacks = () => {
    removeLayers(map);
    map.off('mousemove', mousemove);
    map.off('zoomend', zoomend);
    promoted.off('moveend', moveend);
    promoted.off('sourcedataend', sourcedataend);
  };
  const initilizeEventActions = () => {
    addLayers(map);
    map.on('mousemove', mousemove);
    map.on('zoomend', zoomend);
    promoted.on('moveend', moveend);
    promoted.on('sourcedataend', sourcedataend);
    const tiles = createTiles(map, promoted.tiles);
    updateTileBoundaries(map, tiles);
  };

  useEffect(() => {
    reload && removeCallbacks();
    initilizeEventActions();
    return () => {
      removeCallbacks();
    }
  }, [reload]);

  const tileCoordinate = tileToCoordinate(tile.x, tile.y, zoom);
  const cornerCoordinates = getTileCornerCoordinates(tileCoordinate.lng, tileCoordinate.lat, zoom);

  return (
    <Container>
      <Item>
        <ItemLabel>Lng:</ItemLabel>
        <ItemValue>{coordinate.lng}</ItemValue>
      </Item>
      <Item>
        <ItemLabel>Lat:</ItemLabel>
        <ItemValue>{coordinate.lat}</ItemValue>
      </Item>
      <Item>
        <ItemLabel>Zoom:</ItemLabel>
        <ItemValue>{zoom}</ItemValue>
      </Item>
      <Item>
        <ItemLabel>TileX:</ItemLabel>
        <ItemValue>{tile.x}</ItemValue>
      </Item>
      <Item>
        <ItemLabel>TileY:</ItemLabel>
        <ItemValue>{tile.y}</ItemValue>
      </Item>
      <Item>
        <ItemLabel>Quadkey:</ItemLabel>
        <ItemValue>{tile.quadkey}</ItemValue>
      </Item>
      {cornerCoordinates.length ? (
        cornerCoordinates.map((coordinates, i) => (
          <Item key={`corner-coordinates-${i}`}>
            <ItemLabel>{i === 0 && 'Corners:'}</ItemLabel>
            <ItemValue>{`${coordinates.lng}, ${coordinates.lat}`}</ItemValue>
          </Item>
        ))
      ) : null}
      <Item>
        <ItemLabel>X:</ItemLabel>
        <ItemValue>{points.x}</ItemValue>
      </Item>
      <Item>
        <ItemLabel>Y:</ItemLabel>
        <ItemValue>{points.y}</ItemValue>
      </Item>
      {tiles.length ? (
        tiles.slice(0, 10).map((tile, i) => (
          <Item key={`tiles-${i}`}>
            <ItemLabel>{i === 0 && 'Tiles:'}</ItemLabel>
            <ItemValue>{`${tile.x} x ${tile.y} => ${tile.corners[0].lng.toFixed(10)} x ${tile.corners[0].lat.toFixed(10)}`}</ItemValue>
          </Item>
        ))
      ) : null}
      {tiles.length > 10 && (
        <Item>
          <ItemLabel></ItemLabel>
          <ItemValue>more...</ItemValue>
        </Item>
      )}
    </Container>
  );
};

export default DebugPanel;
