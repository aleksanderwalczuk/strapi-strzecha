/**
 * A set of functions called "actions" for `ig`
 */

import { factories } from "@strapi/strapi";
import axios from "axios";
import { Context } from "koa";
import { createTokenEntry, getToken } from "../../../utils/ig";

export default factories.createCoreController('api::ig.ig', ({ strapi }) => ({
  async find(ctx: Context) {
    const url = `${process.env.IG_API_URL}/me/media`;

    let { before, after } = ctx.query;

    let token = await getToken(strapi);

    if (token == null) {
      await createTokenEntry(strapi);
      token = await getToken(strapi);
    }

    ctx.assert(token != null, 500, "Failed to retrieve ig token");

    const fields = "id,media_type,thumbnail_url,permalink,username,timestamp"
    const res = await axios.get(url, {
      method: "GET",
      params: {
        fields,
        access_token: token.access_token,
        limit: 25,
        ...(after != null ? {
          after
        }: {}),
        ...(before != null ? {
          before
        }: {})
      }
    });

    ctx.assert(res.data != null);

    return res.data;
  },
}))
