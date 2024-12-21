const esbuild = require('esbuild')

esbuild
  .build({
    entryPoints: ['src/worker.ts'],
    bundle: true,
    outfile: 'dist/worker.js',
    format: 'esm',
    platform: 'browser',
    target: 'es2022',
    define: {
      'process.env.NODE_ENV': '"production"',
      global: 'globalThis',
    },
    conditions: ['worker', 'browser'],
    mainFields: ['browser', 'module', 'main'],
    inject: ['./src/worker/node-globals.js'],
    minify: true,
  })
  .catch(() => process.exit(1))
