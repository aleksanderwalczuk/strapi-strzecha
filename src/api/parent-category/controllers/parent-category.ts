/**
 * parent-category controller
 */

import { factories } from '@strapi/strapi'

export default factories.createCoreController('api::parent-category.parent-category', ({ strapi }) => ({
  async find(ctx) {
    const { query } = ctx;

    try {
      const entity = await strapi.service('api::parent-category.parent-category').find({
        ...query
      });
      // @ts-ignore
      const sanitizedEntity = await this.sanitizeOutput(entity.results, ctx);

      return sanitizedEntity;
    } catch (err) {
      ctx.body = err;
    }
  }
}));
