"use strict";
/**
 * product controller
 */
Object.defineProperty(exports, "__esModule", { value: true });
const strapi_1 = require("@strapi/strapi");
function flatten(obj) {
    return {
        id: obj.data.id,
        ...obj.data.attributes
    };
}
exports.default = strapi_1.factories.createCoreController('api::product.product', ({ strapi }) => ({
    async findOne(ctx) {
        const { id } = ctx.params;
        const { query } = ctx;
        try {
            const entity = await strapi.service('api::product.product').find({
                populate: ['images', 'category', 'currency', 'providers'],
                filters: {
                    uid: id
                },
                ...query
            });
            // @ts-ignore
            ctx.assert.notEqual(0, entity.results.length, 404, `Id ${id} not found`);
            // @ts-ignore
            const [result] = entity.results;
            console.log("RES", result);
            // @ts-ignore
            ctx.assert.equal(id, result.uid, 404, `Id ${id} not found`);
            const sanitizedEntity = await this.sanitizeOutput(result, ctx);
            // console.log("RES2", sanitizedEntity);
            const transformed = this.transformResponse(sanitizedEntity, {});
            const data = flatten(transformed);
            return {
                ...data,
                images: (data.images != null ?
                    data.images.data.map(({ attributes, id }) => ({ ...attributes, id }))
                    : {}),
                category: { id: data.category.data.id, ...data.category.data.attributes },
                // @ts-ignore
                currency: result.currency,
            };
        }
        catch (err) {
            ctx.body = err;
        }
    },
    async find(ctx) {
        const { query } = ctx;
        try {
            const entity = await strapi.service('api::product.product').find({
                populate: ['images', 'category', 'currency'],
                ...query
            });
            // @ts-ignore
            ctx.assert.notEqual(entity.results.length, 0, 404, `No data provided`);
            // @ts-ignore
            const sanitizedEntity = await this.sanitizeOutput(entity.results, ctx);
            return this.transformResponse(sanitizedEntity).data.map(({ id, attributes }) => ({
                id, ...attributes,
                category: {
                    ...attributes.category.data.attributes,
                    id: attributes.category.data.id
                },
                images: attributes.images.data.map(({ id, attributes }) => ({
                    id, ...attributes
                }))
            }));
        }
        catch (error) {
            return error;
        }
    }
}));
