/**
 * settings controller
 */

import { GetAttributesValues, factories } from '@strapi/strapi'
import { Context } from 'koa'

const key = "api::settings.settings";

export default factories.createCoreController(key, ({ strapi }) => ({
  async find (ctx: Context ) {
    const entity: GetAttributesValues<"api::settings.settings"> = await strapi.entityService.findOne(key, 1, {
      populate: {'home_page' : { populate: { coverImage: true }}, navigation: { populate: {
        menu_image: true}
      }, contact: true, socials: true },
    });

    const sanitized: GetAttributesValues<typeof key> = this.sanitizeOutput(entity, ctx)

    return sanitized;
  },
}));
