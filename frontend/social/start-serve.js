// start-serve.js
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const serve = require('serve');

const server = serve('build', {
  // You can add any `serve` options here
});

server.start();

