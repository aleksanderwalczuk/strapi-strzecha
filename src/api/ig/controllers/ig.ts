/**
 * A set of functions called "actions" for `ig`
 */

import { factories } from "@strapi/strapi";
import axios from "axios";
import { Context } from "koa";

export default factories.createCoreController('api::ig.ig', () => ({
  async find(ctx: Context) {
    const url = `https://graph.instagram.com/me/media`;

    let { before, after } = ctx.query;

    const fields = "id,media_type,thumbnail_url,permalink,username,timestamp"
    const res = await axios.get(url, {
      method: "GET",
      params: {
        fields,
        access_token: process.env.IG_TOKEN,
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
  }
}))
