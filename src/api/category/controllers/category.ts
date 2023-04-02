import { GetAttributesValues, factories } from '@strapi/strapi'
import { getSettings } from '../../../utils/settings';
import { countProductsInCategory } from '../../../utils/productCount';

type QueryResponse<T> = {
  results: T
}

function mapSanitized(sanitizedEntity: GetAttributesValues<'api::category.category'>[]) {
  return sanitizedEntity.map((entity) => ({
    ...entity,
    ...(entity.parentCategory != null ? {
      parentCategory: { uid: entity.parentCategory.uid }
    }: {})
  }));
}

export default factories.createCoreController('api::category.category', ({ strapi }) => ({
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
      const [result] = entity.results as unknown[];
      // @ts-ignore
      ctx.assert.equal(id, result.uid, 404, `Id ${id} not found`);

      const sanitizedEntity = await this.sanitizeOutput(result, ctx);

      return sanitizedEntity;
    } catch (err) {
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
        }) as QueryResponse<GetAttributesValues<'api::category.category'>[]>,
        getSettings({
          populate: {
            navigation: true,
          }
        })
      ])

      const { navigation } = settings

      const sanitizedEntity = await this.sanitizeOutput(entity.results, ctx) as GetAttributesValues<'api::category.category'>[];

      if (navigation.show_empty_categories === false) {
        const count = await Promise.all(sanitizedEntity.map(async ( { uid }) => ({
          uid,
          value: await countProductsInCategory(strapi, uid, {
            limit: 1
          })
        })));

        const filtered = sanitizedEntity.filter(({ uid }) => {
          const counted = count.find((category) => category.uid === uid);
          return counted.value > 0
        });

        return mapSanitized(filtered);
      }

      return mapSanitized(sanitizedEntity);
    } catch (err) {
      ctx.body = err;
    }
  }
}));
