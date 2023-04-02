/**
 * parent-category controller
 */

import { GetAttributesValues, factories } from '@strapi/strapi'

type QueryResponse<T> = {
  results: T;
};

export default factories.createCoreController('api::parent-category.parent-category', ({ strapi }) => ({
  async find(ctx) {
    const { query } = ctx;

    try {
      const entity = await strapi.service('api::parent-category.parent-category').find({
        ...query
      }) as QueryResponse<GetAttributesValues<"api::parent-category.parent-category">>;

      const sanitizedEntity: QueryResponse<GetAttributesValues<"api::parent-category.parent-category">> = await this.sanitizeOutput(entity.results, ctx);

      return sanitizedEntity;
    } catch (err) {
      ctx.body = err;
    }
  }
}));
