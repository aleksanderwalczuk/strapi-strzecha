import { processTokensJob } from "../src/utils/ig";

export default {
  /*
   * Every sunday at 12.
   */

  "* * 12 * * 7": async ({ strapi }) => {
    // Add your own logic here (e.g. send a queue of email, create a database backup, etc.).
    await processTokensJob(strapi);
  },
};
