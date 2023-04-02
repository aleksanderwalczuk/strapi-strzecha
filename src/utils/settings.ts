import { GetAttributesValues } from "@strapi/strapi";

interface Options {
  populate?: string[] | {
    home_page?: boolean | { populate?: boolean | { coverImage: boolean } };
    navigation?: boolean | { populate?: boolean | { menu_image: boolean } };
    contact?: boolean;
    socials?: boolean
  };
  filters?: string[] | Record<string, any>;
}

const defaultOptions = {
  populate: {
    home_page: { populate: { coverImage: true } },
    navigation: {
      populate: {
        menu_image: true,
      },
    },
    contact: true,
    socials: true,
  },
};

export async function getSettings(
  options: Options = defaultOptions
) {
  const req: GetAttributesValues<"api::settings.settings"> =
    await strapi.entityService.findOne("api::settings.settings", 1, options);

  return req;
}
