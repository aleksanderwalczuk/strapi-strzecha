
import { factories } from '@strapi/strapi';

export default factories.createCoreRouter('api::ig.ig', {
  prefix: '',
  only: ['find', 'auth'],
  except: [],
  config: {
    find: {
      auth: false,
      policies: [],
      middlewares: [],
    },
    findOne: {},
    create: {},
    update: {},
    delete: {},
  },
});

// export default factories.createCoreRouter('api::ig.ig');
