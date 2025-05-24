/* eslint-env node */
import * as esbuild from 'esbuild';

import appBuildConfig from './esbuild.app.mjs';
import workerBuildConfig from './esbuild.worker.mjs';

const appOptions = {};
const workerOptions = {};

if (process.argv?.length > 2) {
  // Check if a cors-proxy should be started
  if (process.argv.includes('--cors-proxy')) {
    const host = process.env.CORS_HOST || '0.0.0.0';
    const port = process.env.CORS_PORT || 8888;

    appOptions.corsProxyUrl = `http://${host}:${port}/`;
  }

  const appCtx = await esbuild.context(appBuildConfig(appOptions));
  const workerCtx = await esbuild.context(workerBuildConfig(workerOptions));

  if (process.argv.includes('--watch')) {
    await appCtx.watch();
    await workerCtx.watch();
  }
  if (process.argv.includes('--serve')) {
    await appCtx.serve({
      servedir: 'dist',
    });
  }
} else {
  await esbuild.build(appBuildConfig(appOptions));
  await esbuild.build(workerBuildConfig(workerBuildConfig));
}
