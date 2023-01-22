/**
 * product router
 */

import { factories } from '@strapi/strapi';

const defaultRouter = factories.createCoreRouter('api::product.product');

// const customRouter = (innerRouter, extraRoutes = []) => {
//   let routes;
//   return {
//     get prefix() {
//       return innerRouter.prefix;
//     },
//     get routes() {
//       if (!routes) routes = innerRouter.routes.concat(extraRoutes);
//       return routes;
//     },
//   };
// };

// const myExtraRoutes = [
//   {
//     method: "GET",
//     path: "/product/all/",
//     handler: "api::product.product.all",
//     config: {
//       auth: false,
//     },
//   },
// ];

export default defaultRouter;
