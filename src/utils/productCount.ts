import { Strapi } from "@strapi/strapi";

export async function countProductsInCategory(
  strapi: Strapi,
  uid: string | string[],
  options?: Record<string | number, any>
) {
  const res = await strapi.query("api::product.product").count({
    where: {
      category: { uid },
    },
    ...options,
  });

  return res;
}
