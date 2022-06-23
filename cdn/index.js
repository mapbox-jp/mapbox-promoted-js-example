const token = '';
mapboxgl.accessToken = token;
const map = new mapboxgl.Map({
  container: 'app',
  style: 'mapbox://styles/mapbox/streets-v11',
  center: [139.7746987, 35.6272648],
  zoom: 13
});
const promoted = new PromotedCore.Promoted(map, token, {
  baseUrl: '',
  logUrl: '',
  debug: true,
});
