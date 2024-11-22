const builder = require('electron-builder');
const { rspack } = require('@rspack/core');
const rspackConfig = require('./rspack.config.cjs');
const buildConfig = require('./.build.json');

const rsPackBuild = (envConfig) => {
  return new Promise((resolve) => {
    rspack(
      [
        rspackConfig.mainConfig(false, envConfig),
        rspackConfig.preloadConfig(false, envConfig),
        rspackConfig.rendererConfig(false, envConfig)
      ],
      (err, stats) => {
        if (err || stats.hasErrors()) {
          console.error(err.stack || err);
          if (err.details) {
            console.error(err.details);
          }
          console.log(`\x1B[31mFailed to build main process !\x1B[0m`);
          process.exit(1);
        }
        console.log(
          stats.toString({
            chunks: false, // 使构建过程更静默无输出
            colors: true // 在控制台展示颜色
          })
        );
        resolve(0);
      }
    );
  });
}


const build = async (targets, envConfig) => {
  console.log(`\x1B[34m[build start]\x1B[0m`);
  await rsPackBuild(envConfig);
  builder
    .build({
      targets,
      config: buildConfig
    })
    .then(() => {
      console.log('\x1B[32m[build success] \x1B[0m');
    })
    .catch((error) => {
      console.error(error);
    })
    .finally(() => {
      process.exit();
    });
}


module.exports = {
  build
}