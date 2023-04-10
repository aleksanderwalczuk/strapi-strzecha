export default {
  routes: [
    {
      method: 'GET',
      path: '/product/search',
      handler: 'product.search',
    },
    {
      method: 'GET',
      path: '/product/related',
      handler: 'product.related',
    },
  ]
}
