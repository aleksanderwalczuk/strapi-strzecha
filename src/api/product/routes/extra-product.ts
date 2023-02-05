import { factories } from '@strapi/strapi';

export default {
  routes: [
    { // Path defined with a URL parameter
      method: 'GET',
      path: '/product/',
      handler: 'product.product',
    },
  ]
}

