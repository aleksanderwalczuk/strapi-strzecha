import { processTokensJob } from "../src/utils/ig";

export default {
  processTokensJob: {
    task: ({ strapi }) => {
      // Add your own logic here (e.g. send a queue of email, create a database backup, etc.).
      processTokensJob(strapi);
    },
    /*
     * Every sunday at 12.
     */
    options: {
      rule: "* * 12 * * 7",
    },
  },
};
