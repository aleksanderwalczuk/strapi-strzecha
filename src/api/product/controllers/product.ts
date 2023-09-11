/**
 * product controller
 */

import { GetAttributesValues, factories } from "@strapi/strapi";
import { calculatePageCount } from "../../../utils/pageCount";
import { Context } from "koa";

type QueryResponse<T> = {
  results: T;
};

function getQueryFilters(ctx) {
  const { query } = ctx;
  let limit = 10;
  let start = 0;
  let filters = {};

  if ((query.pagination as any)?.pageSize) {
    limit = parseInt((query.pagination as any)?.pageSize, 10);
  }

  if (query.page != null) {
    start = (parseInt(query.page as string) - 1) * limit;
  }

  if (
    (query.pagination as any)?.page != null &&
    (query.pagination as any)?.page != "1"
  ) {
    start = (query.pagination as any).page * limit;
  }

  if (ctx.query.category != null) {
    filters = {
      category: {
        uid: ctx.query.category,
      },
    };
  }

  if (ctx.query.filters) {
    filters = ctx.query.filters;
  }

  if (ctx.query.omit) {
    filters = {
      ...filters,
      uid: {
        $not: {
          $eq: ctx.query.omit,
        },
      },
    };
  }

  return { start, limit, filters };
}

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
      const { start, limit, filters } = getQueryFilters(ctx);
      const entity = (await strapi.entityService.findMany(
        "api::product.product",
        {
          sort: { id: "desc" },
          populate: ["images", "category", "currency"],
          start,
          limit,
          filters,
        }
      )) as GetAttributesValues<"api::product.product">[];

      ctx.assert.notEqual(entity.length, 0, 404, `No data provided`);

      const count = await strapi.query("api::product.product").count({
        where: filters,
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

      const { limit, filters } = getQueryFilters(ctx);

      ctx.assert((uid as string) != null, 400, "Missing uid parameter");

      ctx.assert(omit, 404, "Omit not found");

      const entity = (await strapi.entityService.findMany(
        "api::product.product",
        {
          populate: ["images", "currency"],
          limit,
          filters,
        }
      )) as GetAttributesValues<"api::product.product">[];

      return entity;
    },
  })
);
