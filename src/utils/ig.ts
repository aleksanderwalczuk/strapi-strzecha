import type { Strapi } from "@strapi/strapi";
import axios from "axios";
import dayjs from "dayjs";

type token = {
  access_token: string;
  token_type: string;
  expires_in: number;
};

function aboutToExpire(
  token: Strapi.Schemas["api::ig.ig"]["attributes"],
  daysBefore = 20
) {
  const created = dayjs(token.createdAt);
  const expiry = created.add(token.expires_in, "s");
  const daysBeforeExpiration = expiry.subtract(daysBefore, "days");

  return dayjs().isAfter(daysBeforeExpiration);
}

export async function getToken(
  strapi: Strapi
): Promise<Strapi.Schemas["api::ig.ig"]["attributes"] | null> {
  const entry: Strapi.Schemas["api::ig.ig"]["attributes"][] = await strapi.db
    .query("api::ig.ig")
    .findMany({
      limit: 1,
      orderBy: { createdAt: "desc" },
    });

  if (entry.length > 0) {
    return entry[0];
  }

  return null;
}

export async function fetchToken(strapi: Strapi) {
  const url = `${process.env.IG_API_URL}/refresh_access_token`;

  const stored = await getToken(strapi);

  try {
    const req = await axios.get<token>(url, {
      params: {
        grant_type: "ig_refresh_token",
        access_token:
          stored == null ? process.env.IG_TOKEN : stored.access_token,
      },
    });

    if (req.status === 200) {
      return req.data;
    }
  } catch (error) {
    throw Error("Failed to retrieve api token");
  }
}

export async function createTokenEntry(strapi: Strapi) {
  const token = await fetchToken(strapi);

  try {
    await strapi.db.query("api::ig.ig").create({
      data: {
        ...token,
      },
    });
  } catch (e) {
    console.error("Failed to set ig token", e);
  }
}

export async function cleanupTokens(strapi) {
  const tokens = await strapi.db.query("api::ig.ig").findMany({
    limit: 4,
    orderBy: { createdAt: "asc" },
  });

  if (tokens.length >= 4) {
    const [oldest] = tokens;

    await strapi.db.query("api::ig.ig").delete({
      where: { id: oldest.id },
    });
  }
}

export async function processTokensJob(strapi: Strapi) {
  console.log("processTokensJob start");
  const token = await getToken(strapi);

  if (token != null) {
    const shouldRefetch = aboutToExpire(token);

    if (shouldRefetch) {
      await createTokenEntry(strapi);
    }
  } else {
    await createTokenEntry(strapi);
  }

  await cleanupTokens(strapi);

  console.log("processTokensJob finished");
}
