import mapboxgl, { GeoJSONSource } from 'mapbox-gl';
import { Tile, Coordinate, getBounds, getQuadkeysOnBound, createTiles } from 'utils/geometry';

export type DebugParams = {
  coordinate: {
    lat: number;
    lng: number;
  };
  tile: {
    x: number;
    y: number;
    quadkey: string;
  };
  tiles: Tile[];
  zoom: number;
  points: {
    x: number;
    y: number;
  };
};

export const initialDebugParams: DebugParams = {
  coordinate: {
    lat: 0,
    lng: 0,
  },
  tile: {
    x: 0,
    y: 0,
    quadkey: '',
  },
  tiles: [],
  zoom: 0,
  points: {
    x: 0,
    y: 0,
  },
};

export const INITIAL_GEOJSON: mapboxgl.GeoJSONSourceRaw = {
  type: 'geojson',
  data: {
    type: 'FeatureCollection',
    features: []
  }
};

const createTileBoundaryFeatureCollection = (tiles: Tile[]): GeoJSON.FeatureCollection<GeoJSON.Geometry> => ({
  type: 'FeatureCollection',
  features: tiles.map(tile => ({
    type: 'Feature',
    properties: {},
    geometry: {
      type: 'LineString',
      coordinates: tile.corners ? tile.corners.map((corner: Coordinate) => ([corner.lng, corner.lat])) : [],
    }
  }))
});

const createTileBoundaryLabelFeatureCollection = (tiles: Tile[]): GeoJSON.FeatureCollection<GeoJSON.Geometry> => ({
  type: 'FeatureCollection',
  features: tiles.map(tile => ({
    type: 'Feature',
    properties: {
      tile: `x: ${tile.x}, y: ${tile.y}, z: ${tile.z}`,
      z: tile.z,
    },
    geometry: {
      type: 'Point',
      coordinates: [tile.corners ? tile.corners[0].lng : 0, tile.corners ? tile.corners[0].lat : 0],
    }
  }))
});

export const addLayers = (map: mapboxgl.Map) => {
  const boundariesSource = map.getSource('tile-boundaries-source');
  const boundariesSymbolSource = map.getSource('tile-boundaries-symbol-source');
  const boundariesLayer = map.getLayer('tile-boundaries-layer');
  const boundariesSymbolLayer = map.getLayer('tile-boundaries-symbol-layer');
  !boundariesSource && map.addSource('tile-boundaries-source', INITIAL_GEOJSON);
  !boundariesSymbolSource && map.addSource('tile-boundaries-symbol-source', INITIAL_GEOJSON);
  !boundariesLayer && map.addLayer({
    id: 'tile-boundaries-layer',
    type: 'line',
    source: 'tile-boundaries-source',
    paint: {
      'line-color': '#888888',
      'line-width': 1
    }
  });
  !boundariesSymbolLayer && map.addLayer({
    id: 'tile-boundaries-symbol-layer',
    type: 'symbol',
    source: 'tile-boundaries-symbol-source',
    layout: {
      'text-field': ['get', 'tile'],
      'text-size': 13,
      'text-offset': [5.4, 1],
    }
  });
};

export const removeLayers = (map: mapboxgl.Map) => {
  const boundariesLayer = map.getLayer('tile-boundaries-layer');
  const boundariesSource = map.getSource('tile-boundaries-source');
  const boundariesSymbolLayer = map.getLayer('tile-boundaries-symbol-layer');
  const boundariesSymbolSource = map.getSource('tile-boundaries-symbol-source');
  boundariesLayer && map.removeLayer('tile-boundaries-layer');
  boundariesSource && map.removeSource('tile-boundaries-source');
  boundariesSymbolLayer && map.removeLayer('tile-boundaries-symbol-layer');
  boundariesSymbolSource && map.removeSource('tile-boundaries-symbol-source');
};

export const updateTileBoundaries = (map: mapboxgl.Map) => {
  const { sw, ne } = getBounds(map);
  const { quadkeys } = getQuadkeysOnBound(sw, ne, map.getZoom());
  const tiles = createTiles(map, quadkeys);
  const boundariesSource = map.getSource('tile-boundaries-source');
  const boundariesSymbolSource = map.getSource('tile-boundaries-symbol-source');
  const updateBoundaries = createTileBoundaryFeatureCollection(tiles);
  const updateBoundaryLabels = createTileBoundaryLabelFeatureCollection(tiles);
  boundariesSource && (map.getSource('tile-boundaries-source') as GeoJSONSource).setData(updateBoundaries);
  boundariesSymbolSource && (map.getSource('tile-boundaries-symbol-source') as GeoJSONSource).setData(updateBoundaryLabels);
};
