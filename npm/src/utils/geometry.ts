export type Coordinate = { lng: number; lat: number };
export type Tile = {
  corners: Coordinate[];
  x: number;
  y: number;
  z: number;
};

export const lngToTile = (lng: number, z: number) => {
  return Math.floor((lng + 180) / 360 * Math.pow(2, z));
};

export const latToTile = (lat: number, z: number) => {
  return Math.floor((1 - Math.log(Math.tan(lat * Math.PI / 180) + 1 / Math.cos(lat * Math.PI / 180)) / Math.PI) / 2 * Math.pow(2, z));
};

export const tileToQuadkey = (x: number, y: number, z: number) => {
  let quadKey = '';
  for (let i = z; i > 0; i --) {
    let b = 0;
    let mask = 1 << (i - 1);
    if ((x & mask) !== 0) b ++;
    if ((y & mask) !== 0) b += 2;
    quadKey += b.toString();
  }
  return quadKey;
};

export const quadkeyToTile = (quadkey: string) => {
  let x = 0
  let y = 0
  let z = quadkey.length;
  for (let i = z; i > 0; i --) {
    let mask = 1 << (i - 1);
    let q = + quadkey[z - i];
    if (q === 1) x |= mask;
    if (q === 2) y |= mask;
    if (q === 3) {
      x |= mask;
      y |= mask;
    }
  }
  return [x, y, z];
};

export const tileToCenterCoordinate = (x: number, y: number, z: number) => {
  const currentTileCoordinate = tileToCoordinate(x, y, z);
  const nextTileCoordinate = tileToCoordinate(x + 1, y + 1, z);
  return {
    lng: currentTileCoordinate.lng + (nextTileCoordinate.lng - currentTileCoordinate.lng) / 2,
    lat: currentTileCoordinate.lat + (nextTileCoordinate.lat - currentTileCoordinate.lat) / 2
  };
};

export const tileToCoordinate = (x: number, y: number, z: number) => {
  const n = Math.pow(2, z);
  const lng = x / n * 360.0 - 180.0;
  const latRadius = Math.atan(Math.sinh(Math.PI * (1 - 2 * y / n)));
  const lat = latRadius * 180.0 / Math.PI;
  return { lng, lat };
};

export const getTileCornerCoordinates = (lng: number, lat: number, z: number) => {
  const x = lngToTile(lng, z);
  const y = latToTile(lat, z);
  const point1 = tileToCoordinate(x, y, z);
  const point2 = tileToCoordinate(x + 1, y, z);
  const point3 = tileToCoordinate(x + 1, y + 1, z);
  const point4 = tileToCoordinate(x, y + 1, z);
  return [point1, point2, point3, point4, point1];
};
