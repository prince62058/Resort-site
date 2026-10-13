import {createApp} from './app.js';
import {closeMediaStore, databaseConfigured, getMediaStore} from './database.js';

const port = Number(process.env.PORT || 5174);
const server = createApp().listen(port, '0.0.0.0', () => console.log(`Nature Nest server listening on port ${port}.`));

if (databaseConfigured()) {
  getMediaStore().then(() => console.log('MongoDB media store connected.'))
    .catch(() => console.error('MongoDB unavailable. Local image fallback is active; check Atlas network access and server environment settings.'));
}

for (const signal of ['SIGINT', 'SIGTERM']) {
  process.once(signal, () => {
    server.close(async () => {await closeMediaStore(); process.exit(0);});
    setTimeout(() => process.exit(1), 10000).unref();
  });
}
