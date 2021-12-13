'use strict';

const path = require('path');
const fs = require('fs');

const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = relativePath => path.resolve(appDirectory, relativePath);

module.exports = {
  appPath: resolveApp('.'),
  appPublic: resolveApp('public'),
  appDist: resolveApp('dist'),
  appPackageJson: resolveApp('package.json'),
  appHtml: resolveApp('public/index.html'),
  appFavicon: resolveApp('public/favicon.ico'),
  appIndexJs: resolveApp('src/index.tsx'),
  appNodeModules: resolveApp('node_modules'),
  appTsConfig: resolveApp('tsconfig.json'),
  appTsLint: resolveApp('tslint.json'),
  appSrc: resolveApp('src'),
  dotenv: resolveApp('.env') ,
  eslintrc: resolveApp('.eslintrc'),
};
