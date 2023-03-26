/**
 * product controller
 */

import { factories } from '@strapi/strapi'
import { calculatePageCount } from '../../../utils/pageCount';
import { ProductInterface } from '../../../interfaces/Product';
import { Context } from 'koa'

function flatten(obj) {
  return {
    id: obj.data.id,
    ...obj.data.attributes
  }
}

export default factories.createCoreController('api::product.product', ({ strapi }) => ({
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
      const [result] = entity.results as ProductInterface[];

      // @ts-ignore
      ctx.assert.equal(id, result.uid, 404, `Id ${id} not found`);


      const sanitizedEntity = await this.sanitizeOutput(result, ctx);

      // console.log("RES2", sanitizedEntity);


      const transformed = this.transformResponse(sanitizedEntity, {});

      const data = flatten(transformed);


      return {
        ...data,
        images: (data.images != null ?
            data.images.data.map(({attributes, id}) => (
              {...attributes, id}
            ))
          : {}),
        category: { id: data.category.data.id, ...data.category.data.attributes },
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

    const entity = await strapi.entityService.findMany('api::product.product', {
      sort: { id: 'desc' },
      populate: ['images', 'category', 'currency'],
      start: query.page != null ? (parseInt(query.page as string) - 1) * limit : 0,
      limit,
      filters: {
        ...(ctx.query.category != null ? {
            category: {
              uid: ctx.query.category
            }
          } : {}
        ),
      },
    });

    // @ts-ignore
    ctx.assert.notEqual(entity.length, 0, 404, `No data provided`);

    const count = await strapi.query('api::product.product').count({ where: {
      ...(ctx.query.category != null ? {
        category: {
          uid: ctx.query.category
        }
      } : {}
    ),
    }});

    return {
      results: entity,
      pagination: {
        page: ctx.query.page ? Number(ctx.query.page) : 1,
        pageSize: limit,
        pageCount: calculatePageCount(limit, count),
        total: count,
      }
    };
  },

  async search(ctx) {
    const { query } = ctx;

    const entity = await strapi.entityService.findMany("api::product.product", {
      populate: ['images', 'category', 'currency'],
      filters: {
        title: {
          $containsi: query.q
        },
      },
    });

    const sanitized = await this.sanitizeOutput(entity);

    return sanitized;
  },

  async related(ctx) {
    const { uid, omit } = ctx.query;
    const limit = 10;

    // @ts-ignore
    ctx.assert((uid as string) != null, 400, 'Missing uid parameter')

    // @ts-ignore

    ctx.assert(omit, 'Omit not found', 404)

    const entity = await strapi.entityService.findMany("api::product.product", {
      populate: ['images', 'currency'],
      limit,
      filters: {
        "category": {
          uid: {
            $eq: uid
          }
        },
        uid: {
          $not: {
            $eq: omit
          }
        }
      },
    });

    return entity;
  }
}));
