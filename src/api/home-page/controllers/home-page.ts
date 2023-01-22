/**
 * home-page controller
 */

import { factories } from '@strapi/strapi'

export default factories.createCoreController('api::home-page.home-page',  ({ strapi }) => ({
  async find(ctx) {
    // some logic here
    const { data } = await super.find(ctx);
    // some more logic

    try {
      const entity = await strapi.service('api::home-page.home-page').find({
        populate: ['coverImage'],
      });
      // @ts-ignore
      const sanitizedEntity = await this.sanitizeOutput(entity, ctx);
      return sanitizedEntity;
    } catch (err) {
      ctx.body = err;
    }

    return data;
  }}));
