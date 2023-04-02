"use strict";
/**
 * parent-category controller
 */
Object.defineProperty(exports, "__esModule", { value: true });
const strapi_1 = require("@strapi/strapi");
exports.default = strapi_1.factories.createCoreController('api::parent-category.parent-category', ({ strapi }) => ({
    async find(ctx) {
        const { query } = ctx;
        try {
            const entity = await strapi.service('api::parent-category.parent-category').find({
                ...query
            });
            // @ts-ignore
            const sanitizedEntity = await this.sanitizeOutput(entity.results, ctx);
            return sanitizedEntity;
        }
        catch (err) {
            ctx.body = err;
        }
    }
}));
//# sourceMappingURL=parent-category.js.map