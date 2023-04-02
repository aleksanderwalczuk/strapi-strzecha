"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const strapi_1 = require("@strapi/strapi");
const settings_1 = require("../../../utils/settings");
const productCount_1 = require("../../../utils/productCount");
function mapSanitized(sanitizedEntity) {
    return sanitizedEntity.map((entity) => ({
        ...entity,
        ...(entity.parentCategory != null ? {
            parentCategory: { uid: entity.parentCategory.uid }
        } : {})
    }));
}
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
            const [entity, settings] = await Promise.all([
                strapi.service('api::category.category').find({
                    populate: ['image', 'parentCategory'],
                    ...query
                }),
                (0, settings_1.getSettings)({
                    populate: {
                        navigation: true,
                    }
                })
            ]);
            const { navigation } = settings;
            const sanitizedEntity = await this.sanitizeOutput(entity.results, ctx);
            if (navigation.show_empty_categories === false) {
                const count = await Promise.all(sanitizedEntity.map(async ({ uid }) => ({
                    uid,
                    value: await (0, productCount_1.countProductsInCategory)(strapi, uid, {
                        limit: 1
                    })
                })));
                const filtered = sanitizedEntity.filter(({ uid }) => {
                    const counted = count.find((category) => category.uid === uid);
                    return counted.value > 0;
                });
                return mapSanitized(filtered);
            }
            return mapSanitized(sanitizedEntity);
        }
        catch (err) {
            ctx.body = err;
        }
    }
}));
//# sourceMappingURL=category.js.map