import { GetAttributesValues } from "@strapi/strapi";
import axios from "axios";

export async function getToken(strapi: Strapi.Strapi): Promise<GetAttributesValues<"api::ig.ig"> | null> {
  const entry: GetAttributesValues<"api::ig.ig">[] = await strapi.db.query("api::ig.ig").findMany({
    limit: 1,
    orderBy: { createdAt: "desc" },
  });

  if (entry.length > 0) {
    return entry[0];
  }

  return null;
}

export async function fetchToken(strapi: Strapi.Strapi) {
  const url = `${process.env.IG_API_URL}/refresh_access_token`;

  const stored = await getToken(strapi);

  const req = await axios.get<{
    access_token: string;
    token_type: string;
    expires_in: number;
  }>(url, {
    params: {
      grant_type: "ig_refresh_token",
      access_token: stored == null ? process.env.IG_TOKEN : stored.access_token,
    },
  });

  if (req.status === 200) {
    return req.data;
  }

  throw Error("Failed to retrieve api token");
}

export async function createTokenEntry(strapi: Strapi.Strapi) {
  const token = await fetchToken(strapi);

  await strapi.db.query("api::ig.ig").create({
    data: {
      ...token,
    },
  });
}

export async function cleanupTokens(strapi) {
  const tokens = await strapi.db.query("api::ig.ig").findMany({
    limit: 4,
    orderBy: { createdAt: "asc" },
  });

  if (tokens.length >= 3) {
    const [oldest] = tokens;

    await strapi.db.query("api::ig.ig").delete({
      where: { id: oldest.id },
    });
  }
}

export async function processTokensJob(strapi: Strapi.Strapi) {
  console.log("processTokensJob start");
  const token = await getToken(strapi);

  if (token != null) {
    const created = new Date(token.createdAt);

    const expiry = new Date(created.getTime() + (token as any).expires_in * 1000);
    const diffInDays = new Date(expiry).getTime() - created.getTime();

    if (diffInDays < 20) {
      await createTokenEntry(strapi);
    }
  } else {
    await createTokenEntry(strapi);
    await cleanupTokens(strapi);
  }
  console.log("processTokensJob finished");
}
