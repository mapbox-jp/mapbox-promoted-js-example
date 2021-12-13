'use strict';

const fs = require('fs');
const paths = require('./paths');

delete require.cache[require.resolve('./paths')];

// .env の読み込み
const defaultDotenvFile = paths.dotenv;
const stageDotenvFile = `${paths.dotenv}.${process.env.DOT_ENV}`;
const dotenvFile = fs.existsSync(stageDotenvFile) ? stageDotenvFile :
  fs.existsSync(defaultDotenvFile) ? defaultDotenvFile : null;
  
if (dotenvFile) {
  require('dotenv-expand')(
    require('dotenv').config({ path: dotenvFile })
  );
}

// .env から json で環境変数を生成する
// 環境変数は process.env に格納される
const getClientEnvironment = () => {
  let DOT_ENV = process.env.DOT_ENV;
  let NODE_ENV = process.env.NODE_ENV;
  let PUBLIC_PATH = process.env.PUBLIC_PATH;
  let MAPBOX_ACCESS_TOKEN = process.env.MAPBOX_ACCESS_TOKEN;
  let ACCESS_TOKEN = process.env.ACCESS_TOKEN;
  let BASE_URL = process.env.BASE_URL;
  let SOURCE_URL = process.env.SOURCE_URL;
  let TELEMETRY_URL = process.env.TELEMETRY_URL;
  let LAYER_SOURCE_ID = process.env.LAYER_SOURCE_ID;
  const row = {
    DOT_ENV,
    NODE_ENV,
    PUBLIC_PATH,
    MAPBOX_ACCESS_TOKEN,
    ACCESS_TOKEN,
    BASE_URL,
    SOURCE_URL,
    TELEMETRY_URL,
    LAYER_SOURCE_ID,
  }
  const envStringified = Object.keys(row).reduce((env, key) => {
    env[key] = JSON.stringify(row[key]);
    return env;
  }, {});

  return { row, envStringified };
}

module.exports = getClientEnvironment;
