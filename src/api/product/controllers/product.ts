/**
 * product controller
 */

import { GetAttributesValues, factories } from "@strapi/strapi";
import { calculatePageCount } from "../../../utils/pageCount";
import { Context } from "koa";

type QueryResponse<T> = {
  results: T;
};

function flatten(obj) {
  return {
    id: obj.data.id,
    ...obj.data.attributes,
  };
}

export default factories.createCoreController(
  "api::product.product",
  ({ strapi }) => ({
    async findOne(ctx) {
      const { id } = ctx.params;
      const { query } = ctx;

      try {
        const entity = (await strapi.service("api::product.product").find({
          populate: ["images", "category", "currency", "providers"],
          filters: {
            uid: id,
          },
          ...query,
        })) as QueryResponse<GetAttributesValues<"api::product.product">[]>;

        ctx.assert.notEqual(
          0,
          entity.results.length,
          404,
          `Id ${id} not found`
        );

        const [result] = entity.results;

        ctx.assert.equal(id, result.uid, 404, `Id ${id} not found`);

        const sanitizedEntity: QueryResponse<
          GetAttributesValues<"api::product.product">[]
        > = await this.sanitizeOutput(result, ctx);

        const transformed = this.transformResponse(sanitizedEntity, {});

        const data = flatten(transformed);

        return {
          ...data,
          images:
            data.images != null && data.images.data != null
              ? data.images.data.map(({ attributes, id }) => ({
                  ...attributes,
                  id,
                }))
              : {},
          category: {
            id: data.category.data.id,
            ...data.category.data.attributes,
          },
          // @ts-ignore
          currency: result.currency,
        };
      } catch (err) {
        ctx.body = err;
      }
    },

    async find(ctx: Context) {
      const { query } = ctx;
      const limit = 10;

      const entity = (await strapi.entityService.findMany(
        "api::product.product",
        {
          sort: { id: "desc" },
          populate: ["images", "category", "currency"],
          start:
            query.page != null
              ? (parseInt(query.page as string) - 1) * limit
              : 0,
          limit,
          filters: {
            ...(ctx.query.category != null
              ? {
                  category: {
                    uid: ctx.query.category,
                  },
                }
              : {}),
          },
        }
      )) as GetAttributesValues<"api::product.product">[];

      ctx.assert.notEqual(entity.length, 0, 404, `No data provided`);

      const count = await strapi.query("api::product.product").count({
        where: {
          ...(ctx.query.category != null
            ? {
                category: {
                  uid: ctx.query.category,
                },
              }
            : {}),
        },
      });

      return {
        results: entity,
        pagination: {
          page: ctx.query.page ? Number(ctx.query.page) : 1,
          pageSize: limit,
          pageCount: calculatePageCount(limit, count),
          total: count,
        },
      };
    },

    async search(ctx) {
      const { query } = ctx;

      const entity = (await strapi.entityService.findMany(
        "api::product.product",
        {
          populate: ["images", "category", "currency"],
          filters: {
            title: {
              $containsi: query.q,
            },
          },
        }
      )) as GetAttributesValues<"api::product.product">[];

      const sanitized = await this.sanitizeOutput(entity);

      return sanitized;
    },

    async related(ctx: Context) {
      const { uid, omit } = ctx.query;
      const limit = 10;

      ctx.assert((uid as string) != null, 400, "Missing uid parameter");

      ctx.assert(omit, 404, "Omit not found");

      const entity = (await strapi.entityService.findMany(
        "api::product.product",
        {
          populate: ["images", "currency"],
          limit,
          filters: {
            category: {
              uid: {
                $eq: uid,
              },
            },
            uid: {
              $not: {
                $eq: omit,
              },
            },
          },
        }
      )) as GetAttributesValues<"api::product.product">[];

      return entity;
    },
  })
);
