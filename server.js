// Production entry point for hosting environments looking for server.js
// Delegates directly to the compiled production bundle at dist/server.cjs

import { createRequire } from 'module';
import fs from 'fs';
import path from 'path';

const require = createRequire(import.meta.url);
const serverPath = path.resolve(process.cwd(), 'dist/server.cjs');

if (!fs.existsSync(serverPath)) {
  console.error('[Hosting Entry] Error: dist/server.cjs was not found.');
  console.error('[Hosting Entry] Please ensure "npm run build" has executed before running server.js.');
  process.exit(1);
}

// Ensure NODE_ENV is set to production when launched via server.js if not explicitly set to development
if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = 'production';
}

require(serverPath);
