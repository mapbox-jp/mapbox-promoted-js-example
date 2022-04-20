import MapboxGL, { GeoJSONSource } from 'mapbox-gl';
import { Tile, Coordinate, tileToCenterCoordinate, getTileCornerCoordinates } from 'utils/geometry';

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

export const INITIAL_GEOJSON: MapboxGL.GeoJSONSourceRaw = {
  type: 'geojson',
  data: {
    type: 'FeatureCollection',
    features: []
  }
};

export const createTiles = (map: MapboxGL.Map, tiles: any) => {
  return tiles.filter(({ z }: any) => z === Math.floor(map.getZoom())).map(({ x, y, z, quadkey }: any) => {
    const targetCoordinate = tileToCenterCoordinate(x, y, z);
    const corners = getTileCornerCoordinates(targetCoordinate.lng, targetCoordinate.lat, z);
    return {
      x,
      y,
      z,
      quadkey,
      corners,
    }
  });
};

const createTileBoundaryFeatureCollection = (tiles: Tile[]): GeoJSON.FeatureCollection<GeoJSON.Geometry> => ({
  type: 'FeatureCollection',
  features: tiles.map(tile => ({
    type: 'Feature',
    properties: {},
    geometry: {
      type: 'LineString',
      coordinates: tile.corners.map((corner: Coordinate) => ([corner.lng, corner.lat]))
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
      coordinates: [tile.corners[0].lng, tile.corners[0].lat]
    }
  }))
});

export const addLayers = (map: MapboxGL.Map) => {
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

export const removeLayers = (map: MapboxGL.Map) => {
  const boundariesLayer = map.getLayer('tile-boundaries-layer');
  const boundariesSource = map.getSource('tile-boundaries-source');
  const boundariesSymbolLayer = map.getLayer('tile-boundaries-symbol-layer');
  const boundariesSymbolSource = map.getSource('tile-boundaries-symbol-source');
  boundariesLayer && map.removeLayer('tile-boundaries-layer');
  boundariesSource && map.removeSource('tile-boundaries-source');
  boundariesSymbolLayer && map.removeLayer('tile-boundaries-symbol-layer');
  boundariesSymbolSource && map.removeSource('tile-boundaries-symbol-source');
};

export const updateTileBoundaries = (map: MapboxGL.Map, tiles: Tile[]) => {
  const boundariesSource = map.getSource('tile-boundaries-source');
  const boundariesSymbolSource = map.getSource('tile-boundaries-symbol-source');
  const updateBoundaries = createTileBoundaryFeatureCollection(tiles);
  const updateBoundaryLabels = createTileBoundaryLabelFeatureCollection(tiles);
  boundariesSource && (map.getSource('tile-boundaries-source') as GeoJSONSource).setData(updateBoundaries);
  boundariesSymbolSource && (map.getSource('tile-boundaries-symbol-source') as GeoJSONSource).setData(updateBoundaryLabels);
};
