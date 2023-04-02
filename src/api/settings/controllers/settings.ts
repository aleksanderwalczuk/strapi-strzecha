/**
 * settings controller
 */

import { GetAttributesValues, factories } from '@strapi/strapi'
import { Context } from 'koa'
import { getSettings } from '../../../utils/settings';

const key = "api::settings.settings";

export default factories.createCoreController(key, () => ({
  async find (ctx: Context ) {
    const entity = await getSettings();

    const sanitized: GetAttributesValues<typeof key> = this.sanitizeOutput(entity, ctx)

    return sanitized;
  },
}));
