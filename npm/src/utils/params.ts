export const INITIAL_MAP_STATE = {
  lng: 139.7671687688049,
  lat: 35.68116566710953,
  zoom: 14,
  pitch: 50,
  bearing: -10,
  antialias: true
};

export const STYLES = {
  STREET: 'mapbox://styles/mapbox/streets-v11',
  OUTDOORS: 'mapbox://styles/mapbox/outdoors-v11',
  LIGHT: 'mapbox://styles/mapbox/light-v10',
  DARK: 'mapbox://styles/mapbox/dark-v10',
  SATELLITE: 'mapbox://styles/mapbox/satellite-v9',
};

export const BUILDINGS_LAYER_STYLE = {
  'id': 'buildings',
  'source': 'composite',
  'source-layer': 'building',
  'filter': ['==', 'extrude', 'true'],
  'type': 'fill-extrusion',
  'minzoom': 15,
  'paint': {
    'fill-extrusion-color': '#d2d2d2',
    'fill-extrusion-height': [
      'interpolate',
      ['linear'],
      ['zoom'],
      15,
      0,
      15.05,
      ['get', 'height']
    ],
    'fill-extrusion-base': [
      'interpolate',
      ['linear'],
      ['zoom'],
      15,
      0,
      15.05,
      ['get', 'min_height']
    ],
    'fill-extrusion-opacity': 0.4
  }
} as mapboxgl.AnyLayer;

export const TERRAIN_SOURCE_STYLE = {
  'type': 'raster-dem',
  'url': 'mapbox://mapbox.mapbox-terrain-dem-v1',
  'tileSize': 512,
  'maxzoom': 14
} as mapboxgl.AnySourceData;
