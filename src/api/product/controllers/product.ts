/**
 * product controller
 */

import { factories } from "@strapi/strapi";

export default factories.createCoreController(
  "api::product.product",
  ({ strapi }) => ({
    async meta(ctx) {
      const limit = 100;
      const page = ctx.query.start != null ? Number(ctx.query.start) : 0;
      try {
        const entries = await strapi.entityService.findMany(
          "api::product.product",
          {
            fields: ["uid", "updatedAt"],
            populate: ["images"],
            publicationState: "live",
            start: page !== 0 ? page * limit : 0,
            limit: 100,
          }
        );

        return {
          data: entries,
          pagination: { pageSize: limit, page: page + 1 },
        };
      } catch (error) {
        return error;
      }
    },
  })
);
