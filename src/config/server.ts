import { Server } from '@hapi/hapi';
import { compose } from '@hapi/glue';

export const create = async (manifest: any): Promise<Server> => {

    if(typeof manifest !== 'object') {
        throw new Error('Manifest should be an object');
    }

    return await compose(manifest, { relativeTo: __dirname });

}
