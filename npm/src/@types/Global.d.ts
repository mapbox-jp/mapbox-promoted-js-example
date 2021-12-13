declare namespace NodeJS {
  interface ProcessEnv {
    readonly NODE_ENV: 'development' | 'production' | 'test';
    readonly MAPBOX_BASE_URL: string;
    readonly MAPBOX_SOURCE_URL: string;
    readonly MAPBOX_ACCESS_TOKEN: string;
  }
}
