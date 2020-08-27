import 'reflect-metadata';
import { Server } from '@hapi/hapi';
export declare const plugin: {
    name: string;
    register: (server: Server, options: any) => Promise<void>;
};
