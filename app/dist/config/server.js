"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.create = void 0;
const glue_1 = require("@hapi/glue");
exports.create = async (manifest) => {
    if (typeof manifest !== 'object') {
        throw new Error('Manifest should be an object');
    }
    return await glue_1.compose(manifest, { relativeTo: __dirname });
};
//# sourceMappingURL=server.js.map