const token = 'pk.eyJ1IjoidGstbWFwYm94IiwiYSI6ImNrcnR4eHcwazB5Ymoyb3BmOTljMDgzMGUifQ.9XhhlYHW0mEnsC9Z3j_XmA';
mapboxgl.accessToken = token;
const map = new mapboxgl.Map({
  container: 'app',
  style: 'mapbox://styles/mapbox/streets-v11',
  center: [139.7746987, 35.6272648],
  zoom: 13
});
const promoted = new PromotedCore.Promoted(map, token, {
  baseUrl: 'https://api.mapbox.com',
  sourceUrl: 'https://mymapbox.s3.ap-northeast-1.amazonaws.com/assets/geojsons/demo2.geojson',
  telemetryUrl: 'https://events.mapbox.com',
  debug: true,
});
