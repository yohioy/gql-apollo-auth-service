import manifest from './config/manifest';
import { create } from './config/server';

const init = async () => {
    const server = await create(manifest);
    await server.start();
    console.log(`Server running on ${server.info.uri}`);
};

process.on('unhandledRejection', (err) => {
    console.log(err);
    process.exit(1);
});

init();