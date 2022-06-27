## Getting Started

### CDN

If you use CDN example, you need to put three params into the code.
Please ask us about them.

```
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
```

### NPM
Create original .env from .env.sample that is created sample one.

#### Build App
```bash
npm run install
npm run build
```

Open dist/index.html at your browser.

#### Run at your local 

```bash
npm run install
npm run start
```

Open [http://localhost:8080](http://localhost:8080) with your browser to see the result.
