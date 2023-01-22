"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const strapi_1 = require("@strapi/strapi");
exports.default = strapi_1.factories.createCoreController('api::category.category', ({ strapi }) => ({
    async findOne(ctx) {
        const { id } = ctx.params;
        const { query } = ctx;
        try {
            const entity = await strapi.service('api::category.category').find({
                populate: ['image', 'parentCategory'],
                filters: {
                    uid: id
                },
                ...query
            });
            // @ts-ignore
            const [result] = entity.results;
            // @ts-ignore
            ctx.assert.equal(id, result.uid, 404, `Id ${id} not found`);
            const sanitizedEntity = await this.sanitizeOutput(result, ctx);
            return sanitizedEntity;
        }
        catch (err) {
            ctx.body = err;
        }
    },
    async find(ctx) {
        const { query } = ctx;
        try {
            const entity = await strapi.service('api::category.category').find({
                populate: ['image', 'parentCategory'],
                ...query
            });
            // @ts-ignore
            const sanitizedEntity = await this.sanitizeOutput(entity.results, ctx);
            return sanitizedEntity.map((entity) => ({
                ...entity,
                parentCategory: { uid: entity.parentCategory.uid }
            }));
        }
        catch (err) {
            ctx.body = err;
        }
    }
}));
